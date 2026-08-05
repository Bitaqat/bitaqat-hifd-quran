(function () {
  var themeSelect = document.querySelector(".js-theme-select");
  var currentTheme = themeSelect ? themeSelect.value : "clair";
  var riwayaState = {};

  function applyAll() {
    document.querySelectorAll("[data-theme-variant]").forEach(function (el) {
      var themeOk = el.dataset.themeVariant === currentTheme;
      var riwayaOk = true;
      if (el.dataset.riwaya) {
        var group = el.closest("[data-riwaya-group]");
        var groupId = group ? group.dataset.riwayaGroup : null;
        var current = (groupId && riwayaState[groupId]) || "hafs";
        riwayaOk = el.dataset.riwaya === current;
      }
      el.hidden = !(themeOk && riwayaOk);
    });
  }

  if (themeSelect) {
    themeSelect.addEventListener("change", function () {
      currentTheme = themeSelect.value;
      applyAll();
    });
  }

  document.querySelectorAll("[data-riwaya-group]").forEach(function (group) {
    var groupId = group.dataset.riwayaGroup;
    riwayaState[groupId] = "hafs";
    var buttons = group.querySelectorAll("[data-riwaya-btn]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        riwayaState[groupId] = btn.dataset.riwayaBtn;
        buttons.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        applyAll();
      });
    });
  });

  applyAll();
})();
