import { query } from '../database.js';

export async function createCredential({ companyId, keyPrefix, secretHash, label = 'Default key', scopes = [], expiresAt = null }) {
  const result = await query(
    `INSERT INTO api_credentials (company_id, key_prefix, secret_hash, label, scopes, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, company_id, key_prefix, secret_hash, label, scopes, expires_at, revoked_at, last_used_at, created_at`,
    [companyId, keyPrefix, secretHash, label, scopes, expiresAt]
  );
  return result.rows[0];
}

export async function findCredentialById(id) {
  const result = await query(
    `SELECT id, company_id, key_prefix, secret_hash, label, scopes, expires_at, revoked_at, last_used_at, created_at
     FROM api_credentials
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function findCredentialByKeyPrefix(keyPrefix) {
  const result = await query(
    `SELECT id, company_id, key_prefix, secret_hash, label, scopes, expires_at, revoked_at, last_used_at, created_at
     FROM api_credentials
     WHERE key_prefix = $1`,
    [keyPrefix]
  );
  return result.rows[0] || null;
}

export async function revokeCredential(id) {
  const result = await query(
    `UPDATE api_credentials SET revoked_at = NOW() WHERE id = $1 AND revoked_at IS NULL
     RETURNING id, company_id, key_prefix, revoked_at`,
    [id]
  );
  return result.rows[0] || null;
}

export async function revokeAllCompanyCredentials(companyId) {
  const result = await query(
    `UPDATE api_credentials SET revoked_at = NOW() WHERE company_id = $1 AND revoked_at IS NULL
     RETURNING id`,
    [companyId]
  );
  return result.rows;
}

export async function updateLastUsedAt(id) {
  const result = await query(
    'UPDATE api_credentials SET last_used_at = NOW() WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rows[0] || null;
}

export async function listActiveCredentialsForCompany(companyId) {
  const result = await query(
    `SELECT id, company_id, key_prefix, label, scopes, expires_at, revoked_at, last_used_at, created_at
     FROM api_credentials
     WHERE company_id = $1 AND revoked_at IS NULL
     ORDER BY created_at DESC`,
    [companyId]
  );
  return result.rows;
}
