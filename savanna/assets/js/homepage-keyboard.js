(() => {
  'use strict';

  let lastModalTrigger = null;
  let cardIdCounter = 0;

  function ensureLiveRegion() {
    let region = document.getElementById('savanna-a11y-status');
    if (!region) {
      region = document.createElement('div');
      region.id = 'savanna-a11y-status';
      region.className = 'visually-hidden';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      document.body.appendChild(region);
    }
    return region;
  }

  function announce(message) {
    if (!message) return;
    const region = ensureLiveRegion();
    region.textContent = '';
    setTimeout(() => {
      region.textContent = message;
    }, 20);
  }

  function ensureSkipLinkAndHeading() {
    const main = document.getElementById('content') || document.querySelector('main');
    if (main && !main.hasAttribute('tabindex')) {
      main.setAttribute('tabindex', '-1');
    }

    if (main && !document.querySelector('.db-skip-link')) {
      const skip = document.createElement('a');
      skip.className = 'db-skip-link';
      skip.href = `#${main.id || 'content'}`;
      skip.textContent = 'Skip to main content';
      document.body.prepend(skip);
    }

    const home = document.querySelector('.student-home');
    if (home && !document.querySelector('h1')) {
      const h1 = document.createElement('h1');
      h1.className = 'visually-hidden';
      h1.textContent = document.title ? document.title.split('|')[0].trim() : 'Learner Dashboard';
      home.prepend(h1);
    }
  }

  function setupHeaderAndSidebar() {
    const hamburger = document.querySelector('.hamburger');
    if (hamburger && !hamburger.dataset.dbKeyboardInit) {
      hamburger.dataset.dbKeyboardInit = 'true';
      hamburger.setAttribute('role', 'button');
      hamburger.setAttribute('tabindex', '0');
      hamburger.setAttribute('aria-controls', 'sidebar');
      hamburger.setAttribute('aria-label', 'Toggle navigation sidebar');
      const syncExpanded = () => {
        const expanded = !document.body.classList.contains('sidebar-collapsed');
        hamburger.setAttribute('aria-expanded', String(expanded));
      };
      syncExpanded();
      hamburger.querySelectorAll('i').forEach((icon) => icon.setAttribute('aria-hidden', 'true'));
      hamburger.addEventListener('click', () => setTimeout(syncExpanded, 0));
      hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          hamburger.click();
        }
      });
    }

    const logoLink = document.querySelector('.logo-container');
    if (logoLink && !logoLink.getAttribute('aria-label') && !logoLink.textContent.trim()) {
      logoLink.setAttribute('aria-label', 'Savanna Home');
    }

    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.setAttribute('role', 'navigation');
      sidebar.setAttribute('aria-label', 'Primary sidebar navigation');
      sidebar.querySelectorAll('a').forEach((link) => {
        if (!link.getAttribute('aria-label')) {
          const text = link.textContent.replace(/\s+/g, ' ').trim();
          if (text) link.setAttribute('aria-label', text);
        }
      });
    }

    const switcherTrigger = document.querySelector('#student-switch-curriculum [data-bs-toggle="dropdown"]');
    if (switcherTrigger && !switcherTrigger.dataset.dbKeyboardInit) {
      switcherTrigger.dataset.dbKeyboardInit = 'true';
      switcherTrigger.setAttribute('role', 'button');
      switcherTrigger.setAttribute('tabindex', '0');
      switcherTrigger.setAttribute('aria-haspopup', 'true');
      const currentTitle = switcherTrigger.textContent.replace(/\s+/g, ' ').trim();
      if (!switcherTrigger.getAttribute('aria-label')) {
        switcherTrigger.setAttribute('aria-label', `Switch course: ${currentTitle}`);
      }

      const menu = switcherTrigger.parentElement?.querySelector('.curriculum-switcher-menu');
      const toggleDropdown = () => {
        if (window.bootstrap?.Dropdown) {
          window.bootstrap.Dropdown.getOrCreateInstance(switcherTrigger).toggle();
        } else {
          switcherTrigger.click();
        }
      };

      switcherTrigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleDropdown();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (switcherTrigger.getAttribute('aria-expanded') !== 'true') {
            toggleDropdown();
          }
          const firstItem = menu?.querySelector('a, button, [tabindex="0"]');
          setTimeout(() => firstItem?.focus(), 20);
        }
      });

      if (menu) {
        menu.addEventListener('keydown', (e) => {
          const items = [...menu.querySelectorAll('a.curriculum-switcher-tile, button')];
          const idx = items.indexOf(document.activeElement);
          if (e.key === 'ArrowDown' && items.length) {
            e.preventDefault();
            items[(idx + 1) % items.length].focus();
          } else if (e.key === 'ArrowUp' && items.length) {
            e.preventDefault();
            items[(idx - 1 + items.length) % items.length].focus();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            if (window.bootstrap?.Dropdown) {
              window.bootstrap.Dropdown.getOrCreateInstance(switcherTrigger).hide();
            }
            switcherTrigger.focus();
          }
        });
      }
    }
  }

  function setupWeekStrip() {
    document.querySelectorAll('.homepage-nav.scroll-region').forEach((region) => {
      if (region.dataset.dbKeyboardInit) return;
      region.dataset.dbKeyboardInit = 'true';

      const nav = region.querySelector('nav');
      const prevBtn = region.querySelector('.scroll-region__previous');
      const nextBtn = region.querySelector('.scroll-region__next');

      if (nav) {
        nav.setAttribute('aria-label', 'Course weeks');
        // Keep left-to-right Tab order: Previous chevron -> Week links -> Next chevron
        if (prevBtn && nav.previousElementSibling !== prevBtn) {
          region.insertBefore(prevBtn, nav);
        }
      }

      const syncChevronVisibility = (btn) => {
        if (!btn) return;
        const hidden = btn.style.visibility === 'hidden';
        btn.setAttribute('tabindex', hidden ? '-1' : '0');
        btn.removeAttribute('aria-hidden');
      };

      [prevBtn, nextBtn].forEach((btn) => {
        if (!btn) return;
        btn.setAttribute('role', 'button');
        syncChevronVisibility(btn);
        setTimeout(() => syncChevronVisibility(btn), 0);
        btn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
          }
        });
        const observer = new MutationObserver(() => syncChevronVisibility(btn));
        observer.observe(btn, { attributes: true, attributeFilter: ['style'] });
      });

      const items = [...region.querySelectorAll('.scroll-region__item')];
      items.forEach((item, index) => {
        item.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            const target = items[(index + 1) % items.length];
            target.focus();
            target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const target = items[(index - 1 + items.length) % items.length];
            target.focus();
            target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
          } else if (e.key === 'Home') {
            e.preventDefault();
            items[0].focus();
            items[0].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          } else if (e.key === 'End') {
            e.preventDefault();
            items[items.length - 1].focus();
            items[items.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
          } else if (e.key === ' ') {
            e.preventDefault();
            item.click();
          }
        });

        item.addEventListener('click', () => {
          const label = item.textContent.replace(/\s+/g, ' ').trim();
          announce(`Loaded ${label} cards`);
        });
      });
    });
  }

  function getCardTitleText(card, fallbackIndex) {
    const header = card.querySelector('.card-header');
    if (header) return header.textContent.replace(/\s+/g, ' ').trim();
    const title = card.querySelector('.card-title, h2, h3, h4, h5');
    if (title) return title.textContent.replace(/\s+/g, ' ').trim();
    if (card.querySelector('.homepage-nav')) return 'Course weeks navigation';
    return `Dashboard card ${fallbackIndex}`;
  }

  function focusCardElement(card) {
    card.classList.add('db-card-focused');
    setTimeout(() => card.classList.remove('db-card-focused'), 1400);
    const target = card.querySelector(
      'a[href], button:not([disabled]), [tabindex="0"], [role="button"][tabindex="0"]'
    );
    if (target) {
      target.focus();
    } else {
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '-1');
      card.focus();
    }
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function refreshCardQuickJump() {
    const home = document.querySelector('.student-home');
    if (!home) return;

    let jumpBar = document.getElementById('db-card-jump-nav');
    if (!jumpBar) {
      jumpBar = document.createElement('nav');
      jumpBar.id = 'db-card-jump-nav';
      jumpBar.className = 'db-card-jump db-card-jump--sr';
      jumpBar.setAttribute('aria-label', 'Jump to learner homepage card');
      const greeting = home.firstElementChild;
      if (greeting) {
        greeting.after(jumpBar);
      } else {
        home.prepend(jumpBar);
      }
    }

    const cards = [...home.querySelectorAll('.homepage-card')].filter(
      (c) => !c.closest('template') && !c.querySelector('.homepage-nav')
    );

    jumpBar.innerHTML = '';
    if (!cards.length) return;

    const label = document.createElement('span');
    label.className = 'db-card-jump__label';
    label.textContent = 'Cards:';
    jumpBar.appendChild(label);

    cards.forEach((card, idx) => {
      const titleText = getCardTitleText(card, idx + 1);
      if (!card.id) {
        cardIdCounter += 1;
        card.id = `homepage-card-${cardIdCounter}`;
      }
      const link = document.createElement('a');
      link.className = 'db-card-jump__link';
      link.href = `#${card.id}`;
      link.textContent = titleText;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        focusCardElement(card);
        announce(`Moved to ${titleText} card`);
      });
      link.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
      jumpBar.appendChild(link);
    });
  }

  function enhanceCards(root = document) {
    // 1. Semantic region & heading association for every homepage card
    root.querySelectorAll('.homepage-card').forEach((card, idx) => {
      if (card.closest('template')) return;
      if (!card.getAttribute('role')) {
        card.setAttribute('role', 'region');
      }
      const heading = card.querySelector('.card-header, .card-title, h3, h5');
      if (heading) {
        if (!heading.id) {
          cardIdCounter += 1;
          heading.id = `homepage-card-heading-${cardIdCounter}`;
        }
        card.setAttribute('aria-labelledby', heading.id);
      } else if (!card.getAttribute('aria-label')) {
        card.setAttribute('aria-label', getCardTitleText(card, idx + 1));
      }

      // 2. Keyboard-scrollable .overflow-auto containers inside cards
      card.querySelectorAll('.overflow-auto').forEach((scrollBox) => {
        if (!scrollBox.hasAttribute('tabindex')) scrollBox.setAttribute('tabindex', '0');
        if (!scrollBox.getAttribute('role')) scrollBox.setAttribute('role', 'region');
        if (!scrollBox.getAttribute('aria-label')) {
          scrollBox.setAttribute('aria-label', `${getCardTitleText(card, idx + 1)} scrollable list`);
        }
      });

      // 3. Disambiguate repeated action link text inside deliverables/activity/footer buttons
      card.querySelectorAll('a.btn').forEach((btn) => {
        if (btn.dataset.dbBtnEnhanced) return;
        btn.dataset.dbBtnEnhanced = 'true';
        const btnText = btn.textContent.replace(/\s+/g, ' ').trim();
        if (!btn.getAttribute('aria-label') && /^(Resume|Show|Start Learning)$/i.test(btnText)) {
          const itemHeading = btn.closest('.list-group-item, .p-3')?.querySelector('h5, h4, h3');
          const contextTitle = itemHeading
            ? itemHeading.textContent.replace(/\s+/g, ' ').trim()
            : getCardTitleText(card, idx + 1);
          if (contextTitle) {
            btn.setAttribute('aria-label', `${btnText}: ${contextTitle}`);
          }
        }
        btn.addEventListener('keydown', (e) => {
          if (e.key === ' ') {
            e.preventDefault();
            btn.click();
          }
        });
      });

      // 4. ArrowUp/ArrowDown/Home/End navigation across upcoming event links inside cards
      const listLinks = [...card.querySelectorAll('.list-group a.list-group-item, .card-body > a[href]')];
      if (listLinks.length > 1) {
        listLinks.forEach((link, linkIdx) => {
          if (link.dataset.dbListKeyInit) return;
          link.dataset.dbListKeyInit = 'true';
          link.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              listLinks[(linkIdx + 1) % listLinks.length].focus();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              listLinks[(linkIdx - 1 + listLinks.length) % listLinks.length].focus();
            } else if (e.key === 'Home') {
              e.preventDefault();
              listLinks[0].focus();
            } else if (e.key === 'End') {
              e.preventDefault();
              listLinks[listLinks.length - 1].focus();
            } else if (e.key === ' ') {
              e.preventDefault();
              link.click();
            }
          });
        });
      }
    });

    // 5. Accessible names on progress bars inside cards
    root.querySelectorAll('[role="progressbar"]').forEach((bar) => {
      if (bar.closest('template') || bar.getAttribute('aria-label') || bar.getAttribute('aria-labelledby')) return;
      const card = bar.closest('.homepage-card');
      const title = card ? getCardTitleText(card, 1) : 'Progress';
      bar.setAttribute('aria-label', `${title} progress`);
    });

    // 6. Keyboard-focusable tooltips (e.g., My Pacing Boost info icon)
    root.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((tip) => {
      if (tip.closest('template') || tip.dataset.dbTipInit) return;
      tip.dataset.dbTipInit = 'true';
      if (!tip.hasAttribute('tabindex')) tip.setAttribute('tabindex', '0');
      if (!tip.getAttribute('role')) tip.setAttribute('role', 'button');
      const tipText = tip.getAttribute('data-bs-original-title') || tip.getAttribute('title') || tip.getAttribute('aria-label');
      if (tipText && !tip.getAttribute('aria-label')) {
        tip.setAttribute('aria-label', tipText);
      }
      tip.querySelectorAll('i').forEach((icon) => icon.setAttribute('aria-hidden', 'true'));
      tip.addEventListener('keydown', (e) => {
        const inst = window.bootstrap?.Tooltip?.getOrCreateInstance(tip);
        if ((e.key === 'Enter' || e.key === ' ') && inst) {
          e.preventDefault();
          inst.toggle();
        } else if (e.key === 'Escape' && inst) {
          inst.hide();
        }
      });
    });

    // 7. Self-paced "My activities" ARIA tablist & roving tabindex
    const sectionButtons = [...root.querySelectorAll('button[data-section-index]')].filter(
      (btn) => !btn.closest('template')
    );
    const sectionHost = root.querySelector('[data-section-host]') || document.querySelector('[data-section-host]');
    if (sectionButtons.length && sectionHost) {
      const tablist = sectionButtons[0].parentElement;
      if (tablist) {
        tablist.setAttribute('role', 'tablist');
        tablist.setAttribute('aria-label', 'Course modules');
        tablist.setAttribute('aria-orientation', 'vertical');
      }
      if (!sectionHost.id) sectionHost.id = 'self-paced-activity-panel';
      sectionHost.setAttribute('role', 'tabpanel');

      const syncTabs = (activeBtn) => {
        sectionButtons.forEach((btn, i) => {
          if (!btn.id) btn.id = `activity-tab-${i}`;
          const isSelected = activeBtn ? btn === activeBtn : btn.classList.contains('bg-light');
          btn.setAttribute('role', 'tab');
          btn.setAttribute('aria-selected', String(isSelected));
          btn.setAttribute('aria-controls', sectionHost.id);
          btn.setAttribute('tabindex', isSelected ? '0' : '-1');
          if (isSelected) sectionHost.setAttribute('aria-labelledby', btn.id);
        });
      };

      syncTabs(null);

      sectionButtons.forEach((btn, idx) => {
        if (btn.dataset.dbTabInit) return;
        btn.dataset.dbTabInit = 'true';
        btn.addEventListener('click', () => {
          syncTabs(btn);
          announce(`Loaded ${btn.textContent.replace(/\s+/g, ' ').trim()} activities`);
        });
        btn.addEventListener('keydown', (e) => {
          let nextIdx = null;
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            nextIdx = (idx + 1) % sectionButtons.length;
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            nextIdx = (idx - 1 + sectionButtons.length) % sectionButtons.length;
          } else if (e.key === 'Home') {
            nextIdx = 0;
          } else if (e.key === 'End') {
            nextIdx = sectionButtons.length - 1;
          }
          if (nextIdx !== null) {
            e.preventDefault();
            const target = sectionButtons[nextIdx];
            target.focus();
            target.click();
          }
        });
      });
    }

    refreshCardQuickJump();
  }

  function setupModalFocusRestore() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-bs-toggle="modal"]');
      if (trigger) lastModalTrigger = trigger;
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const trigger = e.target.closest('a[data-bs-toggle="modal"]');
        if (trigger) {
          lastModalTrigger = trigger;
        }
      }
    });
    document.addEventListener('hidden.bs.modal', () => {
      if (lastModalTrigger && document.contains(lastModalTrigger)) {
        lastModalTrigger.focus();
      }
    });
  }

  function observeDynamicCardHosts() {
    const trackHost = document.getElementById('static-track-host');
    if (trackHost) {
      new MutationObserver(() => enhanceCards(trackHost)).observe(trackHost, { childList: true });
    }
    const sectionHost = document.querySelector('[data-section-host]');
    if (sectionHost) {
      new MutationObserver(() => enhanceCards(sectionHost.closest('.homepage-card') || document)).observe(
        sectionHost,
        { childList: true }
      );
    }
  }

  function init() {
    ensureLiveRegion();
    ensureSkipLinkAndHeading();
    setupHeaderAndSidebar();
    setupWeekStrip();
    enhanceCards(document);
    setupModalFocusRestore();
    observeDynamicCardHosts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
