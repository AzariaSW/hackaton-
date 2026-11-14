import { Router } from 'express';
import { z } from 'zod';
import {
  createCompany,
  findCompanyByEmail,
  updateCompanyStatus,
  updateCompanyAllowedOrigins
} from '../db/repositories/companies.js';
import { createCredential, listActiveCredentialsForCompany, revokeAllCompanyCredentials } from '../db/repositories/credentials.js';
import { createAuditEvent, findAuditEventsByCompany } from '../db/repositories/audit.js';
import { requireCompany } from '../middleware/company-auth.js';
import { generateApiSecret, hashApiSecret, generateKeyPrefix } from '../utils/crypto.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(255).transform(v => v.toLowerCase()),
  allowedOrigins: z.array(z.string().url()).default([])
});

router.post('/register', async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);

    const existing = await findCompanyByEmail(input.email);
    if (existing) {
      return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'A company with this email already exists' } });
    }

    const company = await createCompany({
      name: input.name,
      email: input.email
    });

    const secret = generateApiSecret();
    const keyPrefix = generateKeyPrefix();
    const credential = await createCredential({
      companyId: company.id,
      keyPrefix,
      secretHash: hashApiSecret(secret),
      label: 'Default key'
    });

    await createAuditEvent({
      companyId: company.id,
      eventType: 'company.registered',
      requestId: req.get('x-request-id')
    });

    res.status(201).json({
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        status: company.status,
        allowedOrigins: company.allowed_origins,
        createdAt: company.created_at
      },
      apiKey: `${credential.key_prefix}.${secret}`,
      warning: 'Copy this API key now. It will not be shown again.'
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireCompany, async (req, res) => {
  res.json({
    company: {
      id: req.company.company.id,
      name: req.company.company.name,
      email: req.company.company.email,
      status: req.company.company.status,
      allowedOrigins: req.company.company.allowed_origins,
      createdAt: req.company.company.created_at,
      updatedAt: req.company.company.updated_at
    }
  });
});

router.get('/me/credentials', requireCompany, async (req, res) => {
  const credentials = await listActiveCredentialsForCompany(req.company.id);
  res.json({ credentials: credentials.map(c => ({
    id: c.id,
    keyPrefix: c.key_prefix,
    label: c.label,
    scopes: c.scopes,
    expiresAt: c.expires_at,
    revokedAt: c.revoked_at,
    lastUsedAt: c.last_used_at,
    createdAt: c.created_at
  }))});
});

router.post('/me/credentials/rotate', requireCompany, async (req, res, next) => {
  try {
    const secret = generateApiSecret();
    const keyPrefix = generateKeyPrefix();

    await revokeAllCompanyCredentials(req.company.id);

    const credential = await createCredential({
      companyId: req.company.id,
      keyPrefix,
      secretHash: hashApiSecret(secret),
      label: 'Rotated key'
    });

    await createAuditEvent({
      companyId: req.company.id,
      eventType: 'credential.rotated',
      requestId: req.get('x-request-id')
    });

    res.status(201).json({
      apiKey: `${credential.key_prefix}.${secret}`,
      warning: 'Previous API keys have been revoked. Copy this key now.'
    });
  } catch (err) {
    next(err);
  }
});

router.put('/me/allowed-origins', requireCompany, async (req, res, next) => {
  try {
    const schema = z.object({ allowedOrigins: z.array(z.string().url()).default([]) });
    const { allowedOrigins } = schema.parse(req.body);

    const company = await updateCompanyAllowedOrigins(req.company.id, allowedOrigins);

    await createAuditEvent({
      companyId: req.company.id,
      eventType: 'company.allowed_origins_updated',
      requestId: req.get('x-request-id')
    });

    res.json({
      company: {
        id: company.id,
        allowedOrigins: company.allowed_origins,
        updatedAt: company.updated_at
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/me/suspend', requireCompany, async (req, res, next) => {
  try {
    const company = await updateCompanyStatus(req.company.id, 'suspended');

    await createAuditEvent({
      companyId: req.company.id,
      eventType: 'company.suspended',
      requestId: req.get('x-request-id')
    });

    res.json({
      company: {
        id: company.id,
        status: company.status,
        updatedAt: company.updated_at
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/me/activate', requireCompany, async (req, res, next) => {
  try {
    const company = await updateCompanyStatus(req.company.id, 'active');

    await createAuditEvent({
      companyId: req.company.id,
      eventType: 'company.activated',
      requestId: req.get('x-request-id')
    });

    res.json({
      company: {
        id: company.id,
        status: company.status,
        updatedAt: company.updated_at
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me/audit-events', requireCompany, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);
  const offset = parseInt(req.query.offset) || 0;

  const events = await findAuditEventsByCompany(req.company.id, { limit, offset });

  res.json({
    events: events.map(e => ({
      id: e.id,
      eventType: e.event_type,
      requestId: e.request_id,
      createdAt: e.created_at
    }))
  });
});

export default router;
