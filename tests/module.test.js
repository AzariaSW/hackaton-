import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { convertSpokenDigits, isValidEthiopianPhone, normalizeEthiopianPhone } from '../module/src/utils/phone.js';
import { StepEngine } from '../module/src/utils/stepper.js';
import { registrationFlow, signinFlow } from '../module/src/flows/index.js';
import { en } from '../module/src/locales/en.js';
import { am } from '../module/src/locales/am.js';

describe('Ethiopian phone validation, spoken digits, and normalization (FR-LNG-05)', () => {
  it('accepts 09..., 07..., and +251... formats and normalizes to +251', () => {
    assert.strictEqual(isValidEthiopianPhone('0912345678'), true);
    assert.strictEqual(isValidEthiopianPhone('0712345678'), true);
    assert.strictEqual(isValidEthiopianPhone('+251912345678'), true);
    assert.strictEqual(isValidEthiopianPhone('0912 34-5678'), true);

    assert.strictEqual(normalizeEthiopianPhone('0912345678'), '+251912345678');
    assert.strictEqual(normalizeEthiopianPhone('0712345678'), '+251712345678');
    assert.strictEqual(normalizeEthiopianPhone('+251912345678'), '+251912345678');
  });

  it('converts spoken English and Amharic digit words into phone numbers', () => {
    assert.strictEqual(convertSpokenDigits('zero nine one two three four five six seven eight'), '0912345678');
    assert.strictEqual(convertSpokenDigits('ዜሮ ዘጠኝ አንድ ሁለት ሶስት አራት አምስት ስድስት ሰባት ስምንት'), '0912345678');
    assert.strictEqual(convertSpokenDigits('Abebe Bikila'), 'Abebe Bikila');
  });

  it('rejects invalid phone numbers', () => {
    assert.strictEqual(isValidEthiopianPhone('12345'), false);
    assert.strictEqual(isValidEthiopianPhone('0812345678'), false);
    assert.strictEqual(normalizeEthiopianPhone('invalid'), null);
  });
});

describe('StepEngine navigation, validation, signin & privacy separation (FR-REG, FR-SUP-03)', () => {
  it('validates required steps and navigates forward/backward', () => {
    const engine = new StepEngine({
      questions: registrationFlow.questions,
      locale: en,
      flowKey: 'registration',
      language: 'en'
    });

    assert.strictEqual(engine.isFirst, true);
    assert.strictEqual(engine.validate().valid, false);

    engine.setAnswer('Abebe Bikila');
    assert.strictEqual(engine.validate().valid, true);
    assert.strictEqual(engine.next(), true);
    assert.strictEqual(engine.progress.current, 2);
    assert.strictEqual(engine.previous(), true);
    assert.strictEqual(engine.progress.current, 1);
  });

  it('separates support preferences from profile payload and handles partner_referral', () => {
    const engine = new StepEngine({
      questions: registrationFlow.questions,
      locale: am,
      flowKey: 'registration',
      language: 'am'
    });

    engine.setAnswer('Tigist Alemu', 'name');
    engine.setAnswer('0911223344', 'phone');
    engine.setAnswer('partner_referral', 'identity');
    engine.setAnswer(['captions', 'interpreter_am'], 'support');

    const { doneDetail, supportDetail } = engine.buildSubmissionPayloads('sub-12345678');

    assert.strictEqual(doneDetail.profile.name, 'Tigist Alemu');
    assert.strictEqual(doneDetail.profile.phone, '+251911223344');
    assert.strictEqual(doneDetail.profile.idRoute, 'partner_referral');
    assert.strictEqual(doneDetail.profile.support, undefined);
    assert.strictEqual(doneDetail.consent.accepted, true);
    assert.ok(doneDetail.consent.recordedAt);
    assert.ok(doneDetail.referralCode?.startsWith('DB-REF-'));

    assert.deepStrictEqual(supportDetail.support, ['captions', 'interpreter_am']);
    assert.strictEqual(supportDetail.preferNotToSay, false);
  });

  it('builds normalized signin payloads and requires referralCode when referral_code method selected', () => {
    const engine = new StepEngine({
      questions: signinFlow.questions,
      locale: en,
      flowKey: 'signin',
      language: 'en'
    });

    engine.setAnswer('referral_code', 'method');
    engine.setAnswer('0911223344', 'phone');
    engine.currentIndex = 2;
    assert.strictEqual(engine.validate().valid, false);

    engine.setAnswer('DB-REF-1234ABCD', 'referralCode');
    assert.strictEqual(engine.validate().valid, true);

    const { isSignin, signinDetail } = engine.buildSubmissionPayloads('sub-999');
    assert.strictEqual(isSignin, true);
    assert.strictEqual(signinDetail.phone, '+251911223344');
    assert.strictEqual(signinDetail.referralCode, 'DB-REF-1234ABCD');
  });
});

describe('Locale completeness (FR-LNG-01)', () => {
  it('has identical key paths in English and Amharic locales', () => {
    function collectKeys(obj, prefix = '') {
      let keys = [];
      for (const [k, v] of Object.entries(obj)) {
        const pathKey = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          keys = keys.concat(collectKeys(v, pathKey));
        } else {
          keys.push(pathKey);
        }
      }
      return keys.sort();
    }

    assert.deepStrictEqual(collectKeys(am), collectKeys(en));
  });
});

describe('Bundled classic-script module output', () => {
  it('generates a self-contained IIFE under 500 KB with no top-level ES import/export', () => {
    const bundlePath = path.resolve('module/db-signup.js');
    const code = fs.readFileSync(bundlePath, 'utf8');
    assert.ok(code.length < 500 * 1024, `Bundle exceeds 500 KB (${code.length} bytes)`);
    assert.match(code, /customElements\.define\('db-signup'/);
    assert.doesNotMatch(code, /^\s*(import|export)\s+/m);
  });
});

