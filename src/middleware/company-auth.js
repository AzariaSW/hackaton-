import { findCredentialById, findCredentialByKeyPrefix, updateLastUsedAt } from '../db/repositories/credentials.js';
import { findCompanyById } from '../db/repositories/companies.js';
import { verifyApiSecret } from '../utils/crypto.js';

export async function requireCompany(req, res, next) {
  try {
    const raw = req.get('x-api-key');
    if (!raw) {
      return res.status(401).json({ error: { code: 'API_KEY_REQUIRED', message: 'Company API key required' } });
    }

    const [credentialId, secret, extra] = raw.split('.');
    if (!credentialId || !secret || extra) {
      return res.status(401).json({ error: { code: 'INVALID_API_KEY', message: 'Invalid API key' } });
    }

    const credential = (await findCredentialByKeyPrefix(credentialId)) || (await findCredentialById(credentialId));

    if (!credential) {
      return res.status(401).json({ error: { code: 'INVALID_API_KEY', message: 'Invalid API key' } });
    }

    if (credential.revoked_at) {
      return res.status(401).json({ error: { code: 'CREDENTIAL_REVOKED', message: 'API credential has been revoked' } });
    }

    if (credential.expires_at && new Date(credential.expires_at) < new Date()) {
      return res.status(401).json({ error: { code: 'CREDENTIAL_EXPIRED', message: 'API credential has expired' } });
    }

    const company = await findCompanyById(credential.company_id);

    if (!company) {
      return res.status(401).json({ error: { code: 'INVALID_API_KEY', message: 'Invalid API key' } });
    }

    if (company.status !== 'active') {
      return res.status(403).json({ error: { code: 'COMPANY_SUSPENDED', message: 'Company account is suspended' } });
    }

    if (!verifyApiSecret(secret, credential.secret_hash)) {
      return res.status(401).json({ error: { code: 'INVALID_API_KEY', message: 'Invalid API key' } });
    }

    await updateLastUsedAt(credential.id);

    req.company = { id: company.id, company };
    next();
  } catch (err) {
    next(err);
  }
}
