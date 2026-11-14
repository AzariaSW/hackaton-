import { query } from '../database.js';

export async function createCompany({ name, email }) {
  const result = await query(
    `INSERT INTO companies (name, email) VALUES ($1, $2)
     RETURNING id, name, email, status, allowed_origins, created_at, updated_at`,
    [name, email]
  );
  return result.rows[0];
}

export async function findCompanyByEmail(email) {
  const result = await query(
    'SELECT id, name, email, status, allowed_origins, created_at, updated_at FROM companies WHERE LOWER(email) = LOWER($1)',
    [email]
  );
  return result.rows[0] || null;
}

export async function findCompanyById(id) {
  const result = await query(
    'SELECT id, name, email, status, allowed_origins, created_at, updated_at FROM companies WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

export async function updateCompanyStatus(id, status) {
  const result = await query(
    'UPDATE companies SET status = $1 WHERE id = $2 RETURNING id, name, email, status, allowed_origins, created_at, updated_at',
    [status, id]
  );
  return result.rows[0] || null;
}

export async function updateCompanyAllowedOrigins(id, allowedOrigins) {
  const result = await query(
    'UPDATE companies SET allowed_origins = $1 WHERE id = $2 RETURNING id, name, email, status, allowed_origins, created_at, updated_at',
    [allowedOrigins, id]
  );
  return result.rows[0] || null;
}

export async function isCompanyActive(id) {
  const result = await query(
    'SELECT status FROM companies WHERE id = $1',
    [id]
  );
  return result.rows[0]?.status === 'active';
}
