# Compassion Reception design QA

- Source: https://www.cathedrallifecentre.com/compassion-reception
- Implementation route: `/compassion-reception`
- Desktop comparison viewport: 1363 × 936
- Compared states: hero, event details/gallery, RSVP form, added-guest form, mission video, footer
- Source assets: downloaded and served locally, including the July 2026 exterior, lobby, family imagery, and Garamond Premier Pro faces
- Initial P1: the center gallery image and hero exterior/crop were not the source assets
- Fix: replaced both with the exact source files and repeated the same-viewport source/implementation comparison
- Typography: `Garamondpremrpro Itdisp`, `Garamondpremrpro It`, Georgia, serif for the script display face
- Static verification: lint, TypeScript, and optimized Next.js build passed
- Browser console: no application-origin errors; only the browser extension and Vimeo/Cloudflare iframe emitted third-party diagnostics
- Responsive behavior: source media rules were mapped into the route and covered by the 390 × 844 browser test
- Production interaction checkpoint: add/remove guest controls hydrated and updated their live status; guest groups were given explicit accessible labels

Final result: passed

# Community Ministries design QA

- Source: https://www.cathedrallifecentre.com/community-ministries
- Implementation route: `/community-ministries`
- Desktop comparison viewport: 1363 × 936
- Source assets: exact hero and porch imagery downloaded and served locally
- Source geometry: 496px hero, 731px program section, and 569.28125px contact section covered by browser tests
- Interactions: hero actions, ministry links, navigation entry, and source Webflow contact delivery are active
- Responsive behavior: verified at 390 × 844 with no horizontal overflow
- Static verification: lint, TypeScript, optimized Next.js build, route tests, and automated accessibility checks passed

Final result: pending production comparison
