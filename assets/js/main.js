/* Verdi Pool Villas — interactions (version 2). The pages still read correctly without this file. */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* Split headings into words for the blur-up entrance. Thai has no spaces between words, so it is split by dictionary. */
  var lang = root.lang || "en";
  var seg = lang === "th" && window.Intl && Intl.Segmenter ? new Intl.Segmenter("th", { granularity: "word" }) : null;
  $$("[data-split]").forEach(function (el) {
    var text = el.textContent.trim();
    var parts = seg ? Array.from(seg.segment(text), function (s) { return s.segment; }) : text.split(/(\s+)/);
    var i = 0;
    el.setAttribute("aria-label", text);
    el.innerHTML = parts.map(function (w) {
      return /^\s+$/.test(w) ? " " : '<span class="w" aria-hidden="true" style="--wi:' + i++ + '">' + w + "</span>";
    }).join("");
  });

  /* Header, floating buttons, mobile bar */
  var header = $(".site-header");
  var floatCta = $(".float-cta");
  var bar = $(".enquiry-bar");
  var footer = $(".footer");

  /* Scroll-linked pieces */
  var heroMedia = $$(".hero__media, .page-hero__media");
  var bands = $$(".band img");
  var stackCards = $$(".stack__card, .log-card");
  var expand = $("[data-expand]");
  var expandItems = expand ? $$(".expand__item", expand) : [];
  var hoverIdx = -1;

  function setWide(i) {
    expandItems.forEach(function (it, j) { it.classList.toggle("is-wide", j === i); });
  }

  /* Header links. Each page marks its own link; on the home page the mark follows the section in view
     (sections name their link in data-nav). Links to the page already open scroll instead of reloading. */
  var navLinks = $$(".nav a, .mobile-menu__link");
  var spots = $$("[data-nav]");
  var spotted = null;
  function spy() {
    if (!spots.length) return;
    var line = window.innerHeight * 0.4, active = spots[0];
    spots.forEach(function (s) { if (s.getBoundingClientRect().top <= line) active = s; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) active = spots[spots.length - 1];
    var href = active.getAttribute("data-nav");
    if (href === spotted) return;
    spotted = href;
    navLinks.forEach(function (a) {
      if (a.getAttribute("href") === href) a.setAttribute("aria-current", href === "index.html" ? "page" : "location");
      else a.removeAttribute("aria-current");
    });
  }
  function page(path) { return path.replace(/index\.html$/, ""); }
  $$("a[href]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (a.host !== location.host || page(a.pathname) !== page(location.pathname) || a.search !== location.search) return;
      var target = a.hash ? document.getElementById(a.hash.slice(1)) : null;
      if (a.hash && !target) return;
      e.preventDefault();
      if (target) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", a.hash || location.pathname);
    });
  });

  function onScroll() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    if (header && !header.classList.contains("site-header--solid")) header.classList.toggle("is-solid", y > 40);
    spy();
    /* The quick-contact buttons step aside once the footer, which holds the contact details, comes into view. */
    var show = y > vh * 0.7 && (!footer || footer.getBoundingClientRect().top > vh * 0.75);
    if (floatCta) floatCta.classList.toggle("is-visible", show);
    if (bar) bar.classList.toggle("is-visible", show);
    if (reduce) return;

    var hy = Math.min(y, vh * 1.2);
    heroMedia.forEach(function (m) { m.style.transform = "translate3d(0," + (hy * 0.28).toFixed(1) + "px,0) scale(1.04)"; });
    bands.forEach(function (img) {
      var r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      img.style.transform = "translate3d(0," + (p * -12).toFixed(2) + "%,0)";
    });
    for (var i = 0; i < stackCards.length - 1; i++) {
      var a = stackCards[i], b = stackCards[i + 1];
      if (a.parentElement !== b.parentElement) { a.style.transform = ""; continue; }
      var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      var p2 = clamp(1 - (rb.top - ra.top) / ra.height, 0, 1);
      a.style.transform = "scale(" + (1 - p2 * 0.04).toFixed(4) + ")";
      a.style.opacity = (1 - p2 * 0.35).toFixed(3);
    }
    if (expand && hoverIdx < 0) {
      var re = expand.getBoundingClientRect();
      var prog = clamp((vh - re.top) / (vh + re.height), 0, 0.999);
      setWide(clamp(Math.floor((prog - 0.15) / 0.7 * expandItems.length), 0, expandItems.length - 1));
    }
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { onScroll(); ticking = false; }); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  expandItems.forEach(function (it, i) {
    it.addEventListener("mouseenter", function () { hoverIdx = i; setWide(i); });
    it.addEventListener("focus", function () { hoverIdx = i; setWide(i); });
  });
  if (expand) expand.addEventListener("mouseleave", function () { hoverIdx = -1; onScroll(); });

  /* Mobile menu */
  var toggle = $(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".mobile-menu a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("menu-open"); toggle.setAttribute("aria-expanded", "false"); });
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
    return SYMBOL[cur] + (Math.round(v / 1000) * 1000).toLocaleString(lang === "ru" ? "ru-RU" : "en-US");
  }
  function setCurrency(cur) {
    $$("[data-thb]").forEach(function (el) {
      el.textContent = (el.getAttribute("data-prefix") || "") + format(parseFloat(el.getAttribute("data-thb")), cur, el.hasAttribute("data-short"));
    });
    $$("[data-currency]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-currency") === cur ? "true" : "false"); });
    try { localStorage.setItem("verdi-currency", cur); } catch (e) {}
  }
  $$("[data-currency]").forEach(function (b) { b.addEventListener("click", function () { setCurrency(b.getAttribute("data-currency")); }); });
  // The currency buttons are commented out in the header for now, so ignore any saved choice and show baht.
  // To bring them back, uncomment the buttons and restore these three lines in place of setCurrency("THB").
  // var saved = "THB";
  // try { saved = localStorage.getItem("verdi-currency") || "THB"; } catch (e) {}
  // setCurrency(RATES[saved] ? saved : "THB");
  setCurrency("THB");

  /* Tabs (floor plans) */
  $$("[role='tablist']").forEach(function (list) {
    var tabs = $$("[role='tab']", list);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        panel.hidden = !on;
        if (on) { panel.classList.remove("is-entering"); void panel.offsetWidth; panel.classList.add("is-entering"); }
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var k = e.key;
        if (k === "ArrowRight" || k === "ArrowDown") { e.preventDefault(); select(tabs[(i + 1) % tabs.length], true); }
        if (k === "ArrowLeft" || k === "ArrowUp") { e.preventDefault(); select(tabs[(i - 1 + tabs.length) % tabs.length], true); }
      });
    });
  });

  /* Card slider over the photo */
  $$("[data-slider]").forEach(function (s) {
    var track = $(".slider__track", s);
    var n = track.children.length, i = 0, timer = null;
    function go(k) {
      i = (k + n) % n;
      track.style.transform = "translateX(" + (-100 * i) + "%)";
      Array.prototype.forEach.call(track.children, function (c, j) { c.setAttribute("aria-hidden", j === i ? "false" : "true"); });
    }
    function start() { if (!reduce) { stop(); timer = setInterval(function () { go(i + 1); }, 5000); } }
    function stop() { if (timer) clearInterval(timer); }
    $("[data-prev]", s).addEventListener("click", function () { go(i - 1); start(); });
    $("[data-next]", s).addEventListener("click", function () { go(i + 1); start(); });
    s.addEventListener("mouseenter", stop);
    s.addEventListener("mouseleave", start);
    go(0); start();
  });

  /* Hero slideshow. The first photo shows straight away; once the page has loaded the others load in the
     background, and every 4 seconds the next one fades in slowly over the current one. Each photo is decoded
     before its fade starts so the fade never stutters, and a photo that is still loading holds its turn, so
     the order never changes. Off when the visitor asks for reduced motion. */
  var show = $("[data-slideshow]");
  if (show && !reduce) {
    var slides = $$("img", show), cur = 0, busy = false;
    var swap = function (next) {
      slides.forEach(function (s) { s.classList.remove("is-under"); });
      slides[cur].classList.remove("is-on");
      slides[cur].classList.add("is-under");
      slides[next].classList.add("is-on");
      cur = next;
      busy = false;
    };
    var play = function () {
      show.classList.add("is-playing");
      setInterval(function () {
        var next = (cur + 1) % slides.length, img = slides[next];
        if (busy || document.hidden || !img.complete || !img.naturalWidth) return;
        busy = true;
        if (img.decode) img.decode().then(function () { swap(next); }, function () { swap(next); });
        else swap(next);
      }, 4000);
    };
    if (document.readyState === "complete") play(); else window.addEventListener("load", play);
  }

  /* Map pins take turns being highlighted */
  var pins = $$(".pin:not(.pin--home)");
  if (pins.length && !reduce) {
    var pi = 0;
    pins[0].classList.add("is-on");
    setInterval(function () {
      pins[pi].classList.remove("is-on");
      pi = (pi + 1) % pins.length;
      pins[pi].classList.add("is-on");
    }, 2200);
  }

  /* Count-up numbers */
  function countUp(el) {
    var to = parseFloat(el.getAttribute("data-count"));
    var dec = (el.getAttribute("data-count").split(".")[1] || "").length;
    if (reduce) { el.textContent = to.toFixed(dec); return; }
    var t0 = null, dur = 1600;
    function step(t) {
      if (!t0) t0 = t;
      var p = clamp((t - t0) / dur, 0, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Lightbox for any [data-shot] */
  var lb = $(".lightbox");
  if (lb) {
    var shots = $$("[data-shot]");
    var img = $("img", lb), count = $(".lightbox__count", lb), idx = 0, lastFocus = null;
    function show(i) {
      idx = (i + shots.length) % shots.length;
      img.src = shots[idx].getAttribute("data-shot");
      img.alt = shots[idx].getAttribute("data-alt") || "";
      count.textContent = (idx + 1) + " / " + shots.length;
    }
    function open(i) { lastFocus = document.activeElement; show(i); lb.classList.add("is-open"); $(".lightbox__close", lb).focus(); document.body.style.overflow = "hidden"; }
    function close() { lb.classList.remove("is-open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
    shots.forEach(function (s, i) {
      s.addEventListener("click", function () { open(i); });
    });
    $$("[data-open-gallery]").forEach(function (b) { b.addEventListener("click", function () { open(0); }); });
    $(".lightbox__close", lb).addEventListener("click", close);
    $(".lightbox__prev", lb).addEventListener("click", function () { show(idx - 1); });
    $(".lightbox__next", lb).addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    });
  }

  /* Entrances */
  var watch = $$(".reveal, [data-split], [data-in], [data-count]");
  if ("IntersectionObserver" in window) {
    // Counters start from zero and count up as they come into view; without the observer they keep their final figure.
    if (!reduce) $$("[data-count]").forEach(function (el) { el.textContent = (0).toFixed((el.getAttribute("data-count").split(".")[1] || "").length); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        if (en.target.hasAttribute("data-count")) countUp(en.target);
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    watch.forEach(function (el) { io.observe(el); });
  } else {
    watch.forEach(function (el) { el.classList.add("is-in"); });
  }

  var yr = $("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
