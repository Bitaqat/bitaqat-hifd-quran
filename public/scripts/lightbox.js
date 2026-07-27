(function () {
  var images = document.querySelectorAll("img.js-lightbox");
  if (!images.length) return;

  var overlay = document.createElement("div");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.className =
    "fixed inset-0 z-100 hidden items-center justify-center bg-black/80 p-6 cursor-zoom-out";
  overlay.innerHTML =
    '<img class="max-h-full max-w-full rounded-lg object-contain" alt="" />' +
    '<button type="button" aria-label="Close" class="fixed end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>' +
    "</button>";
  document.body.appendChild(overlay);

  var overlayImg = overlay.querySelector("img");
  var closeBtn = overlay.querySelector("button");

  function open(src, alt) {
    overlayImg.src = src;
    overlayImg.alt = alt || "";
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
    overlayImg.src = "";
    document.body.style.overflow = "";
  }

  images.forEach(function (img) {
    img.addEventListener("click", function () {
      open(img.currentSrc || img.src, img.alt);
    });
  });

  overlay.addEventListener("click", function (event) {
    if (event.target === overlayImg) return;
    close();
  });
  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") close();
  });
})();
