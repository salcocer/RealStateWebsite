# Verdi Pool Villas website

Static website for Verdi Pool Villas: three private pool villas near Robinson Lifestyle, Thalang, Phuket.

Plain HTML and CSS with one script. No build step and no framework, so it can be hosted on GitHub Pages, Netlify or any static host.

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

- `assets/css/site.css`: colour and type tokens, components (buttons, chips, stat cards, stacking cards, planner tabs, forms, footer) and page layouts.
- `assets/js/main.js`: all motion and interaction. Every page still reads correctly without it, and motion is switched off for visitors who ask for reduced motion.
- `assets/img/`: brand-palette illustrations standing in for photography, floor plans and the illustrated location map. The `-wide` villa drawings have extra sky so page titles sit over it.

## Design (version 2)

Version 2 follows the layout and motion of the OneArc template much more closely, in Verdi's colours and with Verdi's content:

- Full-height hero with the address, a large title, two buttons and four stat cards along the bottom edge.
- "Why choose Verdi" with a card slider over the pool photo, a pill marquee, and giant section titles.
- Villas as sticky cards that stack and recede as you scroll.
- A gallery where one image widens as you scroll or hover, followed by an illustrated map whose pins take turns lighting up.
- Floor-plan tabs, a wide parallax band, investment cards with progress bars, an inquiry block with contact details beside the form, rolling key figures and a buyer questions accordion.
- A dark footer with large contact links, a header that hides on scroll down and returns on scroll up, and floating "Book A Viewing / WhatsApp / Brochure" buttons.

Headings blur in word by word, numbers count up, and hero images move with a light parallax. Type is Jost (headings at weight 500 with tight tracking) with Cormorant Garamond kept for the wordmark and pull quotes. OneArc's testimonials are replaced with buyer questions until Verdi has real reviews.

Version 1 (the design-system layout with square corners) is on the first pull request.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Placeholder content to confirm before launch

These are working values so the layout can be reviewed. Each needs confirming or replacing by the Verdi team.

- Villa names (Aria, Cadence, Sonata are working names), bedrooms, built and plot areas, pool sizes, prices and status.
- Room areas on the villa pages and the home-page gallery.
- The rental programme: the 7% a year for two years comes from the Villacarte listing and is unverified. Who pays it, what it is calculated on and what follows after year two are marked "to be confirmed".
- Payment stages and the reservation deposit amount.
- Construction log entries and dates on `progress.html`.
- Drive times on the map and the figures in "Some numbers about Verdi" (ceiling height, distances).
- Construction percentages in the progress bars.
- Buyer questions and answers.
- Contact details: email, phone, WhatsApp and Telegram links are placeholders. Only the Instagram handle is real.
- Developer legal name and licence number for the footer.
- All images are illustrations. Replace files in `assets/img/` with photos and renders (keep the file names, or update the `src` attributes).
- Currency rates in `assets/js/main.js` (`RATES`) are approximate.
- The Russian version is shown as "coming soon" in the language switch.

## Forms

The viewing forms have no backend yet: they confirm in place. They carry `data-netlify="true"`, so on Netlify they will be collected automatically once `action="#"` is removed. On another host, point `action` at a form service such as Formspree.
