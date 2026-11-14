# Database Architecture

## Overview

The Accessibility Onboarding Module uses PostgreSQL as its primary database. The module maintains only minimal metadata for host platform integrations. All learner data remains owned by the host platform.

## Data Ownership

**Module owns:**
- Company/tenant integration metadata
- API credentials (hashed secrets only)
- Integration configuration
- Minimal audit events

**Host platform owns:**
- Learner accounts and profiles
- Personal information
- Educational information
- Course enrollments
- Job applications
- CVs and certificates
- Accessibility accommodations and support preferences

## Security Rules

1. **Tenant Isolation**: All operations are scoped to authenticated API credentials
2. **Secret Management**: Raw API secrets are never stored; only HMAC-SHA256 hashes with server-side pepper
3. **Credential Verification**: Revoked and expired credentials are rejected
4. **Company Status**: Suspended companies cannot access protected endpoints
5. **No Learner Data**: Database contains no learner tables or personal information
6. **Audit Events**: Minimal, security-conscious events only
7. **Case-Insensitive Email**: Enforced via unique index

## Migration Instructions

### Prerequisites
- PostgreSQL 16+
- Node.js 20+
- Dependencies installed

### Commands

```bash
# Apply migrations
npm run db:migrate

# Rollback migrations
npm run db:migrate:down

# Create new migration
npm run db:migrate:create
```

## Local Development Setup

1. Start PostgreSQL: `docker compose up -d postgres`
2. Apply migrations: `npm run db:migrate`
3. Verify: `docker compose exec postgres psql -U accessibility_app -d accessibility_db -c "\dt"`

## Connection Configuration

- `DATABASE_URL`: PostgreSQL connection string
- `API_KEY_PEPPER`: Server-side secret for HMAC-SHA256 hashing (min 32 chars)

Pool settings: max 20 connections, 30s idle timeout, 10s connection timeout.
