/* ============================================================
   SATH (सहायता) — script.js
   Vanilla JS only. Shared across all pages.
   Handles: loader, theme, nav, scroll reveal, counters,
            hero particle canvas, back-to-top, form validation.
   ============================================================ */
(function () {
  "use strict";

  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Page loader ---------- */
  window.addEventListener("load", () => {
    const loader = $(".loader");
    if (loader) setTimeout(() => loader.classList.add("hidden"), 350);
  });

  /* ---------- 2. Theme toggle (persisted) ---------- */
  const THEME_KEY = "sath-theme";
  const root = document.documentElement;

  function storedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function applyTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
  }
  // Initial theme: a stored preference wins; otherwise default to the
  // premium dark theme so first-time visitors see the brand's signature look.
  (function initTheme() {
    const saved = storedTheme();
    applyTheme(saved === "light" ? "light" : "dark");
  })();

  document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".theme-toggle");
    if (!toggle) return;
    const isLight = root.getAttribute("data-theme") === "light";
    const next = isLight ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (err) {}
  });

  /* ---------- 3. Navbar: scrolled state + mobile menu ---------- */
  const nav = $(".nav");
  const onScrollNav = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  const hamburger = $(".hamburger");
  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Close the menu when a link is tapped (mobile)
    $$(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  /* ---------- 4. Scroll reveal ---------- */
  const revealEls = $$(".reveal");
  if (revealEls.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("in"));
    } else {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* ---------- 5. Animated counters ---------- */
  const counters = $$("[data-count]");
  if (counters.length) {
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      if (prefersReduced) { el.textContent = target.toFixed(decimals) + suffix; return; }
      const dur = 1500;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((c) => cio.observe(c));
    } else {
      counters.forEach(animate);
    }
  }

  /* ---------- 6. Hero particle network ---------- */
  const canvas = $("#hero-canvas");
  if (canvas && canvas.getContext && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, points = [], raf;

    const accent = () => "#0EA5E9";

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(26, Math.min(70, Math.floor((w * h) / 22000)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      // move + draw nodes
      for (const p of points) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56,189,248,0.55)";
        ctx.fill();
      }
      // links
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(14,165,233,${(1 - dist / 130) * 0.22})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }

    size();
    frame();
    let resizeT;
    window.addEventListener("resize", () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(size, 200);
    });
    // Pause when tab hidden (battery friendly)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(frame);
    });
  }

  /* ---------- 7. Back to top ---------- */
  const toTop = $(".to-top");
  if (toTop) {
    const onScrollTop = () => toTop.classList.toggle("show", window.scrollY > 600);
    onScrollTop();
    window.addEventListener("scroll", onScrollTop, { passive: true });
    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
    );
  }

  /* ---------- 8. Footer year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- 9. Contact form validation ---------- */
  const form = $("#contact-form");
  if (form) {
    const fields = {
      name:    { test: (v) => v.trim().length >= 2,      msg: "Please enter your name." },
      company: { test: () => true,                       msg: "" },
      phone:   { test: (v) => /^[+]?[\d\s()-]{7,15}$/.test(v.trim()), msg: "Enter a valid phone number." },
      email:   { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: "Enter a valid email address." },
      service: { test: (v) => v !== "",                  msg: "Please choose a service." },
      message: { test: (v) => v.trim().length >= 10,     msg: "Tell us a little more (10+ characters)." },
    };

    const setFieldState = (input, ok) => {
      const wrap = input.closest(".field");
      if (wrap) wrap.classList.toggle("invalid", !ok);
    };

    // Validate on blur for a responsive feel
    Object.keys(fields).forEach((key) => {
      const input = form.elements[key];
      if (!input) return;
      input.addEventListener("blur", () => {
        if (input.value === "" && key === "company") return;
        setFieldState(input, fields[key].test(input.value));
      });
      input.addEventListener("input", () => {
        const wrap = input.closest(".field");
        if (wrap && wrap.classList.contains("invalid")) {
          setFieldState(input, fields[key].test(input.value));
        }
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      let firstBad = null;
      Object.keys(fields).forEach((key) => {
        const input = form.elements[key];
        if (!input) return;
        const ok = fields[key].test(input.value);
        setFieldState(input, ok);
        if (!ok && !firstBad) firstBad = input;
        if (!ok) valid = false;
      });

      if (!valid) { if (firstBad) firstBad.focus(); return; }

      const success = $("#form-success");
      if (success) {
        success.classList.add("show");
        success.setAttribute("role", "status");
      }
      form.reset();
      // Optional: hand off to WhatsApp with a prefilled message
      const btn = form.querySelector('[type="submit"]');
      if (btn) { btn.textContent = "Message ready ✓"; setTimeout(() => (btn.textContent = "Send message"), 2500); }
    });
  }
})();
