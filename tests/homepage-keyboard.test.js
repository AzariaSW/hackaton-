import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

function bootSavannaPage(relPath) {
  const html = fs.readFileSync(path.resolve(relPath), 'utf8');
  const dom = new JSDOM(html, {
    url: 'http://localhost:3000/' + relPath,
    pretendToBeVisual: true
  });
  const { window } = dom;
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.MutationObserver = window.MutationObserver;
  globalThis.getComputedStyle = window.getComputedStyle.bind(window);
  if (!window.Element.prototype.scrollIntoView) {
    window.Element.prototype.scrollIntoView = () => {};
  }

  window.eval(fs.readFileSync(path.resolve('savanna/assets/js/static-page.js'), 'utf8'));
  window.eval(fs.readFileSync(path.resolve('savanna/assets/js/homepage-keyboard.js'), 'utf8'));
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  return window;
}

describe('Learner homepage cards keyboard navigation & logical tab order', () => {
  it('enhances paced homepage cards with skip link, regions, logical tab order, and arrow-key navigation', () => {
    const win = bootSavannaPage('savanna/pages/homepage-v1-paced.html');
    const doc = win.document;

    // Skip link & main landmark
    const skip = doc.querySelector('.db-skip-link');
    assert.ok(skip);
    assert.strictEqual(skip.getAttribute('href'), '#content');
    assert.strictEqual(doc.getElementById('content').getAttribute('tabindex'), '-1');

    // No positive tabindex anywhere on page
    const positiveTabs = [...doc.querySelectorAll('[tabindex]')].filter(
      (el) => Number.parseInt(el.getAttribute('tabindex'), 10) > 0
    );
    assert.strictEqual(positiveTabs.length, 0);

    // Hamburger & curriculum switcher are keyboard focusable buttons
    const hamburger = doc.querySelector('.hamburger');
    assert.strictEqual(hamburger.getAttribute('role'), 'button');
    assert.strictEqual(hamburger.getAttribute('tabindex'), '0');
    const switcher = doc.querySelector('#student-switch-curriculum [data-bs-toggle="dropdown"]');
    assert.strictEqual(switcher.getAttribute('role'), 'button');
    assert.strictEqual(switcher.getAttribute('tabindex'), '0');

    // Week strip DOM order places previous chevron before <nav> and supports ArrowRight/Home/End
    const region = doc.querySelector('.homepage-nav.scroll-region');
    const children = [...region.children];
    const prevIdx = children.indexOf(region.querySelector('.scroll-region__previous'));
    const navIdx = children.indexOf(region.querySelector('nav'));
    const nextIdx = children.indexOf(region.querySelector('.scroll-region__next'));
    assert.ok(prevIdx < navIdx && navIdx < nextIdx, 'Expected Previous -> Nav -> Next logical DOM order');

    const weekItems = [...region.querySelectorAll('.scroll-region__item')];
    weekItems[0].focus();
    weekItems[0].dispatchEvent(new win.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    assert.strictEqual(doc.activeElement, weekItems[1]);
    weekItems[1].dispatchEvent(new win.KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    assert.strictEqual(doc.activeElement, weekItems[weekItems.length - 1]);

    // Every homepage card is an accessible region and scrollable lists are keyboard focusable
    const cards = [...doc.querySelectorAll('#static-track-host .homepage-card')];
    assert.ok(cards.length >= 4);
    for (const card of cards) {
      assert.strictEqual(card.getAttribute('role'), 'region');
      assert.ok(card.getAttribute('aria-labelledby'));
    }

    const scrollBox = doc.querySelector('#static-track-host .overflow-auto');
    assert.strictEqual(scrollBox.getAttribute('tabindex'), '0');
    assert.strictEqual(scrollBox.getAttribute('role'), 'region');

    // Disambiguated "Resume" action labels inside deliverables
    const resumeBtn = doc.querySelector('#static-track-host .list-group-item a.btn');
    assert.match(resumeBtn.getAttribute('aria-label'), /^Resume: W10/);

    // ArrowDown moves focus across upcoming event links inside the card
    const eventLinks = [...doc.querySelectorAll('#static-track-host .card-body > a[href]')];
    assert.strictEqual(eventLinks.length, 2);
    eventLinks[0].focus();
    eventLinks[0].dispatchEvent(new win.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    assert.strictEqual(doc.activeElement, eventLinks[1]);

    // Card quick-jump bar targets real cards
    const jumpLinks = [...doc.querySelectorAll('#db-card-jump-nav .db-card-jump__link')];
    assert.ok(jumpLinks.length >= 4);
  });

  it('enhances self-paced homepage cards with ARIA tabs, roving tabindex, and tooltip keyboard access', () => {
    const win = bootSavannaPage('savanna/pages/homepage-v1-self-paced.html');
    const doc = win.document;

    // My activities module buttons act as ARIA vertical tablist with roving tabindex
    const tabs = [...doc.querySelectorAll('button[data-section-index]')];
    assert.strictEqual(tabs.length, 3);
    assert.strictEqual(tabs[0].parentElement.getAttribute('role'), 'tablist');
    assert.strictEqual(tabs[1].getAttribute('role'), 'tab');
    assert.strictEqual(tabs[1].getAttribute('aria-selected'), 'true');
    assert.strictEqual(tabs[1].getAttribute('tabindex'), '0');
    assert.strictEqual(tabs[0].getAttribute('tabindex'), '-1');

    // ArrowDown activates Module 3 and updates aria-selected + tabpanel aria-labelledby
    tabs[1].focus();
    tabs[1].dispatchEvent(new win.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    assert.strictEqual(doc.activeElement, tabs[2]);
    assert.strictEqual(tabs[2].getAttribute('aria-selected'), 'true');
    assert.strictEqual(tabs[2].getAttribute('tabindex'), '0');
    assert.strictEqual(tabs[1].getAttribute('tabindex'), '-1');

    const panel = doc.querySelector('[data-section-host]');
    assert.strictEqual(panel.getAttribute('role'), 'tabpanel');
    assert.strictEqual(panel.getAttribute('aria-labelledby'), tabs[2].id);
    assert.match(panel.textContent, /Mastery Project: VA Profile Video/);

    // Pacing Boost tooltip is keyboard focusable
    const tooltipTrigger = doc.querySelector('[data-bs-toggle="tooltip"]');
    assert.strictEqual(tooltipTrigger.getAttribute('tabindex'), '0');
    assert.strictEqual(tooltipTrigger.getAttribute('role'), 'button');
    assert.ok(tooltipTrigger.getAttribute('aria-label'));

    // My upcoming events list supports ArrowDown/ArrowUp
    const eventLinks = [...doc.querySelectorAll('.list-group a.list-group-item')];
    assert.strictEqual(eventLinks.length, 3);
    eventLinks[0].focus();
    eventLinks[0].dispatchEvent(new win.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    assert.strictEqual(doc.activeElement, eventLinks[1]);
  });
});
