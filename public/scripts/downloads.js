(function () {
  var pills = document.querySelectorAll(".js-resource-actions");
  if (!pills.length) return;

  function pathFor(pill) {
    var link = pill.querySelector("a.js-track-download");
    return link ? new URL(link.href).pathname : null;
  }

  function setBadge(pill, count) {
    var badge = pill.querySelector(".download-count");
    if (badge && count > 0) {
      badge.textContent = "(" + count + ")";
    }
  }

  fetch("/api/counts")
    .then(function (res) {
      return res.json();
    })
    .then(function (counts) {
      pills.forEach(function (pill) {
        var path = pathFor(pill);
        if (path) setBadge(pill, counts[path] || 0);
      });
    })
    .catch(function () {
      // Best-effort — a failed fetch shouldn't affect the page.
    });

  pills.forEach(function (pill) {
    var path = pathFor(pill);
    if (!path) return;
    var links = pill.querySelectorAll("a.js-track-download");
    links.forEach(function (link) {
      link.addEventListener("click", function () {
        navigator.sendBeacon("/api/track", JSON.stringify({ path: path }));
        // Optimistic bump so the badge reflects this click without a reload;
        // matches the server's per-visitor dedupe by only bumping once per pill.
        if (!pill.dataset.tracked) {
          pill.dataset.tracked = "1";
          var badge = pill.querySelector(".download-count");
          if (badge) {
            var current = parseInt((badge.textContent.match(/\d+/) || ["0"])[0], 10);
            badge.textContent = "(" + (current + 1) + ")";
          }
        }
      });
    });
  });
})();
