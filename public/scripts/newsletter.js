(function () {
  var forms = Array.prototype.slice.call(document.querySelectorAll("[data-newsletter-form]"));
  var unsubForm = document.getElementById("newsletter-unsub-form");
  if (!forms.length && !unsubForm) return;

  // Which block of the newsletter page to show. Lives here rather than in an inline script
  // on the page because the site's CSP sets script-src 'self' with no 'unsafe-inline'.
  var signupBlock = document.getElementById("nl-signup");
  if (signupBlock) {
    var params = new URLSearchParams(window.location.search);
    var unsubToken = params.get("u");

    if (params.get("confirmed")) {
      signupBlock.hidden = true;
      document.getElementById("nl-confirmed").hidden = false;
    } else if (unsubToken && /^[0-9a-f]{64}$/.test(unsubToken)) {
      signupBlock.hidden = true;
      unsubForm.dataset.token = unsubToken;
      document.getElementById("nl-unsub").hidden = false;
    } else if (params.get("invalid")) {
      document.getElementById("nl-invalid").hidden = false;
    }
  }

  // The Turnstile bundle is fetched on first interaction rather than on page load: the
  // signup form sits in the footer of every page, and most visitors never touch it.
  var scriptRequested = false;
  var scriptReady = false;
  var waiting = [];

  window.__bitaqatTurnstileReady = function () {
    scriptReady = true;
    waiting.splice(0).forEach(function (fn) {
      fn();
    });
  };

  function loadTurnstile(callback) {
    if (scriptReady) return callback();
    waiting.push(callback);
    if (scriptRequested) return;
    scriptRequested = true;
    var script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__bitaqatTurnstileReady";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  forms.forEach(function (form) {
    var input = form.querySelector("input[name='email']");
    var button = form.querySelector("button[type='submit']");
    var status = form.querySelector("[data-status]");
    var holder = form.querySelector("[data-turnstile]");
    var messages = form.dataset;
    var widgetId = null;
    var widgetRequested = false;

    function ensureWidget() {
      if (widgetRequested) return;
      widgetRequested = true;
      loadTurnstile(function () {
        widgetId = window.turnstile.render(holder, { sitekey: form.dataset.sitekey });
      });
    }

    input.addEventListener("focus", ensureWidget, { once: true });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      var email = (input.value || "").trim();
      if (!email || email.indexOf("@") < 1) {
        status.textContent = messages.msgInvalidEmail;
        return;
      }

      // Covers autofill-then-submit, where the field never received focus.
      ensureWidget();

      var token = widgetId !== null && window.turnstile ? window.turnstile.getResponse(widgetId) : "";
      if (!token) {
        status.textContent = messages.msgMissingTurnstile;
        return;
      }

      button.disabled = true;
      status.textContent = messages.msgSending;

      try {
        var res = await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, lang: form.dataset.lang, turnstileToken: token }),
        });
        var data = await res.json();
        if (data.ok) {
          status.textContent = messages.msgSuccess;
          form.reset();
        } else if (data.error === "rate_limited") {
          status.textContent = messages.msgRateLimited;
        } else if (data.error === "invalid_email") {
          status.textContent = messages.msgInvalidEmail;
        } else {
          status.textContent = messages.msgError;
        }
      } catch (err) {
        status.textContent = messages.msgError;
      } finally {
        button.disabled = false;
        // The token is single-use: without a reset a second attempt always fails.
        if (widgetId !== null && window.turnstile) window.turnstile.reset(widgetId);
      }
    });
  });

  if (unsubForm) {
    var unsubButton = unsubForm.querySelector("button[type='submit']");
    var unsubStatus = document.getElementById("newsletter-unsub-status");
    var unsubDone = document.getElementById("newsletter-unsub-done");

    unsubForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      unsubButton.disabled = true;
      unsubStatus.textContent = unsubForm.dataset.msgSending;

      try {
        var res = await fetch("/api/newsletter/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: unsubForm.dataset.token }),
        });
        var data = await res.json();
        if (data.ok) {
          unsubForm.hidden = true;
          unsubDone.hidden = false;
        } else {
          unsubStatus.textContent = unsubForm.dataset.msgError;
          unsubButton.disabled = false;
        }
      } catch (err) {
        unsubStatus.textContent = unsubForm.dataset.msgError;
        unsubButton.disabled = false;
      }
    });
  }
})();
