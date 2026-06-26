# Website Audit Tests

Automated unit tests that verify the site implements every point from
**"Amogha Gold Buyers Website Audit"** (16 items).

## Run

```bash
node --test tests/audit.test.mjs
```

No dependencies required (uses Node's built-in `node:test`). Node 18+.

## What it checks (per audit point)

| # | Audit point | Tested how |
|---|-------------|-----------|
| 1 | Core Web Vitals | LCP banner preload, async Font Awesome, preconnect, img width/height (CLS) |
| 2 | Heading structure | exactly one rendered `<h1>` per page |
| 3 | Meta tags | non-empty unique `<title>`, meta description 50–170 chars |
| 4 | Domain Authority & Backlinks | off-page (documented, not code-testable) |
| 5 | Organic Traffic | off-page outcome (documented) |
| 6 | Images | every rendered `<img>` has alt text; no image > 100 KB |
| 7 | Open Graph | og:type/title/description/url/image present |
| 8 | Canonical | self-referencing canonical with correct URL |
| 9 | Content quality | > 500 chars of visible text per page |
| 10 | Indexing | robots meta = index,follow |
| 11 | XML sitemap | sitemap.xml exists and lists all pages |
| 12 | robots.txt | exists and references the sitemap |
| 13 | Internal linking | each page links to all main pages |
| 14 | Schema markup | valid JewelryStore JSON-LD (name, phone) |
| 15 | Google Analytics | GA4 gtag loader + config present |
| 16 | Keyword optimization | title/description contain local + service keywords; keywords meta |

Points 4 & 5 are off-page SEO (link building, traffic growth) and cannot be
verified by code — they are marked as documented in the suite.
