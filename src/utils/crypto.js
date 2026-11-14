import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';

export function generateApiSecret() {
  return randomBytes(32).toString('base64url');
}

export function generateKeyPrefix() {
  return randomBytes(8).toString('hex').slice(0, 16);
}

export function hashApiSecret(secret) {
  return createHmac('sha256', env.API_KEY_PEPPER).update(secret).digest('hex');
}

export function verifyApiSecret(secret, storedHash) {
  const digest = hashApiSecret(secret);
  if (!/^[a-f0-9]+$/i.test(digest) || !/^[a-f0-9]+$/i.test(storedHash) || digest.length !== storedHash.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(storedHash, 'hex'));
}
