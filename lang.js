// lang.js
let translations = {};
let currentLang = 'en';

function setLanguage(lang) {
  fetch(`lang/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      translations = data;
      currentLang = lang;
      translatePage();
      localStorage.setItem('lang', lang);
    });
}

function translatePage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang') || 'en';
  setLanguage(savedLang);
  const selector = document.getElementById('language-selector');
  if (selector) {
    selector.value = savedLang;
    selector.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }
}); 