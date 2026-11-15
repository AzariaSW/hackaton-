import { after, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app.js';

describe('refugee FIN text comparison endpoint', () => {
  let server;

  after(() => {
    server?.close();
  });

  it('compares normalized FIN values without claiming document authenticity', async () => {
    server = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    const baseUrl = `http://127.0.0.1:${server.address().port}`;

    const matching = await fetch(`${baseUrl}/api/v1/learners/refugee-id/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentFin: 'ab-12 34', fin: 'AB1234' }),
    });
    assert.equal(matching.status, 200);
    assert.deepEqual(await matching.json(), {
      status: 'text_match',
      textMatch: true,
      authenticityVerified: false,
    });

    const mismatch = await fetch(`${baseUrl}/api/v1/learners/refugee-id/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentFin: 'AB1234', fin: 'AB1235' }),
    });
    assert.deepEqual(await mismatch.json(), {
      status: 'mismatch',
      textMatch: false,
      authenticityVerified: false,
    });

    const manual = await fetch(`${baseUrl}/api/v1/learners/refugee-id/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fin: 'AB1234' }),
    });
    assert.deepEqual(await manual.json(), {
      status: 'manual_entry',
      textMatch: null,
      authenticityVerified: false,
    });

    const emptyNormalized = await fetch(`${baseUrl}/api/v1/learners/refugee-id/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentFin: '---', fin: '...' }),
    });
    assert.deepEqual(await emptyNormalized.json(), {
      status: 'mismatch',
      textMatch: false,
      authenticityVerified: false,
    });

    const frontend = await fetch(`${baseUrl}/`);
    assert.equal(frontend.status, 200);
    assert.match(await frontend.text(), /id="root"/);
  });
});
