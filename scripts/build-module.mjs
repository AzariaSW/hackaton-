import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function stripModuleSyntax(code) {
  return code
    .replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^\s*export\s+default\s+/gm, 'const __defaultExport = ')
    .replace(/^\s*export\s+(?=(class|function|const|let|var)\s)/gm, '')
    .trim();
}

const files = [
  'module/src/utils/phone.js',
  'module/src/flows/index.js',
  'module/src/utils/storage.js',
  'module/src/utils/voice.js',
  'module/src/utils/stepper.js',
  'module/src/component.js'
];

const enLocale = JSON.parse(fs.readFileSync(path.join(rootDir, 'module/src/locales/en.json'), 'utf8'));
const amLocale = JSON.parse(fs.readFileSync(path.join(rootDir, 'module/src/locales/am.json'), 'utf8'));

const chunks = files.map((rel) => {
  const raw = fs.readFileSync(path.join(rootDir, rel), 'utf8');
  let cleaned = stripModuleSyntax(raw);
  if (rel === 'module/src/component.js') {
    cleaned = cleaned.replace(
      /async loadLocale\(lang\)\s*\{[\s\S]*?\n  \}/,
      `async loadLocale(lang) {
    const safeLang = /^[a-z]{2,3}(-[a-z]{2,4})?$/.test(lang) ? lang.toLowerCase() : 'en';
    const shortLang = safeLang.split('-')[0];
    const customBase = this.host.getAttribute('locales-base');

    for (const candidate of [safeLang, shortLang]) {
      if (!customBase && __EMBEDDED_LOCALES[candidate]) {
        this.locale = __EMBEDDED_LOCALES[candidate];
        return;
      }
      if (typeof fetch === 'function') {
        try {
          const base = (customBase || (__scriptBase + 'src/locales')).replace(/\\/+$/, '');
          const res = await fetch(base + '/' + candidate + '.json');
          if (res.ok) {
            this.locale = await res.json();
            return;
          }
        } catch {
          // Continue fallback chain
        }
      }
      if (__EMBEDDED_LOCALES[candidate]) {
        this.locale = __EMBEDDED_LOCALES[candidate];
        return;
      }
    }

    this.locale = __EMBEDDED_LOCALES.en;
  }`
    );
  }
  return `  // --- ${rel} ---\n${cleaned}`;
});

const bundle = `/* Built single-file drop-in bundle — supports both <script defer> and <script type="module"> */
(function () {
  'use strict';
  var __scriptBase = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src)
    ? document.currentScript.src.replace(/\\/[^/]*$/, '/')
    : '/module/';
  var __EMBEDDED_LOCALES = {
    en: ${JSON.stringify(enLocale)},
    am: ${JSON.stringify(amLocale)}
  };

${chunks.join('\n\n')}

  class DbSignup extends HTMLElement {
    static observedAttributes = ['lang', 'mode', 'api', 'theme', 'audio-base'];

    constructor() {
      super();
      this._instance = new DbSignupComponent(this);
    }

    async connectedCallback() {
      await this._instance.mount();
    }

    disconnectedCallback() {
      this._instance.destroy();
    }

    async attributeChangedCallback(name, oldValue, newValue) {
      await this._instance.onAttributeChange(name, oldValue, newValue);
    }
  }

  if (typeof customElements !== 'undefined' && !customElements.get('db-signup')) {
    customElements.define('db-signup', DbSignup);
  }
})();
`;

const outPath = path.join(rootDir, 'module/db-signup.js');
fs.writeFileSync(outPath, bundle, 'utf8');
const bytes = Buffer.byteLength(bundle, 'utf8');
console.log(`Built ${outPath} (${bytes} bytes / ${(bytes / 1024).toFixed(1)} KB)`);
