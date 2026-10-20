# Verdi Pool Villas website

Static website for Verdi Pool Villas: three private pool villas near Robinson Lifestyle, Thalang, Phuket.

Plain HTML and CSS with one small script. No build step and no framework, so it can be hosted on GitHub Pages, Netlify or any static host.

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| Villa Aria, Cadence, Sonata | `villas/aria.html`, `villas/cadence.html`, `villas/sonata.html` |
| Investment and ownership | `invest.html` |
| Construction progress | `progress.html` |
| Contact | `contact.html` |
| Not found | `404.html` |

## Structure

- `assets/css/site.css`: design tokens (unchanged from the Verdi design system, light theme), the four system components (`.vd-btn`, `.vd-title`, `.vd-badge`, `.vd-card`) and the page layouts.
- `assets/js/main.js`: header and mobile menu, currency switch (prices stored in baht), tabs, room carousel, gallery viewer, viewing form confirmation and scroll reveals. Every page still works without it.
- `assets/img/`: brand-palette illustrations standing in for photography, floor plans and the location map.

## Design

Tokens, type and components come from the Verdi design system (Cormorant Garamond and Jost, canvas, taupe, espresso and terracotta, square corners, no shadows). The section order follows the Verdi website plan, which is based on the Villacarte listing. Several patterns are adapted from the OneArc template: the key-facts strip under the hero, the numbered feature list beside a photo, the room-by-room carousel with area and material, the floor-plan tabs with a spec list, the nearby-places list, and the large closing call to action. OneArc's testimonials and company statistics are left out until Verdi has real ones.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Placeholder content to confirm before launch

These are working values so the layout can be reviewed. Each needs confirming or replacing by the Verdi team.

- Villa names (Aria, Cadence, Sonata are working names), bedrooms, built and plot areas, pool sizes, prices and status.
- Room areas on the villa pages and the home-page room carousel.
- The rental programme: the 7% a year for two years comes from the Villacarte listing and is unverified. Who pays it, what it is calculated on and what follows after year two are marked "to be confirmed".
- Payment stages and the reservation deposit amount.
- Construction log entries and dates on `progress.html`.
- Drive times in the location list.
- Contact details: email, phone, WhatsApp and Telegram links are placeholders. Only the Instagram handle is real.
- Developer legal name and licence number for the footer.
- All images are illustrations. Replace files in `assets/img/` with photos and renders (keep the file names, or update the `src` attributes).
- Currency rates in `assets/js/main.js` (`RATES`) are approximate.
- The Russian version is shown as "coming soon" in the language switch.

## Forms

The viewing forms have no backend yet: they confirm in place. They carry `data-netlify="true"`, so on Netlify they will be collected automatically once `action="#"` is removed. On another host, point `action` at a form service such as Formspree.
