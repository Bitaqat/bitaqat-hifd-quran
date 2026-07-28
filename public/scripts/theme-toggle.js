(function () {
  var buttons = document.querySelectorAll(".js-theme-toggle");
  if (!buttons.length) return;

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var dark = !document.documentElement.classList.contains("dark");
      document.documentElement.classList.toggle("dark", dark);
      localStorage.setItem("theme", dark ? "dark" : "light");
    });
  });
})();
