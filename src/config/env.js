import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().optional().default(''),
  REDIS_URL: z.string().optional().default(''),
  RABBITMQ_URL: z.string().optional().default(''),
  API_KEY_PEPPER: z.string().min(32).default('dev-accessibility-onboarding-pepper-key-32bytes!'),
  CORS_ORIGIN: z.string().default('*')
});

const parsed = schema.safeParse({
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL || undefined,
  REDIS_URL: process.env.REDIS_URL || undefined,
  RABBITMQ_URL: process.env.RABBITMQ_URL || undefined,
  API_KEY_PEPPER: process.env.API_KEY_PEPPER || undefined,
  CORS_ORIGIN: process.env.CORS_ORIGIN || undefined,
});

if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
