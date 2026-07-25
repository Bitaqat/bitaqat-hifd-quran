(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("contact-status");
  var submitBtn = document.getElementById("contact-submit");
  var messages = {
    missingTurnstile: form.dataset.msgMissingTurnstile,
    sending: form.dataset.msgSending,
    success: form.dataset.msgSuccess,
    error: form.dataset.msgError,
  };

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    var formData = new FormData(form);
    var turnstileToken = formData.get("cf-turnstile-response");

    if (!turnstileToken) {
      status.textContent = messages.missingTurnstile;
      return;
    }

    submitBtn.disabled = true;
    status.textContent = messages.sending;

    try {
      var res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          turnstileToken: turnstileToken,
        }),
      });
      var data = await res.json();
      if (data.ok) {
        status.textContent = messages.success;
        form.reset();
        if (window.turnstile) window.turnstile.reset();
      } else {
        status.textContent = messages.error;
      }
    } catch (err) {
      status.textContent = messages.error;
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
