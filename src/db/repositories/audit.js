import { query } from '../database.js';

export async function createAuditEvent({ companyId, eventType, requestId = null }) {
  const result = await query(
    `INSERT INTO audit_events (company_id, event_type, request_id)
     VALUES ($1, $2, $3)
     RETURNING id, company_id, event_type, request_id, created_at`,
    [companyId, eventType, requestId]
  );
  return result.rows[0];
}

export async function findAuditEventsByCompany(companyId, { limit = 100, offset = 0 } = {}) {
  const result = await query(
    `SELECT id, company_id, event_type, request_id, created_at
     FROM audit_events
     WHERE company_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [companyId, limit, offset]
  );
  return result.rows;
}

export async function countAuditEventsByCompany(companyId) {
  const result = await query(
    'SELECT COUNT(*) as count FROM audit_events WHERE company_id = $1',
    [companyId]
  );
  return parseInt(result.rows[0].count, 10);
}
