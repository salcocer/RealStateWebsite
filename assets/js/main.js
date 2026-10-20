/* Verdi Pool Villas — small enhancements. The site works without this file. */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");

  /* Header turns solid once the page scrolls past the hero top */
  var header = document.querySelector(".site-header");
  var bar = document.querySelector(".enquiry-bar");
  function onScroll() {
    var y = window.scrollY;
    if (header && !header.classList.contains("site-header--solid")) {
      header.classList.toggle("is-solid", y > 40);
    }
    if (bar) bar.classList.toggle("is-visible", y > window.innerHeight * 0.6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".mobile-menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Currency switch. Prices are stored in baht; other currencies are approximate. */
  var RATES = { THB: 1, USD: 1 / 32.2, EUR: 1 / 37.6, RUB: 1 / 0.4 };
  var SYMBOL = { THB: "฿", USD: "US$", EUR: "€", RUB: "₽" };
  function format(thb, cur, short) {
    var v = thb * RATES[cur];
    if (short) {
      var m = v / 1e6;
      if (m < 1) return SYMBOL[cur] + Math.round(v / 1000) + "K";
      return SYMBOL[cur] + (m >= 10 ? m.toFixed(1) : m.toFixed(2)).replace(/\.?0+$/, "") + "M";
    }
    return SYMBOL[cur] + (Math.round(v / 1000) * 1000).toLocaleString("en-US");
  }
  function setCurrency(cur) {
    document.querySelectorAll("[data-thb]").forEach(function (el) {
      var thb = parseFloat(el.getAttribute("data-thb"));
      var prefix = el.getAttribute("data-prefix") || "";
      el.textContent = prefix + format(thb, cur, el.hasAttribute("data-short"));
    });
    document.querySelectorAll("[data-currency]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-currency") === cur ? "true" : "false");
    });
    document.querySelectorAll("[data-approx]").forEach(function (el) { el.hidden = cur === "THB"; });
    try { localStorage.setItem("verdi-currency", cur); } catch (e) {}
  }
  document.querySelectorAll("[data-currency]").forEach(function (b) {
    b.addEventListener("click", function () { setCurrency(b.getAttribute("data-currency")); });
  });
  var saved = "THB";
  try { saved = localStorage.getItem("verdi-currency") || "THB"; } catch (e) {}
  if (!RATES[saved]) saved = "THB";
  setCurrency(saved);

  /* Tabs */
  document.querySelectorAll("[role='tablist']").forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll("[role='tab']"));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") select(tabs[(i + 1) % tabs.length], true);
        if (e.key === "ArrowLeft") select(tabs[(i - 1 + tabs.length) % tabs.length], true);
      });
    });
  });

  /* Carousels */
  document.querySelectorAll("[data-carousel]").forEach(function (c) {
    var track = c.querySelector(".carousel__track");
    var step = function () { var item = track.firstElementChild; return item ? item.getBoundingClientRect().width + 24 : 300; };
    var prev = c.querySelector("[data-prev]");
    var next = c.querySelector("[data-next]");
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
  });

  /* Gallery lightbox */
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var shots = Array.prototype.slice.call(document.querySelectorAll("[data-shot]"));
    var img = lb.querySelector("img");
    var count = lb.querySelector(".lightbox__count");
    var idx = 0, lastFocus = null;
    function show(i) {
      idx = (i + shots.length) % shots.length;
      img.src = shots[idx].getAttribute("data-shot");
      img.alt = shots[idx].getAttribute("data-alt") || "";
      count.textContent = (idx + 1) + " / " + shots.length;
    }
    function open(i) { lastFocus = document.activeElement; show(i); lb.classList.add("is-open"); lb.querySelector(".lightbox__close").focus(); document.body.style.overflow = "hidden"; }
    function close() { lb.classList.remove("is-open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
    shots.forEach(function (s, i) { s.addEventListener("click", function () { open(i); }); });
    lb.querySelector(".lightbox__close").addEventListener("click", close);
    lb.querySelector(".lightbox__prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lightbox__next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    });
  }

  /* Viewing forms: no backend yet, so confirm in place. */
  document.querySelectorAll("form[data-viewing]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      if (f.getAttribute("action") && f.getAttribute("action") !== "#") return;
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      f.classList.add("is-sent");
    });
  });

  /* Reveal on scroll */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }

  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
