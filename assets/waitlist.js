(function () {
  var config = window.PLATMEMOIR_SITE || window.PLATMEMOIR_WAITLIST || {};
  var formspreeId = (config.formspreeId || '').trim();

  function getQueryParam(name) {
    var match = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : '';
  }

  function getFeedbackEl(form) {
    var el = form.querySelector('.waitlist-feedback');
    if (!el) {
      el = document.createElement('p');
      el.className = 'waitlist-feedback';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      form.appendChild(el);
    }
    return el;
  }

  function resetWaitlistForm(form) {
    form.classList.remove('is-success-state');
    setFeedback(form, '', '');
    var emailInput = form.querySelector('input[name="email"]');
    if (emailInput) {
      emailInput.focus();
    }
  }

  function setFeedback(form, message, type) {
    var el = getFeedbackEl(form);
    el.className = 'waitlist-feedback' + (type ? ' is-' + type : '');

    if (type === 'success') {
      el.innerHTML =
        '<span class="waitlist-feedback-icon" aria-hidden="true"><i class="fas fa-check-circle"></i></span>' +
        '<strong class="waitlist-feedback-title">You\'re on the list!</strong>' +
        '<span class="waitlist-feedback-detail">We\'ll email you when hardcover publishing opens.</span>' +
        '<button type="button" class="waitlist-reset-link">Use a different email</button>';
      el.hidden = false;
      form.classList.add('is-success-state');
      return;
    }

    form.classList.remove('is-success-state');
    el.textContent = message || '';
    el.hidden = !message;
  }

  function getSubmitControl(form) {
    return form.querySelector('input[type="submit"], button[type="submit"]');
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

    form.addEventListener('click', function (event) {
      if (!event.target.closest('.waitlist-reset-link')) {
        return;
      }
      event.preventDefault();
      resetWaitlistForm(form);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!formspreeId) {
        alert('Waitlist is not connected yet. Add your Formspree form id in assets/waitlist-config.js');
        return;
      }

      var submitControl = getSubmitControl(form);
      var defaultLabel = submitControl ? (submitControl.value || submitControl.textContent) : 'Join waitlist';
      var emailInput = form.querySelector('input[name="email"]');
      var succeeded = false;

      setFeedback(form, '', '');
      if (submitControl) {
        submitControl.disabled = true;
        if (submitControl.tagName === 'INPUT') {
          submitControl.value = 'Sending…';
        } else {
          submitControl.textContent = 'Sending…';
        }
      }

      fetch('https://formspree.io/f/' + formspreeId, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json'
        }
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok) {
            succeeded = true;
            setFeedback(form, '', 'success');
            if (emailInput) {
              emailInput.value = '';
            }
            return;
          }

          var errorMessage = 'Something went wrong. Please try again.';
          if (result.data && result.data.error) {
            errorMessage = result.data.error;
          } else if (result.data && result.data.errors) {
            errorMessage = result.data.errors.map(function (err) {
              return err.message;
            }).join(' ');
          }
          setFeedback(form, errorMessage, 'error');
        })
        .catch(function () {
          setFeedback(
            form,
            'Could not reach the server. Check your connection and try again.',
            'error'
          );
        })
        .finally(function () {
          if (succeeded || !submitControl) {
            return;
          }
          submitControl.disabled = false;
          if (submitControl.tagName === 'INPUT') {
            submitControl.value = defaultLabel;
          } else {
            submitControl.textContent = defaultLabel;
          }
        });
    });
  });
})();
