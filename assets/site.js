'use strict';
const dialog = document.querySelector('#lightbox');
let opener;
document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
  opener = button;
  dialog.querySelector('img').src = button.dataset.photo;
  dialog.querySelector('img').alt = button.querySelector('img').alt;
  dialog.querySelector('p').textContent = button.dataset.caption;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}));
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect=dialog.getBoundingClientRect(); if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; opener?.focus(); });

const loadMore = document.querySelector('.load-more');
loadMore?.addEventListener('click', () => {
  const collection = document.getElementById(loadMore.getAttribute('aria-controls'));
  collection.hidden = false;
  loadMore.setAttribute('aria-expanded', 'true');
  loadMore.hidden = true;
  collection.querySelector('a')?.focus({preventScroll:true});
});

const reading = document.querySelector('.article-reading');
if (reading) {
  const controls = reading.querySelector('.reading-controls');
  const tabs = [...reading.querySelectorAll('[data-reading-language]')];
  const panels = [...reading.querySelectorAll('[data-reading-panel]')];
  const original = reading.querySelector('.original-disclosure');

  function selectLanguage(language, { focus = false, updateUrl = false } = {}) {
    tabs.forEach(tab => {
      const selected = tab.dataset.readingLanguage === language;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus({ preventScroll: true });
    });
    panels.forEach(panel => {
      panel.hidden = panel.dataset.readingPanel !== language;
    });
    if (original) original.hidden = language !== 'en';
    if (updateUrl) {
      history.replaceState(null, '', language === 'en' ? '#english' : '#chinese');
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      selectLanguage(tab.dataset.readingLanguage, { updateUrl: true });
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectLanguage(tabs[next].dataset.readingLanguage, { focus: true, updateUrl: true });
    });
  });

  selectLanguage(location.hash === '#english' ? 'en' : 'zh');
  reading.classList.add('tabs-ready');
  controls.hidden = false;
  const hasReadingFragment = () => location.hash === '#english' || location.hash === '#chinese';
  const revealReadingControls = () => {
    if (hasReadingFragment()) controls.scrollIntoView({ block: 'start' });
  };
  if (document.readyState === 'complete') revealReadingControls();
  else window.addEventListener('load', revealReadingControls, { once: true });
  window.addEventListener('hashchange', () => {
    if (hasReadingFragment()) {
      selectLanguage(location.hash === '#english' ? 'en' : 'zh');
      revealReadingControls();
    }
  });
}
