/* theme toggle, mobile nav, scroll reveal */
(function () {
  "use strict";

  // ---- theme -------------------------------------------------------------
  var root = document.documentElement;
  var btn = document.getElementById("themeBtn");
  var saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  updateIcon();

  function updateIcon() {
    if (!btn) return;
    btn.textContent = root.getAttribute("data-theme") === "light" ? "☀" : "☾";
  }
  if (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      updateIcon();
    });
  }

  // ---- mobile nav --------------------------------------------------------
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navlinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.textContent = isOpen ? "Close" : "Menu";
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.textContent = "Menu";
      });
    });
  }

  // ---- lightbox ----------------------------------------------------------
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    document.querySelectorAll(".gallery .shot").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var img = btn.querySelector("img");
        if (!img) return;
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
      });
    });
    function closeLightbox() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
    }
    lightbox.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  // ---- scroll reveal -----------------------------------------------------
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + "ms";
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }
})();
