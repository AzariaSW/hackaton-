import { flows } from './flows/index.js';
import { StorageManager } from './utils/storage.js';
import { VoiceManager } from './utils/voice.js';
import { StepEngine } from './utils/stepper.js';
import { convertSpokenDigits } from './utils/phone.js';

function createSubmissionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `sub_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export class DbSignupComponent {
  constructor(hostElement) {
    this.host = hostElement;
    this.shadow = hostElement.shadowRoot || hostElement.attachShadow({ mode: 'open' });
    this.storage = new StorageManager();
    this.voice = new VoiceManager();
    this.locale = {};
    this.lang = 'en';
    this.mode = 'registration';
    this.api = null;
    this.theme = 'default';
    this.audioBase = null;
    this.lowLiteracy = false;
    this.bigTextContrast = false;
    this.noSoundVisual = false;
    this.engine = null;
    this.isRecording = false;
    this.isListeningStt = false;
    this.activeSubmissionId = createSubmissionId();
    this.initialized = false;
    this._onlineHandler = () => this.handleConnectivityChange();
  }

  async mount() {
    const rawLang = (this.host.getAttribute('lang') || 'en').trim().toLowerCase();
    this.lang = /^[a-z]{2,3}(-[a-z]{2,4})?$/.test(rawLang) ? rawLang : 'en';
    this.mode = this.host.getAttribute('mode') || 'registration';
    this.api = this.host.getAttribute('api') || null;
    this.theme = this.host.getAttribute('theme') || 'default';
    this.audioBase = this.host.getAttribute('audio-base') || null;

    await this.loadLocale(this.lang);
    await this.storage.init();
    this.voice.audioBase = this.audioBase ? this.audioBase.replace(/\/+$/, '') : null;
    await this.voice.init();
    this.voice.locale = this.lang;

    const savedPrefs = this.storage.loadUiPrefs();
    if (savedPrefs) {
      this.lowLiteracy = Boolean(savedPrefs.lowLiteracy);
      this.bigTextContrast = Boolean(savedPrefs.bigTextContrast);
      this.noSoundVisual = Boolean(savedPrefs.noSoundVisual);
      this.voice.enabled = !this.noSoundVisual;
      if (savedPrefs.voiceRate) {
        this.voice.setRate(savedPrefs.voiceRate);
      }
    }

    const flow = flows[this.mode] || flows.registration;
    this.engine = new StepEngine({
      questions: flow.questions,
      locale: this.locale,
      flowKey: flow.key,
      language: this.lang
    });

    const savedDraft = await this.storage.load(flow.key);
    let restored = false;
    if (savedDraft && savedDraft.answers) {
      this.engine.answers = savedDraft.answers;
      const idx = Number(savedDraft.currentStep) || 0;
      this.engine.currentIndex = Math.max(0, Math.min(idx, flow.questions.length - 1));
      restored = Object.keys(savedDraft.answers).length > 0;
    }

    this.renderShell();
    if (restored) {
      this.showNotice(this.locale.storage.restored);
    }
    this.renderStep({ moveFocus: false, speakStep: false });
    this.handleConnectivityChange();

    if (!this.initialized && typeof window !== 'undefined') {
      window.addEventListener('online', this._onlineHandler);
      window.addEventListener('offline', this._onlineHandler);
      this.initialized = true;
    }
  }

  destroy() {
    this.voice.stop();
    this.voice.stopListening();
    if (this.isRecording) {
      this.voice.stopVoiceNote();
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this._onlineHandler);
      window.removeEventListener('offline', this._onlineHandler);
    }
  }

  async onAttributeChange(name, oldValue, newValue) {
    if (oldValue === newValue || !this.initialized) return;
    if (name === 'lang' || name === 'mode' || name === 'api' || name === 'theme' || name === 'audio-base') {
      this.voice.stop();
      await this.mount();
    }
  }

  async loadLocale(lang) {
    const safeLang = /^[a-z]{2,3}(-[a-z]{2,4})?$/.test(lang) ? lang.toLowerCase() : 'en';
    const shortLang = safeLang.split('-')[0];

    for (const candidate of [safeLang, shortLang]) {
      if (typeof fetch === 'function') {
        try {
          const base = this.host.getAttribute('locales-base') || '/module/src/locales';
          const res = await fetch(`${base.replace(/\/+$/, '')}/${candidate}.json`);
          if (res.ok) {
            this.locale = await res.json();
            return;
          }
        } catch {
          // Try module import next
        }
      }
      try {
        const mod = await import(/* @vite-ignore */ `./locales/${candidate}.js`);
        this.locale = mod.default || mod[candidate];
        if (this.locale) return;
      } catch {
        // Continue fallback chain
      }
    }

    const mod = await import('./locales/en.js');
    this.locale = mod.default || mod.en;
  }

  renderShell() {
    const dir = this.locale.meta?.dir || (this.lang.startsWith('ar') ? 'rtl' : 'ltr');
    const isAm = this.lang.startsWith('am');

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--bs-body-font-family, 'Noto Sans Ethiopic', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
          color: var(--bs-body-color, #1a1a1a);
          line-height: ${isAm ? '1.7' : '1.5'};
          max-width: 42rem;
          margin: 0 auto;
        }

        *, *::before, *::after {
          box-sizing: border-box;
        }

        .card {
          background: #ffffff;
          border: 1px solid #d0d7de;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
        }

        .card.assist-big-contrast {
          border: 3px solid #000000;
          font-size: 1.18rem;
          color: #000000;
        }

        .card.assist-big-contrast .question-title {
          font-size: 1.65rem;
          color: #000000;
        }

        .card.assist-big-contrast .question-description,
        .card.assist-big-contrast .choice-desc,
        .card.assist-big-contrast .progress {
          color: #111827;
        }

        .card.assist-big-contrast input[type="text"],
        .card.assist-big-contrast input[type="tel"],
        .card.assist-big-contrast .choice-label-row {
          border-color: #000000;
          border-width: 2.5px;
        }

        @media (max-width: 30rem) {
          .card {
            padding: 1rem;
          }
        }

        .assist-bar {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          padding: 0.75rem;
          margin-bottom: 0.9rem;
        }

        .assist-bar-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }

        .assist-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .toolbar-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          align-items: center;
        }

        .speed-select {
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 600;
          min-height: 2.75rem;
          padding: 0.35rem 0.6rem;
          border-radius: 0.5rem;
          border: 2px solid #6b7280;
          background: #ffffff;
          color: #111827;
        }

        .progress {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 0.75rem;
        }

        .banner {
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.9375rem;
          border-inline-start: 4px solid #0f766e;
          background: #f0fdfa;
          color: #134e4a;
        }

        .banner-offline {
          border-inline-start-color: #b45309;
          background: #fffbeb;
          color: #78350f;
        }

        .question-title {
          font-size: 1.375rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: #111827;
          line-height: ${isAm ? '1.7' : '1.35'};
        }

        .question-title:focus {
          outline: 3px solid #f5a300;
          outline-offset: 4px;
          border-radius: 0.25rem;
        }

        .question-description {
          font-size: 1rem;
          color: #4b5563;
          margin: 0 0 1rem 0;
        }

        .word-highlight {
          background: #fde047;
          color: #111827;
          border-radius: 0.2rem;
          padding: 0 0.15rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        label.field-label {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        input[type="text"],
        input[type="tel"],
        input[type="email"] {
          width: 100%;
          min-height: 2.75rem;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          font-family: inherit;
          color: #111827;
          background: #ffffff;
          border: 2px solid #6b7280;
          border-radius: 0.5rem;
        }

        input.error {
          border-color: #b00020;
        }

        fieldset {
          border: 0;
          padding: 0;
          margin: 0;
        }

        legend.sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
        }

        .choices {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .choice-label-row {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          min-height: 2.75rem;
          border: 2px solid #6b7280;
          border-radius: 0.5rem;
          cursor: pointer;
          background: #ffffff;
        }

        .choice-label-row:hover {
          border-color: var(--bs-primary, #0052a3);
          background: #f0f7ff;
        }

        .choice-label-row.selected {
          border-color: var(--bs-primary, #0052a3);
          background: #e6f0ff;
        }

        .choice-input {
          width: 1.375rem;
          height: 1.375rem;
          min-width: 1.375rem;
          margin-top: 0.15rem;
          accent-color: var(--bs-primary, #0052a3);
          cursor: pointer;
        }

        .choice-icon {
          font-size: 1.35rem;
          line-height: 1;
          margin-inline-end: 0.25rem;
        }

        .choice-text {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .choice-title {
          font-weight: 600;
          font-size: 1rem;
          color: #111827;
        }

        .choice-desc {
          font-size: 0.9375rem;
          color: #4b5563;
        }

        .voice-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .error-message {
          color: #b00020;
          font-size: 0.9375rem;
          font-weight: 600;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .status-note {
          font-size: 0.9375rem;
          color: #1e3a8a;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          margin-top: 0.5rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .recording-bar {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #991b1b;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
          padding: 0.65rem 0.85rem;
          margin-top: 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        button {
          font-family: inherit;
          font-size: 1rem;
          font-weight: 600;
          min-height: 2.75rem;
          min-width: 2.75rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: 2px solid transparent;
          cursor: pointer;
        }

        button:focus-visible,
        select:focus-visible,
        input:focus-visible,
        [tabindex]:focus-visible {
          outline: 3px solid #f5a300;
          outline-offset: 2px;
        }

        .btn-primary {
          background: var(--bs-primary, #0052a3);
          color: #ffffff;
          flex: 1 1 10rem;
        }

        .btn-primary:hover {
          filter: brightness(0.92);
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #111827;
          border-color: #4b5563;
        }

        .consent-row {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          padding: 0.85rem 1rem;
          min-height: 2.75rem;
          border: 2px solid #6b7280;
          border-radius: 0.5rem;
          background: #f8fafc;
          margin-top: 1rem;
          cursor: pointer;
        }

        .consent-row input {
          width: 1.35rem;
          height: 1.35rem;
          min-width: 1.35rem;
          margin-top: 0.1rem;
          accent-color: var(--bs-primary, #0052a3);
        }

        .btn-outline {
          background: #ffffff;
          color: #111827;
          border-color: #6b7280;
          font-size: 0.9rem;
        }

        .btn-outline[aria-pressed="true"] {
          background: #e6f0ff;
          border-color: var(--bs-primary, #0052a3);
          color: #003366;
        }

        .btn-danger {
          background: #b00020;
          color: #ffffff;
        }

        .referral-box {
          background: #f0fdf4;
          border: 2px solid #15803d;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
        }

        .referral-code {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #14532d;
          margin-top: 0.5rem;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
            animation: none !important;
          }
        }
      </style>

      <div id="card-root" class="card" dir="${dir}" lang="${this.lang}">
        <section class="assist-bar" aria-label="${this.locale.component.assistBarTitle}">
          <p class="assist-bar-title">${this.locale.component.assistBarTitle}</p>
          <div class="assist-chips">
            <button type="button" id="preset-read" class="btn-outline" aria-pressed="true"></button>
            <button type="button" id="preset-big" class="btn-outline" aria-pressed="false"></button>
            <button type="button" id="preset-simple" class="btn-outline" aria-pressed="false"></button>
            <button type="button" id="preset-nosound" class="btn-outline" aria-pressed="false"></button>
          </div>
        </section>

        <div class="toolbar">
          <div class="toolbar-group">
            <button type="button" id="btn-listen" class="btn-outline"></button>
            <button type="button" id="btn-voice-toggle" class="btn-outline" aria-pressed="true"></button>
            <label for="voice-speed" class="sr-only">${this.locale.component.speedLabel}</label>
            <select id="voice-speed" class="speed-select" aria-label="${this.locale.component.speedLabel}">
              <option value="0.8">${this.locale.component.speedSlow} (0.8x)</option>
              <option value="0.95" selected>${this.locale.component.speedNormal} (1.0x)</option>
              <option value="1.2">${this.locale.component.speedFast} (1.2x)</option>
            </select>
          </div>
          <div class="toolbar-group">
            <button type="button" id="btn-clear-draft" class="btn-outline"></button>
          </div>
        </div>

        <div id="offline-banner" class="banner banner-offline" style="display: none;" role="status"></div>
        <div id="notice-banner" class="banner" style="display: none;" role="status"></div>

        <form id="step-form" lang="${this.lang}" novalidate>
          <div class="progress" id="progress"></div>
          <div id="question-container"></div>
          <div class="button-group" id="button-group"></div>
        </form>
      </div>

      <div id="live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>
    `;

    this.updateToolbarLabels();
    this.bindToolbarEvents();
  }

  toggleSupportOption(value, enabled) {
    const stepHasSupport = this.engine.questions.some((q) => q.key === 'support');
    if (!stepHasSupport) return;
    const current = Array.isArray(this.engine.getAnswer('support'))
      ? [...this.engine.getAnswer('support')].filter((v) => v !== 'prefer_not_to_say')
      : [];
    const next = enabled
      ? [...new Set([...current, value])]
      : current.filter((v) => v !== value);
    this.engine.setAnswer(next, 'support');
    this.saveDraft();
  }

  updateToolbarLabels() {
    const t = this.locale.component;
    const cardRoot = this.shadow.getElementById('card-root');
    if (cardRoot) {
      cardRoot.classList.toggle('assist-big-contrast', this.bigTextContrast);
    }

    const listenBtn = this.shadow.getElementById('btn-listen');
    const voiceToggleBtn = this.shadow.getElementById('btn-voice-toggle');
    const clearBtn = this.shadow.getElementById('btn-clear-draft');
    const presetRead = this.shadow.getElementById('preset-read');
    const presetBig = this.shadow.getElementById('preset-big');
    const presetSimple = this.shadow.getElementById('preset-simple');
    const presetNoSound = this.shadow.getElementById('preset-nosound');

    const speedSelect = this.shadow.getElementById('voice-speed');
    if (speedSelect) {
      speedSelect.value = String(this.voice.rate);
    }

    if (listenBtn) listenBtn.textContent = `🔊 ${this.voice.isSpeaking ? t.stop : t.listen}`;
    if (voiceToggleBtn) {
      voiceToggleBtn.textContent = this.voice.enabled ? t.voiceToggleOn : t.voiceToggleOff;
      voiceToggleBtn.setAttribute('aria-pressed', String(this.voice.enabled));
    }
    if (clearBtn) clearBtn.textContent = t.clearDraft;

    if (presetRead) {
      presetRead.textContent = `🔊 ${t.assistPresets.readToMe}`;
      presetRead.setAttribute('aria-pressed', String(this.voice.enabled && !this.noSoundVisual));
    }
    if (presetBig) {
      presetBig.textContent = `🔎 ${t.assistPresets.bigTextContrast}`;
      presetBig.setAttribute('aria-pressed', String(this.bigTextContrast));
    }
    if (presetSimple) {
      presetSimple.textContent = `✨ ${t.assistPresets.simpleWords}`;
      presetSimple.setAttribute('aria-pressed', String(this.lowLiteracy));
    }
    if (presetNoSound) {
      presetNoSound.textContent = `💬 ${t.assistPresets.noSoundVisual}`;
      presetNoSound.setAttribute('aria-pressed', String(this.noSoundVisual));
    }
  }

  persistUiPrefs() {
    this.storage.saveUiPrefs({
      lowLiteracy: this.lowLiteracy,
      bigTextContrast: this.bigTextContrast,
      noSoundVisual: this.noSoundVisual,
      voiceRate: this.voice.rate
    });
  }

  bindToolbarEvents() {
    this.shadow.getElementById('preset-read')?.addEventListener('click', () => {
      this.noSoundVisual = false;
      this.voice.enabled = true;
      this.toggleSupportOption('screen_reader', true);
      this.persistUiPrefs();
      this.updateToolbarLabels();
      this.speakCurrentQuestion();
    });

    this.shadow.getElementById('preset-big')?.addEventListener('click', () => {
      this.bigTextContrast = !this.bigTextContrast;
      this.toggleSupportOption('large_text', this.bigTextContrast);
      this.persistUiPrefs();
      this.updateToolbarLabels();
      if (this.engine.currentStep?.key === 'support') {
        this.renderStep({ moveFocus: false, speakStep: false });
      }
    });

    this.shadow.getElementById('preset-simple')?.addEventListener('click', () => {
      this.lowLiteracy = !this.lowLiteracy;
      this.persistUiPrefs();
      this.updateToolbarLabels();
      this.renderStep({ moveFocus: false, speakStep: false });
    });

    this.shadow.getElementById('preset-nosound')?.addEventListener('click', () => {
      this.noSoundVisual = !this.noSoundVisual;
      if (this.noSoundVisual) {
        this.voice.enabled = false;
        this.voice.stop();
        this.clearWordHighlight();
        this.toggleSupportOption('captions', true);
        this.toggleSupportOption('sign_language', true);
      } else {
        this.voice.enabled = true;
      }
      this.persistUiPrefs();
      this.updateToolbarLabels();
      if (this.engine.currentStep?.key === 'support') {
        this.renderStep({ moveFocus: false, speakStep: false });
      }
    });

    this.shadow.getElementById('btn-listen')?.addEventListener('click', () => {
      if (this.voice.isSpeaking) {
        this.voice.stop();
        this.clearWordHighlight();
        this.updateToolbarLabels();
      } else {
        this.speakCurrentQuestion();
      }
    });

    this.shadow.getElementById('btn-voice-toggle')?.addEventListener('click', () => {
      this.voice.toggle();
      this.noSoundVisual = !this.voice.enabled;
      this.persistUiPrefs();
      this.clearWordHighlight();
      this.updateToolbarLabels();
      this.announce(this.voice.enabled ? this.locale.component.voiceToggleOn : this.locale.component.voiceToggleOff);
    });

    this.shadow.getElementById('voice-speed')?.addEventListener('change', (e) => {
      this.voice.setRate(e.target.value);
      this.persistUiPrefs();
      if (this.voice.isSpeaking) {
        this.speakCurrentQuestion();
      }
    });

    this.shadow.getElementById('btn-clear-draft')?.addEventListener('click', async () => {
      this.voice.stop();
      await this.storage.clear(this.engine.flowKey);
      this.engine.answers = {};
      this.engine.voiceNotes = [];
      this.engine.currentIndex = 0;
      this.activeSubmissionId = createSubmissionId();
      this.renderStep({ moveFocus: true, speakStep: this.voice.enabled });
    });

    this.shadow.getElementById('step-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleContinue();
    });
  }

  getStepCopy(step) {
    const flowTexts = this.locale.flows?.[this.engine.flowKey]?.[step.key] || {};
    const label = this.lowLiteracy && flowTexts.simpleLabel ? flowTexts.simpleLabel : (flowTexts.label || step.key);
    const description = this.lowLiteracy && flowTexts.simpleDescription
      ? flowTexts.simpleDescription
      : (flowTexts.description || '');
    const placeholder = flowTexts.placeholder || '';
    const voiceText = flowTexts.voiceText || label;
    return { label, description, placeholder, voiceText, optionsMap: flowTexts.options || {} };
  }

  renderStep({ moveFocus = true, speakStep = true } = {}) {
    const step = this.engine.currentStep;
    const progress = this.engine.progress;
    const copy = this.getStepCopy(step);

    const progressEl = this.shadow.getElementById('progress');
    const questionContainer = this.shadow.getElementById('question-container');
    const buttonGroup = this.shadow.getElementById('button-group');

    const progressText = this.locale.progress.question
      .replace('{current}', progress.current)
      .replace('{total}', progress.total);
    progressEl.textContent = progressText;

    questionContainer.innerHTML = '';
    buttonGroup.innerHTML = '';

    const heading = document.createElement('h2');
    heading.className = 'question-title';
    heading.id = 'question-title';
    heading.setAttribute('tabindex', '-1');
    this.renderHighlightableText(heading, copy.label);
    questionContainer.appendChild(heading);

    if (copy.description) {
      const desc = document.createElement('p');
      desc.className = 'question-description';
      desc.id = `desc-${step.key}`;
      desc.textContent = copy.description;
      questionContainer.appendChild(desc);
    }

    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';

    const errorDiv = document.createElement('p');
    errorDiv.id = `error-${step.key}`;
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.style.display = 'none';

    if (step.type === 'choice' || step.type === 'checkbox') {
      const fieldset = document.createElement('fieldset');
      const describedBy = [copy.description ? `desc-${step.key}` : '', errorDiv.id].filter(Boolean).join(' ');
      if (describedBy) fieldset.setAttribute('aria-describedby', describedBy);
      const legend = document.createElement('legend');
      legend.className = 'sr-only';
      legend.textContent = copy.label;
      fieldset.appendChild(legend);

      const choicesDiv = document.createElement('div');
      choicesDiv.className = 'choices';
      const inputType = step.type === 'checkbox' ? 'checkbox' : 'radio';
      const saved = this.engine.getAnswer(step.key);
      const selectedSet = new Set(Array.isArray(saved) ? saved : saved ? [saved] : []);

      step.options.forEach((option, idx) => {
        const optCopy = copy.optionsMap[option.value] || {};
        const optLabel = this.lowLiteracy && optCopy.simpleLabel ? optCopy.simpleLabel : (optCopy.label || option.value);
        const optDesc = optCopy.description || '';

        const rowLabel = document.createElement('label');
        rowLabel.className = 'choice-label-row';
        const inputId = `field-${step.key}-${idx}`;
        rowLabel.htmlFor = inputId;

        const input = document.createElement('input');
        input.type = inputType;
        input.id = inputId;
        input.name = step.key;
        input.value = option.value;
        input.className = 'choice-input';
        input.checked = selectedSet.has(option.value);
        if (input.checked) rowLabel.classList.add('selected');

        input.addEventListener('change', () => {
          if (inputType === 'radio') {
            this.engine.setAnswer(option.value);
            choicesDiv.querySelectorAll('.choice-label-row').forEach((r) => r.classList.remove('selected'));
            rowLabel.classList.add('selected');
          } else {
            const currentArr = Array.isArray(this.engine.getAnswer(step.key))
              ? [...this.engine.getAnswer(step.key)]
              : [];
            let nextArr;
            if (input.checked) {
              if (step.exclusiveOption && option.value === step.exclusiveOption) {
                nextArr = [option.value];
              } else {
                nextArr = currentArr.filter((v) => v !== step.exclusiveOption);
                if (!nextArr.includes(option.value)) nextArr.push(option.value);
              }
            } else {
              nextArr = currentArr.filter((v) => v !== option.value);
            }
            this.engine.setAnswer(nextArr);
            choicesDiv.querySelectorAll('input').forEach((el) => {
              el.checked = nextArr.includes(el.value);
              el.closest('.choice-label-row')?.classList.toggle('selected', el.checked);
            });
          }
          this.saveDraft();
        });

        rowLabel.appendChild(input);

        if (this.lowLiteracy && option.icon) {
          const iconSpan = document.createElement('span');
          iconSpan.className = 'choice-icon';
          iconSpan.setAttribute('aria-hidden', 'true');
          iconSpan.textContent = option.icon;
          rowLabel.appendChild(iconSpan);
        }

        const textWrap = document.createElement('span');
        textWrap.className = 'choice-text';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'choice-title';
        titleSpan.textContent = optLabel;
        textWrap.appendChild(titleSpan);

        if (optDesc) {
          const descSpan = document.createElement('span');
          descSpan.className = 'choice-desc';
          descSpan.textContent = optDesc;
          textWrap.appendChild(descSpan);
        }

        rowLabel.appendChild(textWrap);
        choicesDiv.appendChild(rowLabel);
      });

      fieldset.appendChild(choicesDiv);
      formGroup.appendChild(fieldset);
    } else {
      const label = document.createElement('label');
      label.className = 'field-label';
      label.htmlFor = `field-${step.key}`;
      label.textContent = copy.label;
      formGroup.appendChild(label);

      const input = document.createElement('input');
      input.type = step.type || 'text';
      input.id = `field-${step.key}`;
      input.name = step.key;
      if (step.autocomplete) input.autocomplete = step.autocomplete;
      input.placeholder = copy.placeholder;
      if (step.required) input.required = true;

      const describedBy = [copy.description ? `desc-${step.key}` : '', errorDiv.id].filter(Boolean).join(' ');
      if (describedBy) input.setAttribute('aria-describedby', describedBy);

      const saved = this.engine.getAnswer(step.key);
      if (saved !== undefined && saved !== null) {
        input.value = String(saved);
      }

      input.addEventListener('input', (e) => {
        input.removeAttribute('aria-invalid');
        input.classList.remove('error');
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        this.engine.setAnswer(e.target.value);
        this.saveDraft();
      });

      formGroup.appendChild(input);

      if (step.voiceInput) {
        this.renderVoiceInputControls(formGroup, step, input);
      }
    }

    formGroup.appendChild(errorDiv);

    if (this.engine.flowKey === 'registration' && this.engine.isLast) {
      const consentWrap = document.createElement('div');
      const consentErr = document.createElement('p');
      consentErr.id = 'error-consent';
      consentErr.className = 'error-message';
      consentErr.setAttribute('role', 'alert');
      consentErr.style.display = 'none';

      const consentLabel = document.createElement('label');
      consentLabel.className = 'consent-row';
      consentLabel.htmlFor = 'consent-check';

      const consentInput = document.createElement('input');
      consentInput.type = 'checkbox';
      consentInput.id = 'consent-check';
      consentInput.required = true;
      consentInput.setAttribute('aria-describedby', 'error-consent');
      consentInput.checked = Boolean(this.engine.getAnswer('_consent'));
      consentInput.addEventListener('change', () => {
        this.engine.setAnswer(consentInput.checked, '_consent');
        consentInput.removeAttribute('aria-invalid');
        consentErr.style.display = 'none';
        consentErr.textContent = '';
        this.saveDraft();
      });

      const consentText = document.createElement('span');
      consentText.textContent = this.locale.component.consentLabel;

      consentLabel.appendChild(consentInput);
      consentLabel.appendChild(consentText);
      consentWrap.appendChild(consentLabel);
      consentWrap.appendChild(consentErr);
      formGroup.appendChild(consentWrap);
    }

    questionContainer.appendChild(formGroup);

    if (!this.engine.isFirst) {
      const backBtn = document.createElement('button');
      backBtn.type = 'button';
      backBtn.className = 'btn-secondary';
      backBtn.textContent = this.locale.navigation.back;
      backBtn.addEventListener('click', () => {
        this.voice.stop();
        this.engine.previous();
        this.saveDraft();
        this.renderStep({ moveFocus: true, speakStep: this.voice.enabled });
      });
      buttonGroup.appendChild(backBtn);
    }

    const continueBtn = document.createElement('button');
    continueBtn.type = 'submit';
    continueBtn.className = 'btn-primary';
    continueBtn.textContent = this.engine.isLast
      ? this.locale.navigation.submit
      : this.locale.navigation.continue;
    buttonGroup.appendChild(continueBtn);

    this.dispatchStepEvent();
    this.announce(`${progressText}. ${copy.label}`);

    if (moveFocus) {
      setTimeout(() => heading.focus(), 30);
    }

    if (speakStep && this.voice.enabled) {
      this.speakCurrentQuestion();
    }
  }

  renderHighlightableText(containerEl, text) {
    containerEl.innerHTML = '';
    const words = String(text).split(/(\s+)/);
    let wordCounter = 0;
    for (const token of words) {
      if (/^\s+$/.test(token)) {
        containerEl.appendChild(document.createTextNode(token));
      } else if (token.length > 0) {
        const span = document.createElement('span');
        span.dataset.wordIdx = String(wordCounter);
        span.textContent = token;
        containerEl.appendChild(span);
        wordCounter += 1;
      }
    }
  }

  clearWordHighlight() {
    this.shadow.querySelectorAll('.word-highlight').forEach((el) => {
      el.classList.remove('word-highlight');
    });
  }

  speakCurrentQuestion() {
    const step = this.engine.currentStep;
    if (!step) return;
    const copy = this.getStepCopy(step);
    const titleWordsCount = copy.label.split(/\s+/).filter(Boolean).length;

    this.voice.speak(copy.voiceText, {
      clipKey: `${this.engine.flowKey}_${step.key}`,
      onWord: (idx) => {
        this.clearWordHighlight();
        const targetIdx = Math.min(idx, Math.max(0, titleWordsCount - 1));
        const span = this.shadow.querySelector(`#question-title [data-word-idx="${targetIdx}"]`);
        if (span) span.classList.add('word-highlight');
      },
      onNoNativeVoice: (lang) => {
        if (lang === 'am') {
          this.showNotice(this.locale.component.noAmharicVoiceNotice);
        }
      },
      onEnd: () => {
        this.clearWordHighlight();
        this.updateToolbarLabels();
      }
    });
    this.updateToolbarLabels();
  }

  renderVoiceInputControls(formGroup, step, input) {
    const t = this.locale.component;
    const controls = document.createElement('div');
    controls.className = 'voice-actions';

    const statusNote = document.createElement('div');
    statusNote.className = 'status-note';
    statusNote.style.display = 'none';
    statusNote.setAttribute('aria-live', 'polite');

    const statusText = document.createElement('span');
    const noteActionWrap = document.createElement('span');
    noteActionWrap.style.display = 'inline-flex';
    noteActionWrap.style.gap = '0.4rem';

    const readBackBtn = document.createElement('button');
    readBackBtn.type = 'button';
    readBackBtn.className = 'btn-outline';
    readBackBtn.textContent = `🔊 ${t.readBack}`;
    readBackBtn.style.display = 'none';
    readBackBtn.addEventListener('click', () => {
      if (input.value.trim()) {
        this.voice.speak(input.value.trim());
      }
    });

    const playNoteBtn = document.createElement('button');
    playNoteBtn.type = 'button';
    playNoteBtn.className = 'btn-outline';
    playNoteBtn.textContent = `▶ ${t.playVoiceNote}`;
    playNoteBtn.style.display = 'none';
    let currentPreviewUrl = null;
    let previewAudio = null;
    playNoteBtn.addEventListener('click', () => {
      if (!currentPreviewUrl || typeof Audio === 'undefined') return;
      if (previewAudio) {
        previewAudio.pause();
        previewAudio = null;
      }
      previewAudio = new Audio(currentPreviewUrl);
      previewAudio.play().catch(() => {});
    });

    noteActionWrap.appendChild(readBackBtn);
    noteActionWrap.appendChild(playNoteBtn);
    statusNote.appendChild(statusText);
    statusNote.appendChild(noteActionWrap);

    const speakBtn = document.createElement('button');
    speakBtn.type = 'button';
    speakBtn.className = 'btn-outline';
    speakBtn.textContent = `🎤 ${t.speakAnswer}`;
    speakBtn.addEventListener('click', async () => {
      if (!this.voice.hasSpeechRecognition()) {
        statusText.textContent = t.voiceUnavailable;
        readBackBtn.style.display = 'none';
        statusNote.style.display = 'flex';
        return;
      }

      try {
        this.voice.stop();
        this.isListeningStt = true;
        speakBtn.disabled = true;
        statusText.textContent = t.listening;
        readBackBtn.style.display = 'none';
        statusNote.style.display = 'flex';

        const sttLang = this.lang === 'am' ? 'am-ET' : 'en-US';
        const rawTranscript = await this.voice.startListening(sttLang);
        const transcript = step.type === 'tel' ? convertSpokenDigits(rawTranscript) : rawTranscript;

        input.value = transcript;
        this.engine.setAnswer(transcript);
        await this.saveDraft();
        statusText.textContent = `${t.heardPrefix} "${transcript}"`;
        playNoteBtn.style.display = 'none';
        readBackBtn.style.display = transcript ? 'inline-flex' : 'none';
        this.announce(`${t.heardPrefix} ${transcript}`);
        if (this.voice.enabled && transcript) {
          this.voice.speak(`${t.heardPrefix} ${transcript}`);
        }
      } catch {
        statusText.textContent = t.voiceUnavailable;
        readBackBtn.style.display = 'none';
        playNoteBtn.style.display = 'none';
        statusNote.style.display = 'flex';
      } finally {
        this.isListeningStt = false;
        speakBtn.disabled = false;
      }
    });
    controls.appendChild(speakBtn);

    if (this.voice.hasVoiceNoteSupport()) {
      const recordBtn = document.createElement('button');
      recordBtn.type = 'button';
      recordBtn.className = 'btn-outline';
      recordBtn.textContent = `🎙️ ${t.recordVoiceNote}`;

      const recBar = document.createElement('div');
      recBar.className = 'recording-bar';
      recBar.style.display = 'none';
      recBar.setAttribute('role', 'status');

      const recText = document.createElement('span');
      recText.textContent = t.recordingActive;
      const stopRecBtn = document.createElement('button');
      stopRecBtn.type = 'button';
      stopRecBtn.className = 'btn-danger';
      stopRecBtn.textContent = t.stopRecording;

      stopRecBtn.addEventListener('click', () => {
        this.voice.stopVoiceNote();
      });

      recBar.appendChild(recText);
      recBar.appendChild(stopRecBtn);

      recordBtn.addEventListener('click', async () => {
        if (this.isRecording) {
          this.voice.stopVoiceNote();
          return;
        }
        try {
          this.voice.stop();
          this.isRecording = true;
          recordBtn.disabled = true;
          recBar.style.display = 'flex';
          const meta = await this.voice.startVoiceNote();
          this.engine.addVoiceNote(step.key, meta);
          currentPreviewUrl = meta.previewUrl || null;
          statusText.textContent = `${t.voiceNoteSaved} (${Math.max(1, Math.round(meta.sizeBytes / 1024))} ${t.unitKb})`;
          readBackBtn.style.display = 'none';
          playNoteBtn.style.display = currentPreviewUrl ? 'inline-flex' : 'none';
          statusNote.style.display = 'flex';
          this.announce(t.voiceNoteSaved);
        } catch {
          statusText.textContent = t.voiceUnavailable;
          readBackBtn.style.display = 'none';
          playNoteBtn.style.display = 'none';
          statusNote.style.display = 'flex';
        } finally {
          this.isRecording = false;
          recordBtn.disabled = false;
          recBar.style.display = 'none';
        }
      });

      controls.appendChild(recordBtn);
      formGroup.appendChild(controls);
      formGroup.appendChild(recBar);
      formGroup.appendChild(statusNote);
    } else {
      formGroup.appendChild(controls);
      formGroup.appendChild(statusNote);
    }
  }

  async handleContinue() {
    const step = this.engine.currentStep;
    const validation = this.engine.validate(step);

    if (!validation.valid) {
      const errorEl = this.shadow.getElementById(`error-${step.key}`);
      if (errorEl) {
        errorEl.textContent = validation.error;
        errorEl.style.display = 'flex';
      }

      const firstInput = this.shadow.querySelector(`#field-${step.key}, input[name="${step.key}"]`);
      if (firstInput) {
        firstInput.classList.add('error');
        firstInput.setAttribute('aria-invalid', 'true');
        firstInput.focus();
      }

      this.announce(validation.error);
      if (this.voice.enabled) {
        this.voice.speak(validation.error);
      }
      return;
    }

    if (!this.engine.isLast) {
      this.voice.stop();
      this.engine.next();
      await this.saveDraft();
      this.renderStep({ moveFocus: true, speakStep: this.voice.enabled });
      return;
    }

    if (this.engine.flowKey === 'registration') {
      const consentCheck = this.shadow.getElementById('consent-check');
      const consentErr = this.shadow.getElementById('error-consent');
      if (consentCheck && !consentCheck.checked) {
        const msg = this.locale.validation.consentRequired;
        if (consentErr) {
          consentErr.textContent = msg;
          consentErr.style.display = 'flex';
        }
        consentCheck.setAttribute('aria-invalid', 'true');
        consentCheck.focus();
        this.announce(msg);
        if (this.voice.enabled) this.voice.speak(msg);
        return;
      }
    }

    await this.completeFlow();
  }

  async completeFlow() {
    this.voice.stop();
    const consentAccepted = this.engine.flowKey === 'registration'
      ? Boolean(this.shadow.getElementById('consent-check')?.checked ?? true)
      : true;
    const { isSignin, signinDetail, doneDetail, supportDetail } =
      this.engine.buildSubmissionPayloads(this.activeSubmissionId, { consentAccepted });

    if (isSignin) {
      this.host.dispatchEvent(
        new CustomEvent('db-signup:signin', {
          bubbles: true,
          composed: true,
          detail: signinDetail
        })
      );
      await this.storage.clear(this.engine.flowKey);
      this.renderSigninCompletion();
      return;
    }

    if (supportDetail.support.length > 0 || supportDetail.preferNotToSay) {
      await this.storage.saveSupportPreferences(supportDetail.support);
    }

    let queuedOffline = false;
    if (this.api && typeof navigator !== 'undefined' && navigator.onLine === false) {
      queuedOffline = true;
      await this.storage.queuePendingSubmission({
        submissionId: this.activeSubmissionId,
        api: this.api,
        doneDetail,
        supportDetail
      });
    } else if (this.api) {
      await this.relayToApi(this.api, doneDetail, supportDetail);
    }

    this.host.dispatchEvent(
      new CustomEvent('db-signup:done', {
        bubbles: true,
        composed: true,
        detail: doneDetail
      })
    );

    if (supportDetail.support.length > 0 || supportDetail.preferNotToSay) {
      this.host.dispatchEvent(
        new CustomEvent('db-signup:support', {
          bubbles: true,
          composed: true,
          detail: supportDetail
        })
      );
    }

    await this.storage.clear(this.engine.flowKey);
    this.renderCompletion(doneDetail, queuedOffline);
  }

  async relayToApi(apiBase, doneDetail, supportDetail) {
    const cleanBase = apiBase.replace(/\/+$/, '');
    const v1Base = cleanBase.endsWith('/v1')
      ? cleanBase
      : cleanBase.endsWith('/api')
        ? `${cleanBase}/v1`
        : `${cleanBase}/api/v1`;
    try {
      const res = await fetch(`${v1Base}/learners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': doneDetail.submissionId
        },
        body: JSON.stringify({
          ...doneDetail.profile,
          consent: doneDetail.consent
        })
      });

      if (res.ok && supportDetail.support.length > 0) {
        const data = await res.json();
        if (data?.id) {
          await fetch(`${v1Base}/learners/${encodeURIComponent(data.id)}/support`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ support: supportDetail.support })
          });
        }
      }
    } catch {
      await this.storage.queuePendingSubmission({
        submissionId: doneDetail.submissionId,
        api: apiBase,
        doneDetail,
        supportDetail
      });
    }
  }

  async handleConnectivityChange() {
    const offlineBanner = this.shadow.getElementById('offline-banner');
    if (!offlineBanner) return;

    const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
    if (isOffline) {
      offlineBanner.textContent = this.locale.component.offlineBanner;
      offlineBanner.style.display = 'block';
      return;
    }

    offlineBanner.style.display = 'none';

    const pending = await this.storage.getPendingSubmissions();
    if (pending.length > 0) {
      for (const item of pending) {
        try {
          await this.relayToApi(item.api, item.doneDetail, item.supportDetail);
          await this.storage.removePendingSubmission(item.submissionId);
        } catch {
          return;
        }
      }
      this.showNotice(this.locale.component.syncedSuccess);
    }
  }

  renderSigninCompletion() {
    const c = this.locale.completion;
    const questionContainer = this.shadow.getElementById('question-container');
    const buttonGroup = this.shadow.getElementById('button-group');
    const progressEl = this.shadow.getElementById('progress');

    progressEl.textContent = '';
    questionContainer.innerHTML = `
      <div class="completion">
        <h2 class="question-title" id="completion-title" tabindex="-1">${c.signinTitle}</h2>
        <p class="question-description">${c.signinMessage}</p>
      </div>
    `;
    buttonGroup.innerHTML = '';
    const restartBtn = document.createElement('button');
    restartBtn.type = 'button';
    restartBtn.className = 'btn-outline';
    restartBtn.textContent = c.restart;
    restartBtn.addEventListener('click', () => {
      this.engine.answers = {};
      this.engine.currentIndex = 0;
      this.activeSubmissionId = createSubmissionId();
      this.renderStep({ moveFocus: true, speakStep: this.voice.enabled });
    });
    buttonGroup.appendChild(restartBtn);
    this.shadow.getElementById('completion-title')?.focus();
    this.announce(c.signinTitle);
  }

  renderCompletion(doneDetail, queuedOffline) {
    const c = this.locale.completion;
    const questionContainer = this.shadow.getElementById('question-container');
    const buttonGroup = this.shadow.getElementById('button-group');
    const progressEl = this.shadow.getElementById('progress');

    progressEl.textContent = '';
    const isReferral = Boolean(doneDetail.referralCode);
    let formattedDate = doneDetail.completedAt;
    try {
      const dt = new Date(doneDetail.completedAt);
      formattedDate = this.lang.startsWith('am')
        ? new Intl.DateTimeFormat('am-ET-u-ca-ethiopic', { day: 'numeric', month: 'long', year: 'numeric' }).format(dt)
        : new Intl.DateTimeFormat('en-ET', { day: 'numeric', month: 'short', year: 'numeric' }).format(dt);
    } catch {
      // Fallback to ISO date string
    }

    questionContainer.innerHTML = `
      <div class="completion">
        <h2 class="question-title" id="completion-title" tabindex="-1">
          ${isReferral ? c.referralTitle : c.title}
        </h2>
        <p class="question-description">
          ${isReferral ? c.referralMessage : c.message}
        </p>
        ${
          isReferral
            ? `<div class="referral-box">
                <div class="referral-code">${doneDetail.referralCode}</div>
              </div>`
            : ''
        }
        ${
          queuedOffline
            ? `<div class="banner banner-offline" role="status">${this.locale.component.pendingSync}</div>`
            : ''
        }
        <p class="question-description">${c.recordedAtLabel} ${formattedDate}</p>
        <p class="question-description">${c.nextSteps}</p>
      </div>
    `;

    buttonGroup.innerHTML = '';
    const restartBtn = document.createElement('button');
    restartBtn.type = 'button';
    restartBtn.className = 'btn-outline';
    restartBtn.textContent = c.restart;
    restartBtn.addEventListener('click', () => {
      this.engine.answers = {};
      this.engine.voiceNotes = [];
      this.engine.currentIndex = 0;
      this.activeSubmissionId = createSubmissionId();
      this.renderStep({ moveFocus: true, speakStep: this.voice.enabled });
    });
    buttonGroup.appendChild(restartBtn);

    const heading = this.shadow.getElementById('completion-title');
    heading?.focus();
    this.announce(isReferral ? c.referralTitle : c.title);
  }

  dispatchStepEvent() {
    this.host.dispatchEvent(
      new CustomEvent('db-signup:step', {
        bubbles: true,
        composed: true,
        detail: {
          step: this.engine.progress.current,
          of: this.engine.progress.total,
          flow: this.engine.flowKey
        }
      })
    );
  }

  async saveDraft() {
    try {
      await this.storage.save(this.engine.flowKey, this.engine.currentIndex, this.engine.answers);
    } catch (err) {
      console.warn('Draft save warning:', err);
    }
  }

  showNotice(message) {
    const notice = this.shadow.getElementById('notice-banner');
    if (notice) {
      notice.textContent = message;
      notice.style.display = 'block';
    }
  }

  announce(message) {
    const liveRegion = this.shadow.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = '';
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 20);
    }
  }
}
