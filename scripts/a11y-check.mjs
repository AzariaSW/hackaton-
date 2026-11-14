import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import axe from 'axe-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const pages = [
  'demo/blank.html',
  'demo/jobs.html',
  'demo/auth.html',
  'savanna/index.html',
  'savanna/pages/signup.html',
  'savanna/pages/profile.html',
  'savanna/pages/jobs.html',
  'savanna/pages/homepage-v1-paced.html',
  'savanna/pages/homepage-v1-self-paced.html',
  'savanna/pages/concept-with-navigation.html'
];

const moduleCode = fs.readFileSync(path.join(rootDir, 'module/db-signup.js'), 'utf8');
const savannaStaticCode = fs.readFileSync(path.join(rootDir, 'savanna/assets/js/static-page.js'), 'utf8');
const savannaKeyboardCode = fs.readFileSync(path.join(rootDir, 'savanna/assets/js/homepage-keyboard.js'), 'utf8');

let totalSeriousOrCritical = 0;

for (const relPath of pages) {
  const html = fs.readFileSync(path.join(rootDir, relPath), 'utf8');
  const dom = new JSDOM(html, {
    url: 'http://localhost:3000/' + relPath,
    pretendToBeVisual: true
  });

  const { window } = dom;
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.customElements = window.customElements;
  globalThis.CustomEvent = window.CustomEvent;
  globalThis.MutationObserver = window.MutationObserver;
  globalThis.getComputedStyle = window.getComputedStyle.bind(window);
  if (!globalThis.navigator) {
    Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true });
  }
  if (!window.Element.prototype.scrollIntoView) {
    window.Element.prototype.scrollIntoView = () => {};
  }

  // Evaluate Savanna enhancements if page loads homepage-keyboard.js
  if (html.includes('homepage-keyboard.js')) {
    window.eval(savannaStaticCode);
    window.eval(savannaKeyboardCode);
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  }

  // Evaluate component bundle and wait for async connectedCallback() mount
  if (html.includes('db-signup')) {
    window.eval(moduleCode);
    const widget = window.document.querySelector('db-signup');
    if (widget) {
      if (!widget.shadowRoot) {
        await widget.connectedCallback?.();
      }
      await new Promise((r) => setTimeout(r, 40));
    }
  }

  // Run axe-core on outer host document (color-contrast disabled in jsdom since layout/CSS cascade isn't computed)
  const docResults = await axe.run(window.document.documentElement, {
    rules: {
      'color-contrast': { enabled: false },
      region: { enabled: false }
    }
  });

  // Also audit rendered <db-signup> shadow root HTML inside an attached <main> landmark
  let shadowViolations = [];
  const widget = window.document.querySelector('db-signup');
  if (widget?.shadowRoot) {
    const shadowHost = window.document.createElement('main');
    shadowHost.setAttribute('aria-label', 'Web Component Shadow DOM');
    shadowHost.innerHTML = widget.shadowRoot.innerHTML;
    window.document.body.appendChild(shadowHost);
    const shadowResults = await axe.run(shadowHost, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
      rules: {
        'color-contrast': { enabled: false },
        'landmark-one-main': { enabled: false },
        'page-has-heading-one': { enabled: false },
        'bypass': { enabled: false }
      }
    });
    shadowHost.remove();
    shadowViolations = shadowResults.violations;
  }

  const allViolations = [...docResults.violations, ...shadowViolations];
  const criticalOrSerious = allViolations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious'
  );
  totalSeriousOrCritical += criticalOrSerious.length;

  console.log(
    `${relPath}: ${criticalOrSerious.length} critical/serious, ${allViolations.length} total violations`
  );
  for (const v of allViolations) {
    console.log(`  - [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes) -> ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  }
}

if (totalSeriousOrCritical > 0) {
  console.error(`FAIL: ${totalSeriousOrCritical} critical/serious accessibility violations found.`);
  process.exit(1);
}
console.log('PASS: Zero critical or serious axe-core violations across all demo, Savanna, and <db-signup> pages.');
