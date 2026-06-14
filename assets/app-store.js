(function () {
  var config = window.PLATMEMOIR_SITE || window.PLATMEMOIR_WAITLIST || {};
  var url = (config.appStoreUrl || '').trim();
  var link = document.getElementById('app-store-link');
  if (!link) return;

  if (url) {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return;
  }

  link.classList.add('is-disabled');
  link.addEventListener('click', function (event) {
    event.preventDefault();
  });
})();
