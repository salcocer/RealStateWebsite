# Verdi Pool Villas website

Static website for Verdi Pool Villas: three private pool villas near Robinson Lifestyle, Thalang, Phuket.

Plain HTML and CSS with one script. No build step and no framework, so it can be hosted on GitHub Pages, Netlify or any static host.

## Pages

| Page | File |
| --- | --- |
| Home: everything in one page (villas with their floor plans, gallery, location and map, investment, buyer questions; the footer holds the contact details. The construction progress band and dated updates are commented out for now) | `index.html` |
| Villa Luna, Cadence, Medina | `villas/luna.html`, `villas/aria.html` (Villa Cadence, formerly Aria; the file keeps its old name so existing links still work), `villas/medina.html` |
| Not found | `404.html` |

Every page except `404.html` also exists in Russian under `ru/` and in Thai under `th/` (for example `ru/villas/luna.html`). The EN / RU / TH links in the header switch between them.

## Structure

- `assets/css/site.css`: colour and type tokens, components (buttons, chips, stat cards, stacking cards, floor-plan panels, forms, footer) and page layouts.
- `assets/js/main.js`: all motion and interaction. Every page still reads correctly without it, and motion is switched off for visitors who ask for reduced motion.
- `assets/img/`: photos and renders (`villa_0` to `villa_7`; the home hero cycles through `villa_0.jpeg`, `villa_1.jpg`, `villa_1.webp`, `villa_4.webp` and `villa_5.webp`, a new photo every 4 seconds, and the Villa overview grid shows `villa_4.webp`, `villa_1.webp`, `villa_5.webp`, `villa_7.jpg`, `villa_3.webp` and `villa_2.jpg`. `villa_1.jpg` is a lighter copy of the 8 MB `villa_1.png`, and `villa_7.jpg` is `vila_2.jpeg` with its white frame cropped off), plus brand-palette illustrations still standing in elsewhere, the floor plans and the illustrated location map. The `-wide` villa drawings have extra sky so page titles sit over it.
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

- Full-height hero with the address, a large title and two buttons, followed straight away by "Some numbers about Verdi", whose figures roll up into place.
- "Why choose Verdi" with a card slider over the pool photo, a pill marquee, and giant section titles.
- Villas as sticky cards that stack and recede as you scroll. Each card is two boxes: the villa's name, price, chips, key facts and "Book A Visit / Call Us Now" buttons on the left, and its photo above its floor plan on the right (on phones the photo and plan come first). A card taller than the screen (on phones, and on laptops shorter than about 950 px) sticks by its bottom edge instead, so all of it is seen before the next card covers it; `main.js` measures each card's height for this.
- A Villa overview photo grid (two small photos beside a large one, then the same mirrored; two columns on phones) where each photo opens full size, then a Location section with an illustrated map whose pins take turns lighting up. Then investment cards (rental programme, instalment plan, payback period) and buyer questions; on desktop each of these, like the footer, fills exactly one screen below the header (`section--screen` in `site.css`), and only one answer opens at a time.
- A wide parallax band, an inquiry block with contact details beside the form and a buyer questions accordion.
- A dark footer with large contact links and an embedded Google map (for now pinned on the middle of Phuket at 7.95, 98.34; change the `q=` coordinates in the footer `iframe` to point at the villas), a header that stays in place, and floating "Book A Viewing / WhatsApp / Brochure" buttons.

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
| Cadence (Verdi II, formerly Aria) | 2 | 2 | 180 m² | 240 m² | ฿9,900,000 |
| Medina (Verdi III) | 3 | 2 | 218 m² | 325 m² | ฿11,900,000 |

Villa II was renamed from Aria to Cadence, with 2 bathrooms, 180 m² built and a 240 m² plot, from the developer listing supplied on 22 October 2026 (the listing gives the sizes as "from"). Its price is unchanged.

Also confirmed: developer Opera Estate; Si Sunthon, Thalang; freehold ownership, including for foreign buyers; payment plan 30% at contract, 65% during construction, 5% at transfer; rental return 6% a year, shown as a projection and never as a guarantee. Distances (1.6 km to Robinson Lifestyle, 3.9 km to Thalang Hospital, 6.7 km to UWC Thailand, 9 km to Bang Tao, about 20 minutes to the airport) come from the same listings. The site deliberately shows no completion date or build duration.

Still placeholders, to confirm or replace before launch:

- Payment stages: a developer listing (22 October 2026) splits construction into foundation 15%, structure and pool 20%, roof 15% and tiling / M&E 20%, but with the 30% deposit and 5% handover that adds up to 105%. The site keeps the confirmed 30% / 65% / 5% and lists the stages without percentages.
- Rental income: the same listing offers 7% a year guaranteed for 2 years; the site keeps the confirmed 6% a year projection, not a guarantee.
- Payback period: 10 years, from the same listing, shown as a forecast. At 6% a year alone, payback would take about 17 years.

- Villa status: all three show "Available".
- Room sizes, pool sizes and furniture package (not published; the pages say "to be confirmed" or "on request").
- The rental programme's management company, fees and owner-use terms (not shown on the site yet).
- Construction log entries and dates in the progress section of the home page (commented out for now, together with the Progress links in the header, phone menu and footer and the "Follow the build" sentence on the villa pages; uncomment all of them to bring it back).
- The materials chips on the villa cards (Wood, Natural stone, Wood and stone) are a reading of the listings' "wood and natural stone" finishes, not a per-villa specification.
- Contact details: email, phone, WhatsApp and Telegram links are placeholders. Only the Instagram handle is real. Opening hours and "viewings every day" are working copy.
- Licence number for the footer.
- The home hero slideshow uses photos and renders; all other images are illustrations. Replace files in `assets/img/` with photos and renders (keep the file names, or update the `src` attributes). The villa drawings are generic and not drawn from the real plans, and the map pins are placed for legibility, not to scale.
- The currency buttons (฿ / US$ / € / ₽) are commented out in the header and menu, so every price shows in baht. To bring them back, uncomment them in the English pages, restore the saved-currency lines in `assets/js/main.js` and rerun `tools/i18n.py`. Their rates (`RATES`) are approximate.
- The Russian and Thai translations were written without a native-speaker review. Have both checked before launch, especially the ownership and rental terms.
- Freehold for foreign buyers is shown as confirmed. Have a Thai lawyer review the wording in the investment section and buyer questions on the home page before launch.
- Once the site has its final domain, add `<link rel="alternate" hreflang="…">` tags with full URLs so search engines pair the three language versions.

## Header links

The site is one page. The header links (Home, Villas, Investment, Buyer questions, Contact; Progress is commented out for now) point to sections of `index.html` (`#villas`, `#investment`, `#questions`, `#contact`); from a villa page they lead back to the same sections. Every section of the home page names the header link it belongs to in `data-nav`, and `main.js` moves the underline to that link as you scroll. On a villa page the Villas link stays underlined. Links to a section of the page already open scroll smoothly instead of reloading it. Contact, Schedule A Visit, Book A Viewing and Request Brochure all lead to the footer (`#contact`), which holds the contact details. There is no contact form.
