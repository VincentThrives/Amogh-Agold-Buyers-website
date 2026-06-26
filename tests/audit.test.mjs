/**
 * Unit tests for the Amogha Gold Buyers website.
 * Verifies every point from "Amogha Gold Buyers Website Audit".
 * Run with:  node --test tests/
 * Zero external dependencies (uses Node's built-in node:test + node:assert).
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['index.html', 'about.html', 'branch.html', 'contact.html'];
const read = (f) => readFileSync(join(ROOT, f), 'utf8');
const stripComments = (html) => html.replace(/<!--[\s\S]*?-->/g, '');
const htmlOf = Object.fromEntries(PAGES.map((p) => [p, read(p)]));
const liveOf = Object.fromEntries(PAGES.map((p) => [p, stripComments(htmlOf[p])]));

// ---- helpers ----
const tag = (html, re) => (html.match(re) || [null])[0];
const metaContent = (html, name) => {
  const m = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i'))
        || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*name=["']${name}["']`, 'i'));
  return m ? m[1] : null;
};
const ogContent = (html, prop) => {
  const m = html.match(new RegExp(`<meta[^>]+property=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'i'));
  return m ? m[1] : null;
};

// =====================================================================
describe('1. Core Web Vitals (image + resource optimization)', () => {
  test('homepage preloads the LCP hero banner', () => {
    assert.match(htmlOf['index.html'], /<link[^>]+rel=["']preload["'][^>]+as=["']image["'][^>]+banner-1\.jpg/i);
  });
  test('Font Awesome is loaded non-render-blocking (preload+onload swap)', () => {
    for (const p of PAGES) {
      assert.match(htmlOf[p], /rel=["']preload["'][^>]+as=["']style["'][^>]+font-awesome/i,
        `${p} should async-load Font Awesome`);
    }
  });
  test('third-party origins are preconnected', () => {
    for (const p of PAGES) assert.match(htmlOf[p], /rel=["']preconnect["']/i, `${p} missing preconnect`);
  });
  test('content images declare width & height (reduces CLS)', () => {
    // every <img> that loads a local file should have width and height attrs
    const imgs = htmlOf['index.html'].match(/<img[^>]+src=["']images\/[^>]*>/gi) || [];
    for (const img of imgs) {
      assert.match(img, /\bwidth=/, `img missing width: ${img.slice(0, 60)}`);
      assert.match(img, /\bheight=/, `img missing height: ${img.slice(0, 60)}`);
    }
  });
});

describe('2. Heading Structure [H1-H6]', () => {
  for (const p of PAGES) {
    test(`${p} has exactly one rendered <h1>`, () => {
      const count = (liveOf[p].match(/<h1[\s>]/gi) || []).length;
      assert.equal(count, 1, `${p} should have exactly 1 <h1>, found ${count}`);
    });
  }
});

describe('3. Meta Tags (title + description, unique)', () => {
  const titles = new Set();
  for (const p of PAGES) {
    test(`${p} has a non-empty <title>`, () => {
      const t = tag(htmlOf[p], /<title>([^<]+)<\/title>/i);
      assert.ok(t && t.replace(/<\/?title>/g, '').trim().length > 10, `${p} title too short/missing`);
      titles.add(t);
    });
    test(`${p} has a meta description (50-170 chars)`, () => {
      const d = metaContent(htmlOf[p], 'description');
      assert.ok(d, `${p} missing meta description`);
      assert.ok(d.length >= 50 && d.length <= 170, `${p} description length ${d.length} out of range`);
    });
  }
  test('all page titles are unique', () => {
    assert.equal(titles.size, PAGES.length, 'duplicate titles found');
  });
});

describe('4. Domain Authority & Backlinks (off-page)', () => {
  test('documented as off-page (not code-testable)', () => {
    // DA & backlinks are earned via outreach/link-building, not on-page code.
    assert.ok(true, 'off-page SEO — handled outside the codebase');
  });
});

describe('5. Organic Traffic (off-page outcome)', () => {
  test('documented as an outcome metric (not code-testable)', () => {
    assert.ok(true, 'improves as on-page SEO + indexing take effect');
  });
});

describe('6. Images (alt text + <100KB)', () => {
  for (const p of PAGES) {
    test(`${p}: every rendered <img> has non-empty alt text`, () => {
      const imgs = liveOf[p].match(/<img\b[^>]*>/gi) || [];
      for (const img of imgs) {
        const alt = img.match(/\balt=["']([^"']*)["']/i);
        assert.ok(alt && alt[1].trim().length > 0, `missing/empty alt: ${img.slice(0, 70)}`);
      }
    });
  }
  test('no image in images/ exceeds 100KB', () => {
    const dir = join(ROOT, 'images');
    const big = readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .map((f) => ({ f, kb: statSync(join(dir, f)).size / 1024 }))
      .filter((x) => x.kb > 100);
    assert.equal(big.length, 0, 'oversized: ' + big.map((x) => `${x.f} ${x.kb.toFixed(0)}KB`).join(', '));
  });
});

describe('7. Open Graph Tags', () => {
  for (const p of PAGES) {
    for (const prop of ['og:type', 'og:title', 'og:description', 'og:url', 'og:image']) {
      test(`${p} has ${prop}`, () => {
        assert.ok(ogContent(htmlOf[p], prop), `${p} missing ${prop}`);
      });
    }
  }
});

describe('8. Canonical Tag', () => {
  const expected = {
    'index.html': 'https://www.amoghagoldbuyers.com/',
    'about.html': 'https://www.amoghagoldbuyers.com/about.html',
    'branch.html': 'https://www.amoghagoldbuyers.com/branch.html',
    'contact.html': 'https://www.amoghagoldbuyers.com/contact.html',
  };
  for (const p of PAGES) {
    test(`${p} has correct self-referencing canonical`, () => {
      const m = htmlOf[p].match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
      assert.ok(m, `${p} missing canonical`);
      assert.equal(m[1], expected[p]);
    });
  }
});

describe('9. Content Quality (non-thin pages)', () => {
  for (const p of PAGES) {
    test(`${p} has substantive text content (>500 visible chars)`, () => {
      const text = liveOf[p]
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      assert.ok(text.length > 500, `${p} thin content: ${text.length} chars`);
    });
  }
});

describe('10. Indexing (robots meta = index,follow + enablers)', () => {
  for (const p of PAGES) {
    test(`${p} is indexable (robots meta allows index,follow)`, () => {
      const r = metaContent(htmlOf[p], 'robots');
      assert.ok(r && /index/i.test(r) && /follow/i.test(r), `${p} robots meta wrong: ${r}`);
    });
  }
});

describe('11. XML Sitemap', () => {
  test('sitemap.xml exists and lists all pages', () => {
    assert.ok(existsSync(join(ROOT, 'sitemap.xml')), 'sitemap.xml missing');
    const xml = read('sitemap.xml');
    assert.match(xml, /<urlset/i, 'not a valid urlset');
    assert.match(xml, /amoghagoldbuyers\.com\/<\/loc>/, 'home URL missing');
    for (const p of ['about', 'branch', 'contact']) {
      assert.match(xml, new RegExp(`${p}\\.html</loc>`), `${p} missing from sitemap`);
    }
  });
});

describe('12. Robots.txt', () => {
  test('robots.txt exists and references the sitemap', () => {
    assert.ok(existsSync(join(ROOT, 'robots.txt')), 'robots.txt missing');
    const txt = read('robots.txt');
    assert.match(txt, /User-agent:/i);
    assert.match(txt, /Sitemap:\s*https?:\/\/[^\s]+sitemap\.xml/i, 'sitemap not referenced');
  });
});

describe('13. Internal Linking / Anchor Text', () => {
  for (const p of PAGES) {
    test(`${p} links to all main pages with descriptive anchors`, () => {
      for (const target of ['index.html', 'about.html', 'branch.html', 'contact.html']) {
        assert.match(htmlOf[p], new RegExp(`href=["']${target}["']`), `${p} missing link to ${target}`);
      }
    });
  }
});

describe('14. Schema Markup (JSON-LD)', () => {
  for (const p of PAGES) {
    test(`${p} has valid JewelryStore JSON-LD`, () => {
      const m = htmlOf[p].match(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
      assert.ok(m, `${p} missing JSON-LD`);
      const data = JSON.parse(m[1]); // throws if invalid
      const json = JSON.stringify(data);
      assert.match(json, /JewelryStore/, `${p} JSON-LD missing JewelryStore type`);
      assert.match(json, /Amogha Gold Company/, `${p} JSON-LD missing business name`);
      assert.match(json, /\+91-88844-43545/, `${p} JSON-LD missing telephone`);
    });
  }
});

describe('15. Google Analytics (GA4)', () => {
  for (const p of PAGES) {
    test(`${p} includes the GA4 gtag snippet`, () => {
      assert.match(htmlOf[p], /googletagmanager\.com\/gtag\/js\?id=G-/i, `${p} missing GA4 loader`);
      assert.match(htmlOf[p], /gtag\(['"]config['"],\s*['"]G-/i, `${p} missing gtag config`);
    });
  }
});

describe('16. Keyword Optimization (local + service keywords)', () => {
  for (const p of PAGES) {
    test(`${p} title/description target local & service keywords`, () => {
      const blob = (tag(htmlOf[p], /<title>[^<]+<\/title>/i) + ' ' + (metaContent(htmlOf[p], 'description') || '')).toLowerCase();
      assert.match(blob, /bengaluru/, `${p} missing local keyword "Bengaluru"`);
      assert.match(blob, /gold/, `${p} missing "gold"`);
    });
    test(`${p} declares a keywords meta tag`, () => {
      assert.ok(metaContent(htmlOf[p], 'keywords'), `${p} missing meta keywords`);
    });
  }
});
