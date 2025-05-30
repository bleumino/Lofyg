// translate.js

// Dynamically load the Google Translate script
function loadGoogleTranslate() {
  return new Promise((resolve, reject) => {
    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,ja,ko,vi de,it,zh-CN,zh-TW,pt,ru,ar,hi,id,th,pl,tr,nl,sv,ro,cs,el,he,hu,fa',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
      resolve();
    };

    const script = document.createElement('script');
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Optional: Automatically load it when the script runs
loadGoogleTranslate().then(() => {
  console.log("✅ Google Translate initialized.");
}).catch(err => {
  console.error("❌ Failed to load Google Translate:", err);
});