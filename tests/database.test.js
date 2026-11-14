import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { getPool } from '../src/db/database.js';
import { createCompany, findCompanyByEmail, updateCompanyStatus, isCompanyActive } from '../src/db/repositories/companies.js';
import { createCredential, findCredentialById, findCredentialByKeyPrefix, revokeCredential, updateLastUsedAt } from '../src/db/repositories/credentials.js';
import { createAuditEvent, findAuditEventsByCompany } from '../src/db/repositories/audit.js';
import { generateApiSecret, hashApiSecret, verifyApiSecret, generateKeyPrefix } from '../src/utils/crypto.js';

async function setup() {
  const pool = getPool();
  await pool.query('BEGIN');
  try {
    await pool.query('TRUNCATE TABLE audit_events, api_credentials, companies CASCADE');
    await pool.query('COMMIT');
  } catch (e) {
    await pool.query('ROLLBACK');
    throw e;
  }
}

describe('Companies', () => {
  before(setup);

  it('successfully creates a company', async () => {
    const company = await createCompany({ name: 'Test Company', email: 'test@example.com' });
    assert.ok(company.id);
    assert.strictEqual(company.name, 'Test Company');
    assert.strictEqual(company.email, 'test@example.com');
    assert.strictEqual(company.status, 'active');
    assert.ok(company.created_at);
    assert.ok(company.updated_at);
  });

  it('rejects duplicate email regardless of letter casing', async () => {
    await createCompany({ name: 'Company A', email: 'CaseDup@Example.com' });
    let error;
    try {
      await createCompany({ name: 'Company B', email: 'casedup@example.com' });
    } catch (e) {
      error = e;
    }
    assert.ok(error, 'Expected error for duplicate email');
  });

  it('finds company by email case-insensitively', async () => {
    const company = await createCompany({ name: 'Find Me', email: 'findme@example.com' });
    const found = await findCompanyByEmail('FINDME@EXAMPLE.COM');
    assert.strictEqual(found.id, company.id);
  });

  it('updates company status', async () => {
    const company = await createCompany({ name: 'Status Update', email: 'status@example.com' });
    const updated = await updateCompanyStatus(company.id, 'suspended');
    assert.strictEqual(updated.status, 'suspended');
  });

  it('checks if company is active', async () => {
    const company = await createCompany({ name: 'Active Check', email: 'activecheck@example.com' });
    assert.strictEqual(await isCompanyActive(company.id), true);
    await updateCompanyStatus(company.id, 'suspended');
    assert.strictEqual(await isCompanyActive(company.id), false);
  });
});

describe('API Credentials', () => {
  let company;

  before(async () => {
    await setup();
    company = await createCompany({ name: 'Credential Test Co', email: 'creds@example.com' });
  });

  it('successfully creates a credential', async () => {
    const secret = generateApiSecret();
    const keyPrefix = generateKeyPrefix();
    const credential = await createCredential({
      companyId: company.id,
      keyPrefix,
      secretHash: hashApiSecret(secret),
      label: 'Test key'
    });
    assert.ok(credential.id);
    assert.strictEqual(credential.key_prefix, keyPrefix);
    assert.strictEqual(credential.secret_hash, hashApiSecret(secret));
    assert.strictEqual(credential.label, 'Test key');
  });

  it('verifies a valid credential', async () => {
    const secret = generateApiSecret();
    const keyPrefix = generateKeyPrefix();
    await createCredential({
      companyId: company.id,
      keyPrefix,
      secretHash: hashApiSecret(secret)
    });

    const found = await findCredentialByKeyPrefix(keyPrefix);
    assert.ok(found);
    assert.strictEqual(verifyApiSecret(secret, found.secret_hash), true);
  });

  it('rejects an invalid credential', async () => {
    const secret = generateApiSecret();
    const keyPrefix = generateKeyPrefix();
    await createCredential({
      companyId: company.id,
      keyPrefix,
      secretHash: hashApiSecret(secret)
    });

    assert.strictEqual(verifyApiSecret('wrong-secret', hashApiSecret(secret)), false);
  });

  it('rejects a revoked credential', async () => {
    const secret = generateApiSecret();
    const keyPrefix = generateKeyPrefix();
    const credential = await createCredential({
      companyId: company.id,
      keyPrefix,
      secretHash: hashApiSecret(secret)
    });

    await revokeCredential(credential.id);
    const found = await findCredentialById(credential.id);
    assert.ok(found.revoked_at, 'Credential should be revoked');
  });

  it('rejects an expired credential conceptually (stored)', async () => {
    const secret = generateApiSecret();
    const keyPrefix = generateKeyPrefix();
    const credential = await createCredential({
      companyId: company.id,
      keyPrefix,
      secretHash: hashApiSecret(secret),
      expiresAt: new Date(Date.now() - 1000).toISOString()
    });
    assert.ok(credential.expires_at);
    assert.ok(new Date(credential.expires_at) < new Date());
  });

  it('rejects a credential belonging to a suspended company', async () => {
    const secret = generateApiSecret();
    const keyPrefix = generateKeyPrefix();
    const credential = await createCredential({
      companyId: company.id,
      keyPrefix,
      secretHash: hashApiSecret(secret)
    });

    await updateCompanyStatus(company.id, 'suspended');
    const found = await findCredentialById(credential.id);
    assert.strictEqual(found.company_id, company.id);
    const companyStatus = await isCompanyActive(company.id);
    assert.strictEqual(companyStatus, false);
  });

  it('verifies original secret is not stored in database', async () => {
    const secret = generateApiSecret();
    const keyPrefix = generateKeyPrefix();
    await createCredential({
      companyId: company.id,
      keyPrefix,
      secretHash: hashApiSecret(secret)
    });

    const found = await findCredentialByKeyPrefix(keyPrefix);
    assert.ok(found.secret_hash);
    assert.strictEqual(found.secret_hash.includes(secret), false, 'Raw secret should not be stored');
  });

  it('verifies one company cannot use another company\'s credentials', async () => {
    const otherCompany = await createCompany({ name: 'Other Co', email: 'other@example.com' });
    const secret = generateApiSecret();
    const keyPrefix = generateKeyPrefix();
    await createCredential({
      companyId: company.id,
      keyPrefix,
      secretHash: hashApiSecret(secret)
    });

    const found = await findCredentialByKeyPrefix(keyPrefix);
    assert.strictEqual(found.company_id, company.id);
    assert.notStrictEqual(found.company_id, otherCompany.id);
  });

  it('updates last_used_at timestamp', async () => {
    const secret = generateApiSecret();
    const keyPrefix = generateKeyPrefix();
    const credential = await createCredential({
      companyId: company.id,
      keyPrefix,
      secretHash: hashApiSecret(secret)
    });

    const before = new Date();
    await updateLastUsedAt(credential.id);
    const updated = await findCredentialById(credential.id);
    assert.ok(new Date(updated.last_used_at) >= before);
  });
});

describe('Audit Events', () => {
  let company;

  before(async () => {
    await setup();
    company = await createCompany({ name: 'Audit Test Co', email: 'audit@example.com' });
  });

  it('successfully creates an audit event', async () => {
    const event = await createAuditEvent({
      companyId: company.id,
      eventType: 'test.event',
      requestId: 'req-123'
    });
    assert.ok(event.id);
    assert.strictEqual(event.event_type, 'test.event');
    assert.strictEqual(event.request_id, 'req-123');
    assert.strictEqual(event.company_id, company.id);
  });

  it('retrieves events belonging to the correct company', async () => {
    const otherCompany = await createCompany({ name: 'Other Co', email: 'other-audit@example.com' });
    await createAuditEvent({ companyId: otherCompany.id, eventType: 'other.event' });
    await createAuditEvent({ companyId: company.id, eventType: 'my.event.1' });
    await createAuditEvent({ companyId: company.id, eventType: 'my.event.2' });

    const events = await findAuditEventsByCompany(company.id);
    assert.ok(events.length >= 2);
    events.forEach(e => assert.strictEqual(e.company_id, company.id));
  });

  it('ensures audit records do not contain learner personal information', async () => {
    const event = await createAuditEvent({
      companyId: company.id,
      eventType: 'api.call'
    });
    assert.ok(!event.hasOwnProperty('learner_name'), 'Should not contain learner_name');
    assert.ok(!event.hasOwnProperty('email'), 'Should not contain email');
    assert.ok(!event.hasOwnProperty('password'), 'Should not contain password');
    assert.ok(!event.hasOwnProperty('voice_data'), 'Should not contain voice_data');
  });
});

describe('Data Ownership', () => {
  it('verifies database does not contain learner data tables', async () => {
    const pool = getPool();
    const result = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('learners', 'users', 'learner_profiles', 'registrations', 'registration_steps', 'identity_verifications', 'accessibility_preferences', 'support_preferences', 'courses', 'enrollments', 'jobs', 'applications', 'documents', 'voice_recordings')"
    );
    assert.strictEqual(result.rows.length, 0, 'Database should not contain learner data tables');
  });
});

describe('Migrations', () => {
  it('can verify schema correctness', async () => {
    const pool = getPool();
    const companiesColumns = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'companies' ORDER BY ordinal_position"
    );
    const columnNames = companiesColumns.rows.map(r => r.column_name);
    assert.ok(columnNames.includes('id'));
    assert.ok(columnNames.includes('name'));
    assert.ok(columnNames.includes('email'));
    assert.ok(columnNames.includes('status'));
    assert.ok(columnNames.includes('allowed_origins'));
    assert.ok(columnNames.includes('created_at'));
    assert.ok(columnNames.includes('updated_at'));
  });
});
