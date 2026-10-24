document.addEventListener('DOMContentLoaded', function() {
  const language = new URLSearchParams(window.location.search).get('lang');
  const policyPages = {
    fa: 'privacy-policy-fa.html',
    ar: 'privacy-policy-ar.html',
    zh: 'privacy-policy-zh.html'
  };
  if (policyPages[language]) {
    window.location.replace(policyPages[language]);
    return;
  }

  var btn = document.getElementById('backBtn');
  if (btn) btn.addEventListener('click', function() {
    window.location.href = 'index.html';
  });
}); 