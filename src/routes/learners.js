import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { dispatchWebhookEvent } from './webhooks.js';
import { isValidEthiopianPhone, normalizeEthiopianPhone } from '../../module/src/utils/phone.js';

const router = Router();

// Stateless relay / ephemeral demonstration store (zero learner tables in PostgreSQL per SRS §7.5)
const relayStore = new Map();
const idempotencyIndex = new Map();

const createLearnerSchema = z.object({
  name: z.string().trim().min(1).max(150),
  phone: z.string().trim().min(7).max(25).optional(),
  language: z.string().trim().min(2).max(10).default('en'),
  idRoute: z.enum(['national_id', 'refugee_id', 'other', 'partner_referral']).optional(),
  consent: z.object({
    accepted: z.boolean().default(true),
    recordedAt: z.string().optional(),
  }).optional(),
});

const patchLearnerSchema = z.object({
  name: z.string().trim().min(1).max(150).optional(),
  phone: z.string().trim().min(7).max(25).optional(),
  language: z.string().trim().min(2).max(10).optional(),
  idRoute: z.enum(['national_id', 'refugee_id', 'other', 'partner_referral']).optional(),
});

const supportSchema = z.object({
  support: z.array(z.string().trim().min(1).max(60)).default([]),
});

const refugeeIdCheckSchema = z.object({
  fin: z.string().trim().min(1).max(64),
  documentFin: z.string().trim().min(1).max(64).optional(),
});

function normalizeFin(value) {
  return value.normalize('NFKC').toLocaleUpperCase('en').replace(/[^\p{L}\p{N}]/gu, '');
}

router.post('/refugee-id/check', (req, res, next) => {
  try {
    const input = refugeeIdCheckSchema.parse(req.body);
    if (!input.documentFin) {
      return res.json({
        status: 'manual_entry',
        textMatch: null,
        authenticityVerified: false,
      });
    }

    const enteredFin = normalizeFin(input.fin);
    const documentFin = normalizeFin(input.documentFin);
    const textMatch = Boolean(enteredFin && documentFin && enteredFin === documentFin);
    return res.json({
      status: textMatch ? 'text_match' : 'mismatch',
      textMatch,
      authenticityVerified: false,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const idempotencyKey = req.get('idempotency-key');
    if (idempotencyKey && idempotencyIndex.has(idempotencyKey)) {
      const existingId = idempotencyIndex.get(idempotencyKey);
      return res.status(200).json({ id: existingId, deduplicated: true });
    }

    const input = createLearnerSchema.parse(req.body);
    if (input.phone && !isValidEthiopianPhone(input.phone)) {
      return res.status(400).json({
        error: { code: 'INVALID_PHONE', message: 'Please enter a valid Ethiopian phone number (09..., 07..., or +251...).' },
      });
    }
    const normalizedPhone = input.phone ? normalizeEthiopianPhone(input.phone) : undefined;
    const id = randomUUID();
    const now = new Date().toISOString();
    const record = {
      id,
      profile: {
        name: input.name,
        ...(normalizedPhone ? { phone: normalizedPhone } : {}),
        language: input.language,
        ...(input.idRoute ? { idRoute: input.idRoute } : {}),
        consent: input.consent || { accepted: true, recordedAt: now },
        createdAt: now,
        updatedAt: now,
      },
      support: null, // Stored apart per SRS FR-SUP-03
    };

    relayStore.set(id, record);
    if (idempotencyKey) idempotencyIndex.set(idempotencyKey, id);

    await dispatchWebhookEvent('learner.created', {
      learnerId: id,
      language: input.language,
      idRoute: input.idRoute || null,
    });

    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const record = relayStore.get(req.params.id);
    if (!record) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Learner relay record not found' } });
    }
    const patch = patchLearnerSchema.parse(req.body);
    if (patch.phone) {
      if (!isValidEthiopianPhone(patch.phone)) {
        return res.status(400).json({
          error: { code: 'INVALID_PHONE', message: 'Please enter a valid Ethiopian phone number (09..., 07..., or +251...).' },
        });
      }
      patch.phone = normalizeEthiopianPhone(patch.phone);
    }
    record.profile = {
      ...record.profile,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    res.json({ id: record.id, profile: record.profile });
  } catch (err) {
    next(err);
  }
});

router.put('/:id/support', async (req, res, next) => {
  try {
    const record = relayStore.get(req.params.id);
    if (!record) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Learner relay record not found' } });
    }
    const { support } = supportSchema.parse(req.body);
    record.support = {
      choices: support,
      updatedAt: new Date().toISOString(),
    };
    await dispatchWebhookEvent('learner.support_updated', {
      learnerId: record.id,
      hasPreferences: support.length > 0,
    });
    res.json({ id: record.id, storedSeparately: true, count: support.length });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/export', (req, res) => {
  const record = relayStore.get(req.params.id);
  if (!record) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Learner relay record not found' } });
  }
  res.json({
    id: record.id,
    profile: record.profile,
    support: record.support,
    exportedAt: new Date().toISOString(),
  });
});

router.delete('/:id', (req, res) => {
  const existed = relayStore.delete(req.params.id);
  if (!existed) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Learner relay record not found' } });
  }
  res.json({ deleted: true, id: req.params.id });
});

export default router;
