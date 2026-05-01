/**
 * Chicbu Law – Cloudflare Worker
 *
 * Routes handled:
 *   GET /              → Homepage
 *   GET /blog          → Blog index
 *   GET /blog/:slug    → Individual blog post
 *   GET /sitemap.xml   → XML sitemap
 *   GET /robots.txt    → Robots directive
 *   *                  → 404
 *
 * To add a new blog post, add an entry to BLOG_POSTS below and redeploy.
 * No database or KV namespace required — posts are bundled in the worker.
 */

// ─── SITE CONFIGURATION ────────────────────────────────────────────────────
const SITE = {
  name: 'Chicbu Law',
  tagline: 'Strategic Legal Counsel You Can Trust',
  domain: 'chicbulaw.com',           // ← update to the real domain
  phone: '(555) 000-0000',           // ← update
  email: 'contact@chicbulaw.com',    // ← update
  address: {
    street: '123 Main Street, Suite 100',
    city: 'Sacramento',
    state: 'CA',
    zip: '95814',
    full: '123 Main Street, Suite 100, Sacramento, CA 95814',
  },
  attorney: {
    name: 'Attorney Name',           // ← update
    title: 'Founder & Principal Attorney',
    barNumber: 'State Bar No. 000000', // ← update
  },
  practiceAreas: [
    'Business Law',
    'Contract Disputes',
    'Real Estate Law',
    'Employment Law',
    'Estate Planning',
  ],
  socialProof: {
    years: '15+',
    cases: '500+',
    rating: '5.0',
  },
};

// ─── BLOG POSTS ────────────────────────────────────────────────────────────
// Add new posts here. The first post in the array appears as "Featured".
const BLOG_POSTS = [
  {
    slug: 'what-to-do-before-signing-a-business-contract',
    title: 'What to Do Before Signing a Business Contract',
    date: '2026-04-15',
    excerpt:
      'Signing a contract without proper review can expose your business to costly disputes. Here are the five things every business owner should check before putting pen to paper.',
    body: `
      <p>Contracts are the backbone of every business relationship — and the source of most disputes. Before you sign anything, take these five steps.</p>

      <h2>1. Read Every Word (Yes, the Fine Print)</h2>
      <p>It sounds obvious, but many business owners skim contracts and miss critical clauses like auto-renewal terms, limitation of liability caps, or unilateral amendment rights. Read it in full, or have an attorney do so.</p>

      <h2>2. Verify the Other Party's Authority</h2>
      <p>Make sure the person signing on the other side actually has authority to bind their company. Ask for a corporate resolution or check the entity's operating agreement.</p>

      <h2>3. Understand Your Exit Rights</h2>
      <p>What happens if the relationship goes wrong? Look for termination clauses, cure periods, and any penalties for early exit. A one-sided exit clause is a major red flag.</p>

      <h2>4. Clarify Dispute Resolution</h2>
      <p>Does the contract require arbitration? Which state's law governs? Where must disputes be filed? These provisions determine how painful — and expensive — a dispute will be.</p>

      <h2>5. Get an Attorney Review</h2>
      <p>For any contract over $5,000 or any multi-year commitment, a one-hour attorney review can save tens of thousands in litigation costs later. Contact ${SITE.name} before you sign.</p>

      <p><strong>Have a contract you need reviewed?</strong> <a href="mailto:${SITE.email}">Contact us today</a> for a free initial consultation.</p>
    `,
    tags: ['Business Law', 'Contracts'],
  },
  {
    slug: 'understanding-california-security-deposit-rules',
    title: 'Understanding California Security Deposit Rules for Landlords',
    date: '2026-03-28',
    excerpt:
      'California has some of the strictest security deposit laws in the country. Whether you own one rental unit or a portfolio, here is what you need to know to stay compliant.',
    body: `
      <p>Security deposit disputes are one of the most common landlord-tenant conflicts in California. Understanding the rules protects both your investment and your tenants.</p>

      <h2>Maximum Deposit Amounts</h2>
      <p>As of April 2024, California limits security deposits to <strong>one month's rent</strong> for unfurnished units and <strong>two months' rent</strong> for furnished units, regardless of whether the tenant has a pet. (Civil Code § 1950.5)</p>

      <h2>The 21-Day Rule</h2>
      <p>After a tenant vacates, you have 21 calendar days to return the deposit — or provide an itemized written statement of deductions — along with any remaining balance and receipts for work over $125. Missing this deadline can result in a penalty of up to twice the deposit amount.</p>

      <h2>What You Can (and Cannot) Deduct</h2>
      <p>Allowable deductions include unpaid rent, cleaning costs to restore the unit to move-in condition, and repair of damage beyond normal wear and tear. You <em>cannot</em> deduct for normal wear and tear — things like minor scuffs, carpet wear from ordinary use, or faded paint.</p>

      <h2>Small Claims vs. Superior Court</h2>
      <p>Tenants can sue for wrongful withholding of a deposit in small claims court (up to $12,500) or Superior Court for larger amounts. Judges routinely award the full deposit plus the statutory penalty when landlords miss deadlines or make improper deductions.</p>

      <p><strong>Questions about your rental property?</strong> <a href="mailto:${SITE.email}">Reach out to our real estate team</a> for guidance.</p>
    `,
    tags: ['Real Estate Law', 'Landlord-Tenant'],
  },
  {
    slug: 'estate-planning-basics-every-california-adult-should-know',
    title: 'Estate Planning Basics Every California Adult Should Know',
    date: '2026-03-10',
    excerpt:
      'You don't have to be wealthy to need an estate plan. A will, healthcare directive, and durable power of attorney can save your family enormous pain — and money.',
    body: `
      <p>Most people put off estate planning because it feels complicated or morbid. But without basic documents in place, California's probate process can tie up your assets for 12–18 months and cost your family thousands in court fees.</p>

      <h2>The Three Documents Everyone Needs</h2>

      <h3>1. Last Will and Testament</h3>
      <p>A will directs who receives your property after death and names a guardian for minor children. Without one, the state decides — and the result may not match your wishes.</p>

      <h3>2. Durable Power of Attorney</h3>
      <p>This document names someone to manage your finances and legal affairs if you become incapacitated. Without it, your family may need a costly court conservatorship to pay your bills.</p>

      <h3>3. Advance Healthcare Directive</h3>
      <p>Also called a "living will" in other states, this document states your medical wishes and names a healthcare agent to make decisions if you cannot. It avoids agonizing family disagreements during medical crises.</p>

      <h2>Should You Also Have a Trust?</h2>
      <p>If you own real estate or have assets over ~$184,500 (California's probate threshold), a revocable living trust can help your estate bypass probate entirely, saving time and money.</p>

      <p><strong>Ready to get your estate plan in order?</strong> <a href="mailto:${SITE.email}">Schedule a consultation</a> — most estate planning packages are completed in two meetings.</p>
    `,
    tags: ['Estate Planning', 'Wills & Trusts'],
  },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #0f1a2e;
    --navy-mid: #162035;
    --navy-light: #1e2d4a;
    --gold: #c9a84c;
    --gold-light: #e8c97a;
    --cream: #f5f0e8;
    --text: #e2ddd4;
    --text-muted: #9ba8bb;
    --border: rgba(201,168,76,0.2);
    --purple: #8b5cf6;
  }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Georgia', serif;
    background: var(--navy);
    color: var(--text);
    line-height: 1.7;
    min-height: 100vh;
  }
  a { color: var(--gold); text-decoration: none; }
  a:hover { color: var(--gold-light); text-decoration: underline; }

  /* NAV */
  nav {
    background: rgba(15,26,46,0.97);
    border-bottom: 1px solid var(--border);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(8px);
  }
  .nav-brand {
    font-size: 1.4rem;
    font-weight: bold;
    color: var(--gold);
    letter-spacing: 0.04em;
  }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a { color: var(--text); font-size: 0.9rem; font-family: sans-serif; letter-spacing: 0.05em; }
  .nav-links a:hover { color: var(--gold); text-decoration: none; }
  .nav-cta {
    background: var(--gold);
    color: var(--navy) !important;
    padding: 0.5rem 1.2rem;
    border-radius: 4px;
    font-weight: bold;
    font-family: sans-serif;
    font-size: 0.85rem;
  }
  .nav-cta:hover { background: var(--gold-light); text-decoration: none !important; }

  /* HERO */
  .hero {
    background: linear-gradient(135deg, var(--navy) 0%, #0d2144 100%);
    border-bottom: 1px solid var(--border);
    padding: 5rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 60% 50%, rgba(201,168,76,0.06) 0%, transparent 70%);
  }
  .hero-content { position: relative; max-width: 760px; margin: 0 auto; }
  .hero-eyebrow {
    display: inline-block;
    font-family: sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 1.5rem;
    border: 1px solid var(--border);
    padding: 0.35rem 1rem;
    border-radius: 20px;
  }
  .hero h1 {
    font-size: clamp(2rem, 5vw, 3.2rem);
    color: var(--cream);
    line-height: 1.2;
    margin-bottom: 1.2rem;
  }
  .hero p {
    font-size: 1.15rem;
    color: var(--text-muted);
    max-width: 580px;
    margin: 0 auto 2rem;
  }
  .btn-group { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .btn-primary {
    background: var(--gold);
    color: var(--navy);
    padding: 0.8rem 2rem;
    border-radius: 4px;
    font-family: sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    letter-spacing: 0.03em;
    transition: background 0.2s;
  }
  .btn-primary:hover { background: var(--gold-light); text-decoration: none; color: var(--navy); }
  .btn-outline {
    border: 1px solid var(--border);
    color: var(--text);
    padding: 0.8rem 2rem;
    border-radius: 4px;
    font-family: sans-serif;
    font-size: 0.95rem;
  }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); text-decoration: none; }

  /* STATS BAR */
  .stats-bar {
    background: var(--navy-light);
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: center;
    gap: 0;
    flex-wrap: wrap;
  }
  .stat {
    padding: 1.5rem 3rem;
    text-align: center;
    border-right: 1px solid var(--border);
  }
  .stat:last-child { border-right: none; }
  .stat-value { font-size: 1.8rem; font-weight: bold; color: var(--gold); }
  .stat-label { font-family: sans-serif; font-size: 0.8rem; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.2rem; }

  /* SECTIONS */
  section { padding: 4rem 2rem; }
  .container { max-width: 1100px; margin: 0 auto; }
  .section-label {
    font-family: sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 0.75rem;
  }
  .section-title {
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    color: var(--cream);
    margin-bottom: 1rem;
  }
  .section-sub { color: var(--text-muted); font-size: 1rem; max-width: 560px; margin-bottom: 2.5rem; }
  .divider { border: none; border-top: 1px solid var(--border); margin: 0; }

  /* PRACTICE AREAS */
  .practice-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.25rem;
    margin-top: 2rem;
  }
  .practice-card {
    background: var(--navy-light);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.75rem 1.5rem;
    transition: border-color 0.2s, transform 0.2s;
  }
  .practice-card:hover { border-color: var(--gold); transform: translateY(-2px); }
  .practice-icon { font-size: 1.8rem; margin-bottom: 0.75rem; }
  .practice-name { font-size: 1.05rem; font-weight: bold; color: var(--cream); margin-bottom: 0.5rem; }
  .practice-desc { font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; font-family: sans-serif; }

  /* WHY US */
  .why-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
  .why-card { padding: 1.5rem; border-left: 3px solid var(--gold); background: var(--navy-light); border-radius: 0 8px 8px 0; }
  .why-title { font-size: 1rem; font-weight: bold; color: var(--cream); margin-bottom: 0.5rem; font-family: sans-serif; }
  .why-text { font-size: 0.88rem; color: var(--text-muted); font-family: sans-serif; line-height: 1.6; }

  /* ATTORNEY */
  .attorney-section { background: var(--navy-mid); }
  .attorney-inner { display: grid; grid-template-columns: 1fr 2fr; gap: 3rem; align-items: center; max-width: 900px; margin: 0 auto; }
  .attorney-photo {
    width: 100%;
    aspect-ratio: 3/4;
    background: var(--navy-light);
    border: 2px solid var(--border);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
  }
  .attorney-name { font-size: 1.6rem; color: var(--cream); margin-bottom: 0.25rem; }
  .attorney-title { color: var(--gold); font-family: sans-serif; font-size: 0.9rem; letter-spacing: 0.05em; margin-bottom: 1rem; }
  .attorney-bio { color: var(--text-muted); font-size: 0.95rem; line-height: 1.8; margin-bottom: 1.5rem; }
  .bar-badge { display: inline-block; font-family: sans-serif; font-size: 0.8rem; border: 1px solid var(--border); padding: 0.3rem 0.8rem; border-radius: 4px; color: var(--text-muted); }

  /* BLOG */
  .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
  .blog-card {
    background: var(--navy-light);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.2s;
    display: flex;
    flex-direction: column;
  }
  .blog-card:hover { border-color: var(--gold); transform: translateY(-2px); }
  .blog-card-body { padding: 1.5rem; flex: 1; }
  .blog-tag { font-family: sans-serif; font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
  .blog-card-title { font-size: 1.05rem; color: var(--cream); margin-bottom: 0.5rem; line-height: 1.4; }
  .blog-date { font-family: sans-serif; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.75rem; }
  .blog-excerpt { font-size: 0.88rem; color: var(--text-muted); font-family: sans-serif; line-height: 1.6; }
  .blog-card-footer { padding: 1rem 1.5rem; border-top: 1px solid var(--border); }
  .read-more { font-family: sans-serif; font-size: 0.85rem; color: var(--gold); font-weight: bold; }
  .read-more:hover { color: var(--gold-light); }

  /* CONTACT */
  .contact-section { background: linear-gradient(135deg, var(--navy-mid) 0%, #0d2144 100%); border-top: 1px solid var(--border); }
  .contact-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }
  .contact-info h2 { font-size: 1.8rem; color: var(--cream); margin-bottom: 0.75rem; }
  .contact-info p { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; font-family: sans-serif; }
  .contact-detail { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 1rem; font-family: sans-serif; font-size: 0.9rem; }
  .contact-detail-icon { font-size: 1.1rem; margin-top: 0.1rem; flex-shrink: 0; }
  .contact-detail-text { color: var(--text-muted); }
  .contact-detail-text strong { color: var(--cream); display: block; margin-bottom: 0.15rem; }
  .contact-box { background: var(--navy-light); border: 1px solid var(--border); border-radius: 8px; padding: 2rem; }
  .contact-box h3 { font-size: 1.1rem; color: var(--cream); margin-bottom: 0.5rem; }
  .contact-box p { font-family: sans-serif; font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.6; }
  .contact-links { display: flex; flex-direction: column; gap: 0.75rem; }
  .contact-link-btn {
    display: block;
    text-align: center;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    font-family: sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    transition: background 0.2s;
  }
  .contact-link-btn.primary { background: var(--gold); color: var(--navy); }
  .contact-link-btn.primary:hover { background: var(--gold-light); text-decoration: none; color: var(--navy); }
  .contact-link-btn.secondary { border: 1px solid var(--border); color: var(--text); }
  .contact-link-btn.secondary:hover { border-color: var(--gold); color: var(--gold); text-decoration: none; }
  .disclaimer { font-family: sans-serif; font-size: 0.72rem; color: var(--text-muted); margin-top: 1rem; line-height: 1.5; opacity: 0.7; }

  /* FOOTER */
  footer {
    background: #080f1c;
    border-top: 1px solid var(--border);
    padding: 2.5rem 2rem;
    text-align: center;
    font-family: sans-serif;
    font-size: 0.82rem;
    color: var(--text-muted);
  }
  footer a { color: var(--text-muted); }
  footer a:hover { color: var(--gold); }
  .footer-links { display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 1rem; flex-wrap: wrap; }

  /* BLOG POST PAGE */
  .post-hero { background: var(--navy-mid); border-bottom: 1px solid var(--border); padding: 4rem 2rem 3rem; }
  .post-hero-inner { max-width: 760px; margin: 0 auto; }
  .post-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
  .post-tag { font-family: sans-serif; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); border: 1px solid var(--border); padding: 0.2rem 0.6rem; border-radius: 20px; }
  .post-title { font-size: clamp(1.5rem, 4vw, 2.4rem); color: var(--cream); margin-bottom: 0.75rem; line-height: 1.25; }
  .post-meta { font-family: sans-serif; font-size: 0.85rem; color: var(--text-muted); }
  .post-body { max-width: 760px; margin: 3rem auto; padding: 0 2rem; }
  .post-body h2 { font-size: 1.4rem; color: var(--cream); margin: 2rem 0 0.75rem; }
  .post-body h3 { font-size: 1.15rem; color: var(--cream); margin: 1.5rem 0 0.5rem; }
  .post-body p { color: var(--text-muted); font-size: 0.97rem; margin-bottom: 1.25rem; font-family: sans-serif; line-height: 1.8; }
  .post-body strong { color: var(--text); }
  .post-body em { font-style: italic; }
  .post-body a { color: var(--gold); }
  .post-cta { background: var(--navy-light); border: 1px solid var(--border); border-radius: 8px; padding: 1.75rem; margin: 2.5rem 0; }
  .post-cta h3 { color: var(--cream); margin-bottom: 0.5rem; }
  .post-cta p { font-family: sans-serif; font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1rem; }
  .back-link { font-family: sans-serif; font-size: 0.88rem; color: var(--text-muted); display: inline-flex; align-items: center; gap: 0.3rem; }
  .back-link:hover { color: var(--gold); text-decoration: none; }

  /* 404 */
  .not-found { text-align: center; padding: 8rem 2rem; }
  .not-found h1 { font-size: 5rem; color: var(--gold); line-height: 1; }
  .not-found h2 { color: var(--cream); margin: 1rem 0 0.5rem; }
  .not-found p { color: var(--text-muted); font-family: sans-serif; }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .attorney-inner { grid-template-columns: 1fr; }
    .attorney-photo { max-width: 200px; margin: 0 auto; }
    .contact-inner { grid-template-columns: 1fr; }
    .stat { padding: 1.25rem 1.5rem; }
  }
`;

// ─── STRUCTURED DATA ────────────────────────────────────────────────────────
function legalServiceSchema() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: SITE.name,
    url: `https://${SITE.domain}`,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: 'US',
    },
    description: `${SITE.name} provides ${SITE.practiceAreas.join(', ')} legal services in ${SITE.address.city}, ${SITE.address.state}.`,
    priceRange: '$$',
    areaServed: {
      '@type': 'State',
      name: SITE.address.state,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Practice Areas',
      itemListElement: SITE.practiceAreas.map((area) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: area },
      })),
    },
    founder: {
      '@type': 'Person',
      name: SITE.attorney.name,
      jobTitle: SITE.attorney.title,
    },
    sameAs: [],
  });
}

// ─── LAYOUT WRAPPER ─────────────────────────────────────────────────────────
function layout({ title, description, canonicalPath, schemaType = 'home', body }) {
  const canonicalUrl = `https://${SITE.domain}${canonicalPath}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:site_name" content="${SITE.name}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />

  <!-- Structured Data -->
  ${schemaType === 'home' ? `<script type="application/ld+json">${legalServiceSchema()}</script>` : ''}

  <style>${CSS}</style>
</head>
<body>
  <nav>
    <a href="/" class="nav-brand">${SITE.name}</a>
    <ul class="nav-links">
      <li><a href="/#practice-areas">Practice Areas</a></li>
      <li><a href="/#about">About</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/#contact">Contact</a></li>
      <li><a href="tel:${SITE.phone.replace(/\D/g, '')}" class="nav-cta">Call Now</a></li>
    </ul>
  </nav>
  ${body}
  <footer>
    <div class="footer-links">
      <a href="/">Home</a>
      <a href="/#practice-areas">Practice Areas</a>
      <a href="/#about">About</a>
      <a href="/blog">Blog</a>
      <a href="/#contact">Contact</a>
    </div>
    <p>© ${new Date().getFullYear()} ${SITE.name} · ${SITE.address.full}</p>
    <p style="margin-top:0.5rem;">
      Attorney advertising. Prior results do not guarantee a similar outcome.
      ${SITE.attorney.barNumber}.
    </p>
  </footer>
</body>
</html>`;
}

// ─── PAGES ──────────────────────────────────────────────────────────────────
function homePage() {
  const practiceData = [
    { icon: '🏢', name: 'Business Law', desc: 'Entity formation, contracts, partnerships, and business disputes handled with precision.' },
    { icon: '📋', name: 'Contract Disputes', desc: 'Breach of contract, demand letters, negotiation, and litigation when necessary.' },
    { icon: '🏠', name: 'Real Estate Law', desc: 'Purchase agreements, landlord-tenant issues, easements, and title disputes.' },
    { icon: '👥', name: 'Employment Law', desc: 'Wrongful termination, wage claims, non-competes, and workplace discrimination.' },
    { icon: '📜', name: 'Estate Planning', desc: 'Wills, trusts, powers of attorney, and healthcare directives tailored to your family.' },
  ];

  const whyData = [
    { title: 'Direct Attorney Access', text: 'You speak with the attorney who handles your matter — not a paralegal or call center.' },
    { title: 'Transparent Fees', text: 'We quote flat fees whenever possible. No bill shock. You know the cost before work begins.' },
    { title: 'Responsive Communication', text: 'Return calls and emails within one business day, guaranteed.' },
    { title: 'Local Expertise', text: `${SITE.socialProof.years} years of experience navigating ${SITE.address.state} courts and regulations.` },
    { title: 'Practical Advice', text: 'We tell you what you need to hear, not what you want to hear — because that is what protects you.' },
    { title: 'Free Consultation', text: 'Initial 30-minute consultations are free. Understand your options before committing.' },
  ];

  const recentPosts = BLOG_POSTS.slice(0, 3);

  return layout({
    title: `${SITE.name} | ${SITE.tagline}`,
    description: `${SITE.name} provides trusted legal counsel in ${SITE.practiceAreas.join(', ')}. Serving ${SITE.address.city}, ${SITE.address.state}. Free initial consultation. Call ${SITE.phone}.`,
    canonicalPath: '/',
    schemaType: 'home',
    body: `
      <section class="hero">
        <div class="hero-content">
          <span class="hero-eyebrow">Serving ${SITE.address.state} Since ${new Date().getFullYear() - parseInt(SITE.socialProof.years)}</span>
          <h1>${SITE.tagline}</h1>
          <p>Whether you're protecting your business, planning your estate, or resolving a dispute — we bring clarity and strategy to every matter.</p>
          <div class="btn-group">
            <a href="tel:${SITE.phone.replace(/\D/g, '')}" class="btn-primary">📞 Call ${SITE.phone}</a>
            <a href="#contact" class="btn-outline">Free Consultation →</a>
          </div>
        </div>
      </section>

      <div class="stats-bar">
        <div class="stat">
          <div class="stat-value">${SITE.socialProof.years}</div>
          <div class="stat-label">Years Experience</div>
        </div>
        <div class="stat">
          <div class="stat-value">${SITE.socialProof.cases}</div>
          <div class="stat-label">Matters Handled</div>
        </div>
        <div class="stat">
          <div class="stat-value">${SITE.socialProof.rating}★</div>
          <div class="stat-label">Client Rating</div>
        </div>
      </div>

      <section id="practice-areas">
        <div class="container">
          <p class="section-label">What We Do</p>
          <h2 class="section-title">Practice Areas</h2>
          <p class="section-sub">Focused representation across the legal issues that matter most to individuals and businesses in ${SITE.address.state}.</p>
          <div class="practice-grid">
            ${practiceData.map((p) => `
              <div class="practice-card">
                <div class="practice-icon">${p.icon}</div>
                <div class="practice-name">${p.name}</div>
                <div class="practice-desc">${p.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <hr class="divider" />

      <section>
        <div class="container">
          <p class="section-label">Why Choose Us</p>
          <h2 class="section-title">The ${SITE.name} Difference</h2>
          <p class="section-sub">We built this firm around the things clients told us they couldn't find anywhere else.</p>
          <div class="why-grid">
            ${whyData.map((w) => `
              <div class="why-card">
                <div class="why-title">${w.title}</div>
                <div class="why-text">${w.text}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <hr class="divider" />

      <section id="about" class="attorney-section">
        <div class="container">
          <div class="attorney-inner">
            <div class="attorney-photo">⚖️</div>
            <div>
              <p class="section-label">About</p>
              <h2 class="attorney-name">${SITE.attorney.name}</h2>
              <p class="attorney-title">${SITE.attorney.title}</p>
              <p class="attorney-bio">
                With over ${SITE.socialProof.years} of experience in ${SITE.address.state} law,
                ${SITE.attorney.name.split(' ')[0]} founded ${SITE.name} to give individuals and
                businesses the kind of direct, practical legal counsel that larger firms rarely
                provide. Every client gets the attorney's personal attention — not a rotating cast
                of associates.
              </p>
              <p class="attorney-bio">
                Before founding the firm, ${SITE.attorney.name.split(' ')[0]} practiced at
                [prior firm / government position placeholder]. A graduate of [Law School],
                ${SITE.attorney.name.split(' ')[0]} is admitted to the ${SITE.address.state} State Bar
                and all ${SITE.address.state} federal district courts.
              </p>
              <span class="bar-badge">${SITE.attorney.barNumber}</span>
            </div>
          </div>
        </div>
      </section>

      <hr class="divider" />

      <section>
        <div class="container">
          <p class="section-label">Resources</p>
          <h2 class="section-title">From the Blog</h2>
          <p class="section-sub">Plain-English articles on the legal issues affecting ${SITE.address.state} residents and businesses.</p>
          <div class="blog-grid">
            ${recentPosts.map((post) => `
              <article class="blog-card">
                <div class="blog-card-body">
                  <p class="blog-tag">${post.tags[0]}</p>
                  <h3 class="blog-card-title">${post.title}</h3>
                  <p class="blog-date">${formatDate(post.date)}</p>
                  <p class="blog-excerpt">${post.excerpt}</p>
                </div>
                <div class="blog-card-footer">
                  <a href="/blog/${post.slug}" class="read-more">Read Article →</a>
                </div>
              </article>
            `).join('')}
          </div>
          <p style="margin-top:1.5rem; font-family:sans-serif; font-size:0.9rem;">
            <a href="/blog">View all articles →</a>
          </p>
        </div>
      </section>

      <hr class="divider" />

      <section id="contact" class="contact-section">
        <div class="container">
          <div class="contact-inner">
            <div class="contact-info">
              <h2>Get in Touch</h2>
              <p>Ready to discuss your legal matter? The first consultation is free and confidential.</p>
              <div class="contact-detail">
                <span class="contact-detail-icon">📞</span>
                <div class="contact-detail-text">
                  <strong>Phone</strong>
                  <a href="tel:${SITE.phone.replace(/\D/g, '')}">${SITE.phone}</a>
                </div>
              </div>
              <div class="contact-detail">
                <span class="contact-detail-icon">✉️</span>
                <div class="contact-detail-text">
                  <strong>Email</strong>
                  <a href="mailto:${SITE.email}">${SITE.email}</a>
                </div>
              </div>
              <div class="contact-detail">
                <span class="contact-detail-icon">📍</span>
                <div class="contact-detail-text">
                  <strong>Office</strong>
                  ${SITE.address.full}
                </div>
              </div>
              <div class="contact-detail">
                <span class="contact-detail-icon">🕐</span>
                <div class="contact-detail-text">
                  <strong>Hours</strong>
                  Mon–Fri 9am–6pm · Emergency matters after hours
                </div>
              </div>
            </div>
            <div class="contact-box">
              <h3>Free 30-Minute Consultation</h3>
              <p>Tell us about your legal matter and we will let you know how we can help — with no obligation and no charge for the first conversation.</p>
              <div class="contact-links">
                <a href="tel:${SITE.phone.replace(/\D/g, '')}" class="contact-link-btn primary">📞 Call ${SITE.phone}</a>
                <a href="mailto:${SITE.email}?subject=Free%20Consultation%20Request" class="contact-link-btn secondary">✉️ Send an Email</a>
              </div>
              <p class="disclaimer">
                Contacting us does not create an attorney-client relationship. Do not send confidential
                information until an engagement letter has been signed. Attorney advertising.
              </p>
            </div>
          </div>
        </div>
      </section>
    `,
  });
}

function blogIndexPage() {
  return layout({
    title: `Legal Blog | ${SITE.name}`,
    description: `Plain-English legal articles for ${SITE.address.state} residents and businesses, covering ${SITE.practiceAreas.join(', ')}, and more.`,
    canonicalPath: '/blog',
    schemaType: 'blog',
    body: `
      <section class="post-hero">
        <div class="post-hero-inner">
          <a href="/" class="back-link">← Back to Home</a>
          <h1 class="post-title" style="margin-top:1rem;">Legal Blog</h1>
          <p class="post-meta">Plain-English guidance on ${SITE.address.state} law for individuals and businesses.</p>
        </div>
      </section>

      <section>
        <div class="container">
          <div class="blog-grid">
            ${BLOG_POSTS.map((post) => `
              <article class="blog-card">
                <div class="blog-card-body">
                  <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.6rem;">
                    ${post.tags.map((t) => `<span class="post-tag">${t}</span>`).join('')}
                  </div>
                  <h2 class="blog-card-title">${post.title}</h2>
                  <p class="blog-date">${formatDate(post.date)}</p>
                  <p class="blog-excerpt">${post.excerpt}</p>
                </div>
                <div class="blog-card-footer">
                  <a href="/blog/${post.slug}" class="read-more">Read Article →</a>
                </div>
              </article>
            `).join('')}
          </div>
        </div>
      </section>

      <section id="contact" class="contact-section">
        <div class="container" style="text-align:center;">
          <h2 style="color:var(--cream);margin-bottom:0.75rem;">Have a Legal Question?</h2>
          <p style="color:var(--text-muted);font-family:sans-serif;margin-bottom:1.5rem;">These articles provide general information only. For advice on your specific situation, contact us.</p>
          <a href="tel:${SITE.phone.replace(/\D/g, '')}" class="btn-primary">📞 Call ${SITE.phone}</a>
        </div>
      </section>
    `,
  });
}

function blogPostPage(post) {
  const schemaJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    author: { '@type': 'Person', name: SITE.attorney.name },
    publisher: { '@type': 'Organization', name: SITE.name, url: `https://${SITE.domain}` },
    url: `https://${SITE.domain}/blog/${post.slug}`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
  });

  return layout({
    title: `${post.title} | ${SITE.name}`,
    description: post.excerpt,
    canonicalPath: `/blog/${post.slug}`,
    schemaType: 'article',
    body: `
      <script type="application/ld+json">${schemaJson}</script>

      <section class="post-hero">
        <div class="post-hero-inner">
          <a href="/blog" class="back-link">← All Articles</a>
          <div class="post-tags" style="margin-top:1rem;">
            ${post.tags.map((t) => `<span class="post-tag">${t}</span>`).join('')}
          </div>
          <h1 class="post-title">${post.title}</h1>
          <p class="post-meta">By ${SITE.attorney.name} · ${formatDate(post.date)}</p>
        </div>
      </section>

      <div class="post-body">
        <p style="font-size:1.05rem;color:var(--text);font-style:italic;border-left:3px solid var(--gold);padding-left:1rem;margin-bottom:2rem;">${post.excerpt}</p>

        ${post.body}

        <div class="post-cta">
          <h3>Need Help With This?</h3>
          <p>The information above is general in nature. For advice on your specific situation, speak with an attorney. ${SITE.name} offers a free 30-minute initial consultation.</p>
          <div class="btn-group" style="justify-content:flex-start;">
            <a href="tel:${SITE.phone.replace(/\D/g, '')}" class="btn-primary">📞 Call ${SITE.phone}</a>
            <a href="mailto:${SITE.email}?subject=Question%20from%20article" class="btn-outline">Email Us</a>
          </div>
        </div>

        <p style="margin-top:2rem;font-family:sans-serif;font-size:0.78rem;color:var(--text-muted);line-height:1.6;border-top:1px solid var(--border);padding-top:1.5rem;">
          <strong>Disclaimer:</strong> This article is for informational purposes only and does not constitute legal advice.
          Reading this article does not create an attorney-client relationship with ${SITE.name}.
          Laws change and vary by jurisdiction. For advice on your specific situation, consult a licensed attorney.
        </p>
      </div>
    `,
  });
}

function notFoundPage() {
  return layout({
    title: `Page Not Found | ${SITE.name}`,
    description: 'The page you are looking for does not exist.',
    canonicalPath: '/',
    schemaType: 'none',
    body: `
      <section class="not-found">
        <div class="container">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p style="margin:1rem 0 2rem;">The page you're looking for doesn't exist.</p>
          <a href="/" class="btn-primary">← Back to Home</a>
        </div>
      </section>
    `,
  });
}

function sitemapXml() {
  const base = `https://${SITE.domain}`;
  const today = new Date().toISOString().split('T')[0];
  const urls = [
    { loc: base, priority: '1.0', changefreq: 'weekly' },
    { loc: `${base}/blog`, priority: '0.8', changefreq: 'weekly' },
    ...BLOG_POSTS.map((p) => ({
      loc: `${base}/blog/${p.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: p.date,
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

function robotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: https://${SITE.domain}/sitemap.xml
`;
}

// ─── ROUTER ─────────────────────────────────────────────────────────────────
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';

    if (path === '/robots.txt') {
      return new Response(robotsTxt(), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
      });
    }

    if (path === '/sitemap.xml') {
      return new Response(sitemapXml(), {
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
      });
    }

    if (path === '/') {
      return new Response(homePage(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
      });
    }

    if (path === '/blog') {
      return new Response(blogIndexPage(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
      });
    }

    const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)$/);
    if (blogMatch) {
      const post = BLOG_POSTS.find((p) => p.slug === blogMatch[1]);
      if (post) {
        return new Response(blogPostPage(post), {
          headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
        });
      }
    }

    return new Response(notFoundPage(), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};
