import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { env } from '../config/env.js';

let pool = null;
let useMockDb = !env.DATABASE_URL;

// In-memory mock store for when PostgreSQL is not provisioned
const mockStore = {
  companies: [],
  api_credentials: [],
  audit_events: [],
};

function createMockPool() {
  return {
    query: async (text, params) => mockQuery(text, params),
    connect: async () => ({
      query: async (text, params) => mockQuery(text, params),
      release: () => {},
    }),
    end: async () => {},
    on: () => {},
  };
}

function mockQuery(text, params = []) {
  const sql = text.replace(/\s+/g, ' ').trim();
  const upper = sql.toUpperCase();

  if (upper === 'BEGIN' || upper === 'COMMIT' || upper === 'ROLLBACK') {
    return { rows: [], rowCount: 0 };
  }

  if (upper.startsWith('TRUNCATE TABLE')) {
    mockStore.audit_events.length = 0;
    mockStore.api_credentials.length = 0;
    mockStore.companies.length = 0;
    return { rows: [], rowCount: 0 };
  }

  // Companies
  if (sql.includes('INSERT INTO companies')) {
    const [name, email] = params;
    const duplicate = mockStore.companies.find(
      (c) => c.email.toLowerCase() === String(email).toLowerCase()
    );
    if (duplicate) {
      const err = new Error('duplicate key value violates unique constraint');
      err.code = '23505';
      throw err;
    }
    const now = new Date().toISOString();
    const row = {
      id: randomUUID(),
      name,
      email,
      status: 'active',
      allowed_origins: [],
      created_at: now,
      updated_at: now,
    };
    mockStore.companies.push(row);
    return { rows: [row], rowCount: 1 };
  }

  if (sql.includes('FROM companies WHERE LOWER(email) = LOWER($1)')) {
    const [email] = params;
    const row = mockStore.companies.find(
      (c) => c.email.toLowerCase() === String(email).toLowerCase()
    );
    return { rows: row ? [row] : [], rowCount: row ? 1 : 0 };
  }

  if (sql.includes('SELECT status FROM companies WHERE id = $1')) {
    const [id] = params;
    const row = mockStore.companies.find((c) => c.id === id);
    return { rows: row ? [{ status: row.status }] : [], rowCount: row ? 1 : 0 };
  }

  if (sql.includes('FROM companies WHERE id = $1')) {
    const [id] = params;
    const row = mockStore.companies.find((c) => c.id === id);
    return { rows: row ? [row] : [], rowCount: row ? 1 : 0 };
  }

  if (sql.includes('UPDATE companies SET status = $1 WHERE id = $2')) {
    const [status, id] = params;
    const row = mockStore.companies.find((c) => c.id === id);
    if (!row) return { rows: [], rowCount: 0 };
    row.status = status;
    row.updated_at = new Date().toISOString();
    return { rows: [row], rowCount: 1 };
  }

  if (sql.includes('UPDATE companies SET allowed_origins = $1 WHERE id = $2')) {
    const [allowedOrigins, id] = params;
    const row = mockStore.companies.find((c) => c.id === id);
    if (!row) return { rows: [], rowCount: 0 };
    row.allowed_origins = allowedOrigins;
    row.updated_at = new Date().toISOString();
    return { rows: [row], rowCount: 1 };
  }

  // API Credentials
  if (sql.includes('INSERT INTO api_credentials')) {
    const [companyId, keyPrefix, secretHash, label, scopes, expiresAt] = params;
    const row = {
      id: randomUUID(),
      company_id: companyId,
      key_prefix: keyPrefix,
      secret_hash: secretHash,
      label: label ?? 'Default key',
      scopes: scopes ?? [],
      expires_at: expiresAt ?? null,
      revoked_at: null,
      last_used_at: null,
      created_at: new Date().toISOString(),
    };
    mockStore.api_credentials.push(row);
    return { rows: [row], rowCount: 1 };
  }

  if (sql.includes('FROM api_credentials WHERE id = $1')) {
    const [id] = params;
    const row = mockStore.api_credentials.find((c) => c.id === id);
    return { rows: row ? [row] : [], rowCount: row ? 1 : 0 };
  }

  if (sql.includes('FROM api_credentials WHERE key_prefix = $1')) {
    const [keyPrefix] = params;
    const row = mockStore.api_credentials.find((c) => c.key_prefix === keyPrefix);
    return { rows: row ? [row] : [], rowCount: row ? 1 : 0 };
  }

  if (sql.includes('UPDATE api_credentials SET revoked_at = NOW() WHERE id = $1')) {
    const [id] = params;
    const row = mockStore.api_credentials.find((c) => c.id === id && !c.revoked_at);
    if (!row) return { rows: [], rowCount: 0 };
    row.revoked_at = new Date().toISOString();
    return { rows: [row], rowCount: 1 };
  }

  if (sql.includes('UPDATE api_credentials SET revoked_at = NOW() WHERE company_id = $1')) {
    const [companyId] = params;
    const now = new Date().toISOString();
    const updated = [];
    for (const c of mockStore.api_credentials) {
      if (c.company_id === companyId && !c.revoked_at) {
        c.revoked_at = now;
        updated.push({ id: c.id });
      }
    }
    return { rows: updated, rowCount: updated.length };
  }

  if (sql.includes('UPDATE api_credentials SET last_used_at = NOW() WHERE id = $1')) {
    const [id] = params;
    const row = mockStore.api_credentials.find((c) => c.id === id);
    if (!row) return { rows: [], rowCount: 0 };
    row.last_used_at = new Date().toISOString();
    return { rows: [{ id: row.id }], rowCount: 1 };
  }

  if (sql.includes('FROM api_credentials WHERE company_id = $1 AND revoked_at IS NULL')) {
    const [companyId] = params;
    const rows = mockStore.api_credentials
      .filter((c) => c.company_id === companyId && !c.revoked_at)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows, rowCount: rows.length };
  }

  // Audit Events
  if (sql.includes('INSERT INTO audit_events')) {
    const [companyId, eventType, requestId] = params;
    const row = {
      id: randomUUID(),
      company_id: companyId,
      event_type: eventType,
      request_id: requestId ?? null,
      created_at: new Date().toISOString(),
    };
    mockStore.audit_events.push(row);
    return { rows: [row], rowCount: 1 };
  }

  if (sql.includes('SELECT COUNT(*) as count FROM audit_events WHERE company_id = $1')) {
    const [companyId] = params;
    const count = mockStore.audit_events.filter((e) => e.company_id === companyId).length;
    return { rows: [{ count: String(count) }], rowCount: 1 };
  }

  if (sql.includes('FROM audit_events WHERE company_id = $1')) {
    const [companyId, limit = 100, offset = 0] = params;
    const rows = mockStore.audit_events
      .filter((e) => e.company_id === companyId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(offset, offset + limit);
    return { rows, rowCount: rows.length };
  }

  if (sql.includes('information_schema.tables')) {
    return { rows: [], rowCount: 0 };
  }

  if (sql.includes('information_schema.columns')) {
    return {
      rows: ['id', 'name', 'email', 'status', 'allowed_origins', 'created_at', 'updated_at'].map(
        (column_name) => ({ column_name })
      ),
      rowCount: 7,
    };
  }

  return { rows: [], rowCount: 0 };
}

export function getPool() {
  if (useMockDb) {
    if (!pool) {
      console.warn('[AI Studio] DATABASE_URL not configured — using in-memory database mock');
      pool = createMockPool();
    }
    return pool;
  }

  if (!pool) {
    try {
      pool = new Pool({
        connectionString: env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      pool.on('error', (err) => {
        console.warn('PostgreSQL pool error — falling back to in-memory mock:', err.message);
        useMockDb = true;
        pool = createMockPool();
      });
    } catch (err) {
      console.warn('Failed to create PostgreSQL pool — using in-memory mock:', err.message);
      useMockDb = true;
      pool = createMockPool();
    }
  }
  return pool;
}

export async function query(text, params) {
  const activePool = getPool();
  const start = process.hrtime.bigint();
  try {
    const result = await activePool.query(text, params);
    const duration = Number(process.hrtime.bigint() - start) / 1e6;
    console.debug('Executed query', {
      text: text.replace(/\s+/g, ' ').trim(),
      duration: `${duration.toFixed(2)}ms`,
      rows: result.rowCount,
    });
    return result;
  } catch (error) {
    if (!useMockDb && (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT')) {
      console.warn('PostgreSQL unreachable — switching to in-memory database mock:', error.message);
      useMockDb = true;
      pool = createMockPool();
      return mockQuery(text, params);
    }
    console.error('Database query error:', { text, error: error.message });
    throw error;
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
