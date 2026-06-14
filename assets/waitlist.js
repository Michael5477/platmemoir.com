(function () {
  var config = window.PLATMEMOIR_SITE || window.PLATMEMOIR_WAITLIST || {};
  var formspreeId = (config.formspreeId || '').trim();

  function getQueryParam(name) {
    var match = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : '';
  }

  document.querySelectorAll('form.waitlist-form').forEach(function (form) {
    var sourceInput = form.querySelector('input[name="source"]');
    if (sourceInput && !sourceInput.value) {
      sourceInput.value = form.getAttribute('data-source') || 'website';
    }

    var utmSource = getQueryParam('utm_source');
    var utmMedium = getQueryParam('utm_medium');
    var utmSourceInput = form.querySelector('input[name="utm_source"]');
    var utmMediumInput = form.querySelector('input[name="utm_medium"]');
    if (utmSourceInput && utmSource) utmSourceInput.value = utmSource;
    if (utmMediumInput && utmMedium) utmMediumInput.value = utmMedium;

    if (!formspreeId) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        alert('Waitlist is not connected yet. Add your Formspree form id in assets/waitlist-config.js');
      });
      return;
    }

    form.action = 'https://formspree.io/f/' + formspreeId;
    form.method = 'POST';
  });
})();
