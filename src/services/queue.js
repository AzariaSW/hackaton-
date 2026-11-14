import { logger } from '../config/logger.js';

export const VERIFICATION_QUEUE = 'identity.verification';
const inMemoryQueue = [];

export async function connectQueue() {
  logger.info('Using in-memory queue stub (RabbitMQ not configured)');
  return { inMemory: true };
}

export async function publishVerification(payload) {
  inMemoryQueue.push({
    ...payload,
    enqueuedAt: new Date().toISOString()
  });
}

export async function closeQueue() {
  inMemoryQueue.length = 0;
}
