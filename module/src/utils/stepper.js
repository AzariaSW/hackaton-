import { isValidEthiopianPhone, normalizeEthiopianPhone } from './phone.js';

export class StepEngine {
  constructor({ questions = [], locale = {}, flowKey = 'registration', language = 'en' } = {}) {
    this.questions = questions;
    this.locale = locale;
    this.flowKey = flowKey;
    this.language = language;
    this.currentIndex = 0;
    this.answers = {};
    this.voiceNotes = [];
  }

  get currentStep() {
    return this.questions[this.currentIndex];
  }

  get isFirst() {
    return this.currentIndex === 0;
  }

  get isLast() {
    return this.currentIndex === this.questions.length - 1;
  }

  get progress() {
    return {
      current: this.currentIndex + 1,
      total: this.questions.length
    };
  }

  setAnswer(value, key = this.currentStep?.key) {
    if (!key) return;
    this.answers[key] = {
      value,
      timestamp: new Date().toISOString()
    };
  }

  getAnswer(key) {
    return this.answers[key]?.value;
  }

  addVoiceNote(fieldKey, metadata) {
    this.voiceNotes = this.voiceNotes.filter((n) => n.fieldKey !== fieldKey);
    const { previewUrl: _preview, ...serializable } = metadata || {};
    this.voiceNotes.push({ fieldKey, ...serializable });
  }

  next() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return true;
    }
    return false;
  }

  validate(step = this.currentStep) {
    if (!step) return { valid: true };
    const answer = this.getAnswer(step.key);
    const messages = this.locale?.validation || {
      required: 'This field is required.',
      invalidPhone: 'Please enter a valid Ethiopian phone number.'
    };

    const isEmpty =
      answer === undefined ||
      answer === null ||
      (typeof answer === 'string' && answer.trim() === '') ||
      (Array.isArray(answer) && answer.length === 0);

    const isRequired =
      step.required ||
      (this.flowKey === 'signin' && step.key === 'referralCode' && this.getAnswer('method') === 'referral_code');

    if (isRequired && isEmpty) {
      return { valid: false, error: messages.required };
    }

    if (!isEmpty && step.validation === 'ethiopian-phone') {
      if (!isValidEthiopianPhone(answer)) {
        return { valid: false, error: messages.invalidPhone };
      }
    }

    return { valid: true };
  }

  /**
   * Builds privacy-separated submission payloads per SRS FR-SUP-03 & Track 1 data contract.
   * Support choices are NEVER placed inside profile/done payload.
   */
  buildSubmissionPayloads(submissionId, { consentAccepted = true } = {}) {
    if (this.flowKey === 'signin') {
      const phoneRaw = this.getAnswer('phone');
      const phone = normalizeEthiopianPhone(phoneRaw) || phoneRaw || '';
      const method = this.getAnswer('method') || 'phone';
      const referralCode = (this.getAnswer('referralCode') || '').trim() || null;
      return {
        isSignin: true,
        signinDetail: {
          submissionId,
          method,
          phone,
          referralCode,
          language: this.language,
          requestedAt: new Date().toISOString()
        },
        doneDetail: null,
        supportDetail: { support: [], preferNotToSay: false }
      };
    }

    const profile = { language: this.language };
    let supportChoices = [];
    let preferNotToSay = false;

    for (const q of this.questions) {
      const raw = this.getAnswer(q.key);
      if (q.sensitive || q.key === 'support') {
        const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
        if (list.includes('prefer_not_to_say')) {
          preferNotToSay = true;
          supportChoices = [];
        } else {
          supportChoices = list;
        }
        continue;
      }

      if (raw === undefined || raw === null || (typeof raw === 'string' && raw.trim() === '')) {
        continue;
      }

      if (q.key === 'identity') {
        profile.idRoute = raw;
      } else if (q.key === 'phone') {
        profile.phone = normalizeEthiopianPhone(raw) || raw;
      } else {
        profile[q.key] = typeof raw === 'string' ? raw.trim() : raw;
      }
    }

    const completedAt = new Date().toISOString();
    const referralCode =
      profile.idRoute === 'partner_referral'
        ? `DB-REF-${submissionId.slice(0, 8).toUpperCase()}`
        : null;

    return {
      isSignin: false,
      doneDetail: {
        submissionId,
        flow: this.flowKey,
        profile,
        referralCode,
        voiceNotes: this.voiceNotes,
        consent: {
          accepted: Boolean(consentAccepted),
          recordedAt: completedAt
        },
        completedAt
      },
      supportDetail: {
        support: supportChoices,
        preferNotToSay
      }
    };
  }
}
