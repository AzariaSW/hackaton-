import { getPool } from '../database.js';

export async function up() {
  const pool = getPool();
  await pool.query('BEGIN');

  try {
    await pool.query(`
      CREATE TABLE companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
        allowed_origins TEXT[] NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE UNIQUE INDEX idx_companies_email_lower ON companies (LOWER(email));
    `);

    await pool.query(`
      CREATE TABLE api_credentials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        key_prefix VARCHAR(16) NOT NULL UNIQUE,
        secret_hash CHAR(64) NOT NULL UNIQUE,
        label VARCHAR(100) NOT NULL DEFAULT 'Default key',
        scopes TEXT[] NOT NULL DEFAULT '{}',
        expires_at TIMESTAMPTZ,
        revoked_at TIMESTAMPTZ,
        last_used_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE INDEX idx_api_credentials_company_id ON api_credentials(company_id);
    `);

    await pool.query(`
      CREATE INDEX idx_api_credentials_active ON api_credentials(company_id) WHERE revoked_at IS NULL;
    `);

    await pool.query(`
      CREATE TABLE audit_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        event_type VARCHAR(100) NOT NULL,
        request_id VARCHAR(100),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE INDEX idx_audit_events_company_created ON audit_events(company_id, created_at DESC);
    `);

    await pool.query(`
      CREATE INDEX idx_audit_events_type_created ON audit_events(event_type, created_at DESC);
    `);

    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await pool.query(`
      CREATE TRIGGER update_companies_updated_at
      BEFORE UPDATE ON companies
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
}

export async function down() {
  const pool = getPool();
  await pool.query('BEGIN');

  try {
    await pool.query('DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;');
    await pool.query('DROP FUNCTION IF EXISTS update_updated_at_column;');
    await pool.query('DROP TABLE IF EXISTS audit_events CASCADE;');
    await pool.query('DROP TABLE IF EXISTS api_credentials CASCADE;');
    await pool.query('DROP TABLE IF EXISTS companies CASCADE;');
    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
}
