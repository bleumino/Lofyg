// Create the translate widget container if it doesn't exist
(function createTranslateContainer() {
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    document.body.appendChild(div);
  }
})();

// Load Google Translate script dynamically
function loadGoogleTranslate() {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.head.appendChild(script);
}

// Initialize Google Translate once the script loads
window.googleTranslateElementInit = function () {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,es,ja,ko,fr',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
};

// Load it after DOM is ready
document.addEventListener('DOMContentLoaded', loadGoogleTranslate);