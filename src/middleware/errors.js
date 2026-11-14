export function notFound(_req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
}
export function errorHandler(err, req, res, _next) {
  req.log?.error({ err }, 'Request failed');
  if (err?.name === 'ZodError') return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid request data', details: err.issues } });
  if (err?.code === '23505') return res.status(409).json({ error: { code: 'ALREADY_EXISTS', message: 'A record with this value already exists' } });
  const status = Number.isInteger(err.status) ? err.status : 500;
  res.status(status).json({ error: { code: err.code || 'INTERNAL_ERROR', message: status >= 500 ? 'An unexpected error occurred' : err.message } });
}
