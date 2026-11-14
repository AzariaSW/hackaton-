import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { normalizeEthiopianPhone } from '../../module/src/utils/phone.js';

const router = Router();

// Host-platform demo store (in-memory host layer — never stored in module PostgreSQL tables)
const hostAccountsByPhone = new Map();
const hostSessions = new Map();

function hashPin(pin) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(pin, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPin(pin, stored) {
  if (!stored) return false;
  const [salt, hashHex] = stored.split(':');
  if (!salt || !hashHex) return false;
  const derived = scryptSync(pin, salt, 32);
  const expected = Buffer.from(hashHex, 'hex');
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

function issueSessionToken(accountId) {
  const raw = randomBytes(24).toString('base64url');
  const token = `${raw}.${createHmac('sha256', env.API_KEY_PEPPER).update(raw).digest('hex').slice(0, 16)}`;
  hostSessions.set(token, { accountId, createdAt: Date.now() });
  return token;
}

function requireHostSession(req, res, next) {
  const auth = req.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token || !hostSessions.has(token)) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Valid sign-in session required' } });
  }
  const session = hostSessions.get(token);
  const account = [...hostAccountsByPhone.values()].find((a) => a.id === session.accountId);
  if (!account) {
    hostSessions.delete(token);
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Account not found' } });
  }
  req.hostAccount = account;
  req.hostToken = token;
  next();
}

const signupSchema = z.object({
  name: z.string().trim().min(1).max(150),
  phone: z.string().trim().min(7).max(25),
  language: z.enum(['en', 'am']).default('en'),
  idRoute: z.enum(['national_id', 'refugee_id', 'other', 'partner_referral']).default('national_id'),
  referralCode: z.string().trim().max(40).nullable().optional(),
  pin: z.string().trim().min(4).max(64).optional(),
  support: z.array(z.string().trim().max(60)).optional()
});

const loginSchema = z.object({
  phone: z.string().trim().min(7).max(25),
  pin: z.string().trim().optional(),
  referralCode: z.string().trim().optional()
});

router.post('/signup', (req, res, next) => {
  try {
    const input = signupSchema.parse(req.body);
    const phone = normalizeEthiopianPhone(input.phone);
    if (!phone) {
      return res.status(400).json({ error: { code: 'INVALID_PHONE', message: 'Please enter a valid Ethiopian phone number (09..., 07..., or +251...).' } });
    }

    if (hostAccountsByPhone.has(phone)) {
      return res.status(409).json({ error: { code: 'ACCOUNT_EXISTS', message: 'An account with this phone number already exists. Please log in instead.' } });
    }

    const id = randomUUID();
    const referralCode = input.referralCode || (input.idRoute === 'partner_referral' ? `DB-REF-${id.slice(0, 8).toUpperCase()}` : null);
    const account = {
      id,
      name: input.name,
      phone,
      language: input.language,
      idRoute: input.idRoute,
      referralCode,
      pinHash: input.pin ? hashPin(input.pin) : null,
      support: Array.isArray(input.support) ? input.support : [],
      createdAt: new Date().toISOString()
    };

    hostAccountsByPhone.set(phone, account);
    const token = issueSessionToken(account.id);

    res.status(201).json({
      token,
      learner: {
        id: account.id,
        name: account.name,
        phone: account.phone,
        language: account.language,
        idRoute: account.idRoute,
        referralCode: account.referralCode,
        createdAt: account.createdAt
      },
      support: account.support
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const phone = normalizeEthiopianPhone(input.phone);
    if (!phone) {
      return res.status(400).json({ error: { code: 'INVALID_PHONE', message: 'Please enter a valid Ethiopian phone number.' } });
    }

    const account = hostAccountsByPhone.get(phone);
    if (!account) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'No account found for that phone number.' } });
    }

    const referralMatches = Boolean(
      input.referralCode &&
      account.referralCode &&
      input.referralCode.trim().toUpperCase() === account.referralCode.toUpperCase()
    );

    if (account.pinHash) {
      const pinMatches = Boolean(input.pin && verifyPin(input.pin, account.pinHash));
      if (!pinMatches && !referralMatches) {
        return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect PIN or referral code.' } });
      }
    } else if (input.referralCode && !referralMatches) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Referral code does not match this account.' } });
    }

    const token = issueSessionToken(account.id);
    res.json({
      token,
      learner: {
        id: account.id,
        name: account.name,
        phone: account.phone,
        language: account.language,
        idRoute: account.idRoute,
        referralCode: account.referralCode,
        createdAt: account.createdAt
      },
      support: account.support
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireHostSession, (req, res) => {
  const a = req.hostAccount;
  res.json({
    learner: {
      id: a.id,
      name: a.name,
      phone: a.phone,
      language: a.language,
      idRoute: a.idRoute,
      referralCode: a.referralCode,
      createdAt: a.createdAt
    },
    support: a.support
  });
});

router.put('/me/support', requireHostSession, (req, res, next) => {
  try {
    const { support } = z.object({ support: z.array(z.string().trim().max(60)) }).parse(req.body);
    req.hostAccount.support = support;
    res.json({ support: req.hostAccount.support });
  } catch (err) {
    next(err);
  }
});

router.delete('/me', requireHostSession, (req, res) => {
  hostAccountsByPhone.delete(req.hostAccount.phone);
  hostSessions.delete(req.hostToken);
  res.json({ deleted: true });
});

router.post('/logout', requireHostSession, (req, res) => {
  hostSessions.delete(req.hostToken);
  res.json({ loggedOut: true });
});

export default router;
