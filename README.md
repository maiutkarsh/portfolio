# SATH (सहायता) — Company Website

A premium, responsive, dark/light company website for **SATH (सहायता)** — a digital transformation partner for small and medium businesses.

Built with **HTML5 + CSS3 + vanilla JavaScript only**. No frameworks, no build step. Deploys straight to GitHub Pages.

---

## File structure

```
/
├── index.html        # Home (landing page)
├── about.html        # Story, vision, mission, values
├── services.html     # Detailed services + process
├── contact.html      # Contact form, WhatsApp, socials
├── css/
│   └── style.css     # All styles + theme tokens
├── js/
│   └── script.js     # Theme, nav, animations, form validation
├── assets/
│   ├── images/
│   │   ├── founder.jpg     # Founder photo (replace any time)
│   │   └── og-cover.jpg    # Social share preview
│   └── icons/
│       └── favicon.svg
├── robots.txt
└── sitemap.xml
```

## What's included

- Dark mode (default) + light mode toggle, remembered across visits
- Sticky glassmorphism navbar with mobile hamburger menu
- Animated particle-network hero background (pauses when tab is hidden; respects reduced-motion)
- Scroll-reveal animations and animated stat counters
- Six service cards (home) and six detailed service blocks (services page)
- Founder section using your photo
- Contact form with full JavaScript validation, WhatsApp button, email/phone, social icons
- Loading animation, back-to-top button
- SEO: meta tags, Open Graph/Twitter cards, semantic HTML, JSON-LD, sitemap & robots
- Devanagari **सहायता** wordmark and bilingual EN/HI copy throughout

## Customize before going live

1. **Founder photo** — replace `assets/images/founder.jpg` (keep the same name, portrait orientation looks best).
2. **Contact details** — in `contact.html`, edit the WhatsApp number (`wa.me/919876543210`), email (`hello@sath.in`) and phone. Search the file for those placeholders.
3. **Social links** — update the `#` hrefs in the contact page social icons.
4. **Form delivery** — the form validates in-browser but doesn't send anywhere yet. To receive messages, point the form at a service like Formspree/Getform (set an `action`) or your own endpoint.
5. **Domain** — replace `https://example.com/` in the canonical/OG tags, `sitemap.xml` and `robots.txt` with your real URL.
6. **Colours/fonts** — all live as CSS variables at the top of `css/style.css`.

## Deploy to GitHub Pages

1. Create a repo and push these files (with `index.html` at the root).
2. Repo **Settings → Pages → Source: Deploy from a branch**, pick `main` and `/ (root)`, save.
3. Your site goes live at `https://<username>.github.io/<repo>/` in a minute or two.

---

© SATH (सहायता). Helping Businesses Grow in the Digital Age.
