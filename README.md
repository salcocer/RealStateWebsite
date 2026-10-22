# Verdi Pool Villas website

Static website for Verdi Pool Villas: three private pool villas near Robinson Lifestyle, Thalang, Phuket.

Plain HTML and CSS with one script. No build step and no framework, so it can be hosted on GitHub Pages, Netlify or any static host.

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| Villa Luna, Aria, Medina | `villas/luna.html`, `villas/aria.html`, `villas/medina.html` |
| Investment and ownership | `invest.html` |
| Construction progress | `progress.html` |
| Contact | `contact.html` |
| Not found | `404.html` |

Every page except `404.html` also exists in Russian under `ru/` and in Thai under `th/` (for example `ru/villas/luna.html`). The EN / RU / TH links in the header switch between them.

## Structure

- `assets/css/site.css`: colour and type tokens, components (buttons, chips, stat cards, stacking cards, planner tabs, forms, footer) and page layouts.
- `assets/js/main.js`: all motion and interaction. Every page still reads correctly without it, and motion is switched off for visitors who ask for reduced motion.
- `assets/img/`: brand-palette illustrations standing in for photography, floor plans and the illustrated location map. The `-wide` villa drawings have extra sky so page titles sit over it.
- `i18n/ru.json`, `i18n/th.json`: the Russian and Thai text, keyed by the English text.
- `tools/i18n.py`: builds `ru/` and `th/` from the English pages and the two translation files.

## Languages

The English pages are the source. Do not edit files in `ru/` or `th/` by hand: they are rebuilt from the English pages.

After changing an English page, run:

```sh
python3 tools/i18n.py
```

It rebuilds both languages and lists any text that has no translation yet (that text stays in English until it is added to `i18n/ru.json` and `i18n/th.json`), plus translations that are no longer used. `python3 tools/i18n.py --check` only reports, and exits with an error if anything is missing.

- A sentence with a link or line break in it is translated as one piece, with its HTML, so keep the tags in the translation.
- An empty translation hides that text in that language. Thai uses this to move "m²" from the stat cards into their labels.
- Mark text that must never be translated (names, codes) with `translate="no"`.
- Thai pages load Noto Sans Thai and Noto Serif Thai, because Jost and Cormorant Garamond have no Thai letters. Thai headings get taller line height and no negative letter spacing so tone marks are not clipped (see `:lang(th)` in `site.css`).

## Design (version 2)

Version 2 follows the layout and motion of the OneArc template much more closely, in Verdi's colours and with Verdi's content:

- Full-height hero with the address, a large title, two buttons and four stat cards along the bottom edge.
- "Why choose Verdi" with a card slider over the pool photo, a pill marquee, and giant section titles.
- Villas as sticky cards that stack and recede as you scroll.
- A gallery where one image widens as you scroll or hover, followed by an illustrated map whose pins take turns lighting up.
- Floor-plan tabs, a wide parallax band, investment cards with progress bars, an inquiry block with contact details beside the form, rolling key figures and a buyer questions accordion.
- A dark footer with large contact links, a header that stays in place, and floating "Book A Viewing / WhatsApp / Brochure" buttons.

Headings blur in word by word, numbers count up, and hero images move with a light parallax. Type is Jost (headings at weight 500 with tight tracking) with Cormorant Garamond kept for the wordmark and pull quotes. OneArc's testimonials are replaced with buyer questions until Verdi has real reviews.

Version 1 (the design-system layout with square corners) is on the first pull request.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Content: confirmed facts and placeholders

The villa facts come from the public listings collected in the project's `VERDI.md` and were confirmed by the Verdi team on 22 October 2026:

| Villa | Bedrooms | Bathrooms | Built | Plot | Price |
| --- | --- | --- | --- | --- | --- |
| Luna (Verdi I) | 2 | 2 | 137 m² | 174 m² | ฿9,500,000 |
| Aria (Verdi II) | 2 | 3 | 155 m² | 200 m² | ฿9,900,000 |
| Medina (Verdi III) | 3 | 2 | 218 m² | 325 m² | ฿11,900,000 |

Also confirmed: developer Opera Estate; Si Sunthon, Thalang; freehold ownership, including for foreign buyers; payment plan 30% at contract, 65% during construction, 5% at transfer; rental return 6% a year, shown as a projection and never as a guarantee. Distances (1.6 km to Robinson Lifestyle, 3.9 km to Thalang Hospital, 6.7 km to UWC Thailand, 9 km to Bang Tao, about 20 minutes to the airport) come from the same listings. The site deliberately shows no completion date or build duration.

Still placeholders, to confirm or replace before launch:

- Villa status: all three show "Available".
- Room sizes, pool sizes and furniture package (not published; the pages say "to be confirmed" or "on request").
- The rental programme's management company, fees and owner-use terms ("to be confirmed" on `invest.html`).
- Construction log entries, dates and percentages on `progress.html` and the home page.
- The materials chips on the villa cards (Wood, Natural stone, Wood and stone) are a reading of the listings' "wood and natural stone" finishes, not a per-villa specification.
- Contact details: email, phone, WhatsApp and Telegram links are placeholders. Only the Instagram handle is real. Opening hours and "viewings every day" are working copy.
- Licence number for the footer.
- All images are illustrations. Replace files in `assets/img/` with photos and renders (keep the file names, or update the `src` attributes). The villa drawings are generic and not drawn from the real plans, and the map pins are placed for legibility, not to scale.
- Currency rates in `assets/js/main.js` (`RATES`) are approximate.
- The Russian and Thai translations were written without a native-speaker review. Have both checked before launch, especially the ownership and rental terms on `invest.html`.
- Freehold for foreign buyers is shown as confirmed. Have a Thai lawyer review the wording on `invest.html` and in the buyer questions before launch.
- Once the site has its final domain, add `<link rel="alternate" hreflang="…">` tags with full URLs so search engines pair the three language versions.

## Header links

Each page marks its own header link with `aria-current="page"`, which draws the underline. On the home page the underline follows the section in view instead: every section names the header link it belongs to in `data-nav` (for example `data-nav="index.html#villas"` on the villas, gallery and floor-plan sections), and `main.js` moves the mark as you scroll. A header link to the page already open scrolls to its section instead of reloading the page.

## Forms

The viewing forms have no backend yet: they confirm in place. They carry `data-netlify="true"`, so on Netlify they will be collected automatically once `action="#"` is removed. On another host, point `action` at a form service such as Formspree.
