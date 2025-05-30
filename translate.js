// Ensure callback is defined BEFORE script loads
window.googleTranslateElementInit = function () {
  console.log("✅ Google Translate initialized.");
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,es,ja,ko,fr',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
};

// Load Google Translate script dynamically
function loadGoogleTranslate() {
  const existing = document.querySelector('script[src*="element.js"]');
  if (!existing) {
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}

// Ensure element exists and run loader after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('google_translate_element');
  if (el) {
    console.log("🧩 Found #google_translate_element, loading Translate...");
    loadGoogleTranslate();
  } else {
    console.warn("⚠️ #google_translate_element not found in DOM.");
  }
});