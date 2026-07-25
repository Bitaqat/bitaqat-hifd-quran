(function () {
  var links = document.querySelectorAll("a.js-track-download");
  if (!links.length) return;

  fetch("/api/counts")
    .then(function (res) {
      return res.json();
    })
    .then(function (counts) {
      links.forEach(function (link) {
        var path = new URL(link.href).pathname;
        var count = counts[path] || 0;
        var badge = link.querySelector(".download-count");
        if (badge && count > 0) {
          badge.textContent = "(" + count + ")";
        }
      });
    })
    .catch(function () {
      // Best-effort — a failed fetch shouldn't affect the page.
    });

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      var path = new URL(link.href).pathname;
      navigator.sendBeacon("/api/track", JSON.stringify({ path: path }));
    });
  });
})();
