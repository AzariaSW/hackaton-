import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { logger } from '../config/logger.js';

const router = Router();
const registeredWebhooks = [];
const deliveryLog = [];

const webhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).default(['learner.created', 'learner.support_updated']),
});

export async function dispatchWebhookEvent(event, payload) {
  const targets = registeredWebhooks.filter((w) => w.events.includes(event));
  for (const target of targets) {
    const entry = {
      id: randomUUID(),
      webhookId: target.id,
      event,
      url: target.url,
      status: 'pending',
      attemptedAt: new Date().toISOString(),
    };
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(target.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-DigitalBridge-Event': event },
        body: JSON.stringify({ event, payload, timestamp: entry.attemptedAt }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      entry.status = response.ok ? 'delivered' : `http_${response.status}`;
    } catch (err) {
      entry.status = 'failed';
      logger.warn({ err: err.message, url: target.url }, 'Webhook delivery failed');
    }
    deliveryLog.unshift(entry);
    if (deliveryLog.length > 50) deliveryLog.pop();
  }
}

router.post('/', (req, res, next) => {
  try {
    const input = webhookSchema.parse(req.body);
    const webhook = {
      id: randomUUID(),
      url: input.url,
      events: input.events,
      createdAt: new Date().toISOString(),
    };
    registeredWebhooks.push(webhook);
    res.status(201).json({ webhook });
  } catch (err) {
    next(err);
  }
});

router.get('/', (_req, res) => {
  res.json({ webhooks: registeredWebhooks, recentDeliveries: deliveryLog });
});

export default router;
