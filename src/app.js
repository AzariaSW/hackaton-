import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { logger } from './config/logger.js';
import { env } from './config/env.js';
import companiesRouter from './routes/companies.js';
import learnersRouter from './routes/learners.js';
import webhooksRouter from './routes/webhooks.js';
import hostAuthRouter from './routes/host-auth.js';
import { notFound, errorHandler } from './middleware/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export const app = express();
app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: false,
    crossOriginResourcePolicy: false,
  })
);

const corsOrigin = env.CORS_ORIGIN === '*'
  ? true
  : env.CORS_ORIGIN.split(',').map((v) => v.trim());

app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-API-Key', 'Idempotency-Key', 'Authorization'],
  })
);
app.use(express.json({ limit: '32kb' }));
app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/health' } }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false }));

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'accessibility-onboarding-api' }));

// OpenAPI spec & interactive /docs page (Swagger UI via CDN + built-in fallback explorer)
app.get('/openapi.yaml', (_req, res) => {
  res.type('text/yaml').sendFile(path.join(rootDir, 'openapi.yaml'));
});

app.get('/docs', (_req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Digital Bridge API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
    .nav { padding: 0.75rem 1.5rem; background: #002b56; color: #fff; display: flex; justify-content: space-between; align-items: center; }
    .nav a { color: #fde047; font-weight: 600; }
  </style>
</head>
<body>
  <div class="nav">
    <strong>Digital Bridge Accessible Onboarding API (v1)</strong>
    <a href="/">← Back to Demo</a>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    if (window.SwaggerUIBundle) {
      window.SwaggerUIBundle({ url: '/openapi.yaml', dom_id: '#swagger-ui' });
    } else {
      document.getElementById('swagger-ui').innerHTML =
        '<p style="padding:1.5rem">Swagger UI CDN offline. Download the spec at <a href="/openapi.yaml">/openapi.yaml</a>.</p>';
    }
  </script>
</body>
</html>`);
});

// Serve the Web Component module, demo pages, and Savanna integration proof
app.use('/module', express.static(path.join(rootDir, 'module')));
app.use('/demo', express.static(path.join(rootDir, 'demo')));
app.use('/savanna', express.static(path.join(rootDir, 'savanna')));
app.get('/', (_req, res) => {
  res.sendFile(path.join(rootDir, 'demo', 'blank.html'));
});

app.use('/api/v1/companies', companiesRouter);
app.use('/api/v1/learners', learnersRouter);
app.use('/api/v1/webhooks', webhooksRouter);
app.use('/api/v1/host', hostAuthRouter);
app.use(notFound);
app.use(errorHandler);
