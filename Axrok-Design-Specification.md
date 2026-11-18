# Axrok — Cybersecurity Publication Design Specification

**Version:** 1.0  
**Status:** Initial design direction  
**Product:** Axrok cybersecurity information and educational blog  
**Audience:** Cybersecurity learners, developers, IT professionals, security practitioners, and technology-curious readers

---

## 1. Product and brand direction

Axrok is a cybersecurity-focused editorial publication. It should feel like a credible technology newsroom: clear, current, technically informed, and approachable.

### Brand positioning
- **Purpose:** Explain cybersecurity developments and practical security concepts in a useful, understandable way.
- **Personality:** Confident, analytical, modern, direct, trustworthy.
- **Voice:** Evidence-led and educational. Avoid sensationalist fear-based headlines.
- **Suggested tagline:** “Understand threats. Build stronger defenses.”
- **Content promise:** News, explainers, practical guides, vulnerability coverage, and security awareness.

### Visual direction
Use the uploaded CN Media News reference as inspiration for:
- Strong red brand accents.
- High-contrast black and white.
- Large, confident headlines.
- Editorial image-led feature cards.
- Consistent visual identity across desktop and mobile.

Do **not** copy the CN logo, its exact compositions, or its news-brand identity. Axrok should have its own wordmark and graphic language. Use cybersecurity imagery selectively; avoid generic green code rain, excessive neon, and cliché hooded-hacker stock photos.

---

## 2. Color system

The following values are approximate colors sampled from the supplied reference image. They are starting design tokens, not a claim that the original brand's official color values are known.

| Token | Hex | Intended use |
|---|---|---|
| `--Axrok-red` | `#F83838` | Primary brand color, main CTA, active states |
| `--Axrok-red-dark` | `#980000` | Deep red panels, hover/depth accents |
| `--Axrok-crimson` | `#F00038` | Small highlights, tags, secondary accents |
| `--Axrok-black` | `#080808` | Main text, dark footer, dark feature sections |
| `--Axrok-white` | `#FFFFFF` | Main page and card surfaces |
| `--Axrok-gray-100` | `#E8E8E8` | Borders, dividers, subtle surfaces |

### Additional neutral UI colors
These are proposed supporting neutrals for legibility and should not replace the sampled brand palette.

| Token | Hex | Intended use |
|---|---|---|
| `--Axrok-gray-50` | `#F7F7F7` | Page background sections |
| `--Axrok-gray-300` | `#D1D1D1` | Borders |
| `--Axrok-gray-600` | `#666666` | Secondary text |
| `--Axrok-gray-800` | `#262626` | Dark surfaces |
| `--Axrok-gray-950` | `#111111` | Deep dark surfaces |

### Color usage rules
- Keep article reading pages predominantly white.
- Use red for meaningful emphasis, not for every link or decorative element.
- Use black or near-black for primary text.
- Use gray for metadata, timestamps, captions, and secondary information.
- Do not place small white text on bright red unless contrast has been checked. Prefer near-black text on pale red surfaces where necessary.
- Provide visible focus indicators and accessible contrast for interactive controls.
- Do not communicate status through color alone.

### Suggested proportions
- 65–75% white / light neutral surfaces.
- 15–25% black / dark surfaces and typography.
- 5–10% red and crimson accents.

---

## 3. Typography

### Recommended font pairing
Use Google Fonts or self-hosted font files with suitable licenses.

- **Headings:** `Space Grotesk` — bold, technical, distinctive.
- **Body:** `Inter` — highly readable for long-form articles and UI.
- **Code:** `JetBrains Mono` — code snippets, terminal commands, CVE identifiers, and technical labels.

Fallback stacks:
```css
font-family: "Space Grotesk", Arial, sans-serif;
font-family: "Inter", Arial, sans-serif;
font-family: "JetBrains Mono", Consolas, monospace;
```

### Type scale
| Element | Desktop | Mobile | Weight |
|---|---:|---:|---:|
| Hero headline | 56–68px | 38–44px | 700 |
| Page title | 44–52px | 34–40px | 700 |
| Article title | 40–48px | 30–36px | 700 |
| Section heading | 28–32px | 24–28px | 700 |
| Card title | 20–24px | 18–21px | 600–700 |
| Body | 17–18px | 16–17px | 400 |
| Metadata | 12–14px | 12–13px | 500 |

Use a comfortable body line-height of 1.65–1.8. Keep long-form article text around 65–75 characters per line.

---

## 4. Layout and design foundations

- **Maximum content width:** 1200–1280px.
- **Article reading width:** 720–780px.
- **Desktop page gutters:** 32–48px.
- **Mobile page gutters:** 18–22px.
- **Grid:** 12 columns on desktop; 4 columns on mobile.
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64, 80px.
- **Card radius:** 12–16px.
- **Button radius:** 8–10px.
- **Borders:** 1px solid `#E8E8E8`.
- **Shadows:** subtle and used sparingly; avoid heavy floating-card effects.

Use a consistent alignment grid. Avoid overly rounded “app UI” cards; the site should read as a premium editorial publication.

---

## 5. Information architecture

### Primary navigation
1. Home
2. Cybersecurity News
3. Threat Intelligence
4. Tutorials
5. Vulnerabilities
6. Tools & Resources
7. About

Header utilities:
- Search
- Optional newsletter subscription CTA
- Mobile menu

### Content categories
Use these as initial taxonomy. They can be revised as the publishing strategy matures.

- Cybersecurity News
- Threat Intelligence
- Vulnerability Research
- Malware & Ransomware
- Network Security
- Web & Application Security
- Cloud Security
- AI Security
- Privacy & Data Protection
- Tutorials & Labs
- Tools & Resources
- Security Awareness

Do not show every category in the main navigation. Use a compact category menu or topic index.

---

## 6. Homepage structure

Build the homepage in this order.

### 6.1 Announcement strip (optional)
A slim strip for a major security advisory or important publication update. Hide it when there is no genuinely important announcement.

### 6.2 Main header
- Axrok wordmark on the left.
- Primary navigation in the center/right.
- Search icon or accessible search field.
- Red “Subscribe” or “Get updates” button.
- Sticky behavior may be enabled after scrolling, but keep the header compact.

### 6.3 Hero / featured story
A large editorial hero with:
- Category label.
- Strong headline.
- Two-line summary.
- Author and publication date.
- Reading time.
- “Read the story” CTA.
- One strong, relevant image or custom illustration.

Suggested headline example:
**“Inside the attack surface: the security risks teams overlook”**

The hero should be visually dominant without making the homepage feel like a breaking-news ticker.

### 6.4 Latest articles
- Section heading: “Latest intelligence”
- One featured article card.
- Two or three supporting article cards.
- Each card includes category, title, short excerpt, date, reading time, and image.
- Use consistent image ratios (16:9 or 3:2).

### 6.5 Explore topics
A grid of topic links with simple line icons or restrained abstract graphics. Each topic links to its category archive.

### 6.6 Practical guides
A section dedicated to evergreen learning content:
- Beginner-friendly explainers.
- Step-by-step tutorials.
- Defensive checklists.
- Lab walkthroughs.

### 6.7 Threat / vulnerability spotlight
A high-contrast red or near-black feature panel for a carefully verified security advisory. Display severity only when a trustworthy source supports it. Include affected product/version and mitigation link where relevant.

### 6.8 Newsletter
A clean subscription panel:
- Clear value proposition.
- Email input.
- Consent/privacy explanation.
- No pre-checked marketing consent.
- Clear success and error states.

Suggested copy: “Get practical security insights in your inbox. No noise, just useful intelligence.”

### 6.9 Footer
- Axrok wordmark and short description.
- Explore links.
- Categories.
- About / Contact.
- Privacy Policy / Terms.
- Social links, if active.
- Copyright notice.

---

## 7. Article listing and category pages

### Listing page
- Breadcrumbs.
- Category title and concise description.
- Optional featured story.
- Article grid with consistent card components.
- Pagination or “Load more” with crawlable page URLs.
- Optional sidebar on wide screens for popular topics or newsletter.

### Article card anatomy
1. Image with fixed aspect ratio.
2. Category label.
3. Headline (maximum 2–3 lines in cards).
4. Excerpt (maximum 2–3 lines).
5. Author / date / reading time.
6. Entire card should have a clear, keyboard-accessible link target.

Avoid putting all metadata in tiny low-contrast text.

---

## 8. Article detail page

Recommended desktop layout:
- Breadcrumbs at the top.
- Category label.
- H1 headline.
- Short dek / summary.
- Author identity, publication date, updated date, and reading time.
- Featured image.
- Main article column (720–780px).
- Optional right-side table of contents on wide screens.
- Related articles after the content.
- Newsletter CTA near the end.

### Article content components
- H2 and H3 headings with a clear hierarchy.
- Table of contents for longer articles.
- Highlighted key takeaway / summary.
- Code blocks with syntax highlighting and copy button.
- Terminal command blocks.
- Tables for comparisons.
- Warning / note / success callouts.
- Source references and external links.
- “Last reviewed” or “Updated” metadata where appropriate.

### Editorial trust requirements
- Display author names and short author bios.
- Cite primary sources for vulnerabilities, advisories, and incident claims.
- Distinguish confirmed facts from analysis or speculation.
- Show publication and update dates.
- Do not fabricate CVEs, severity scores, exploit status, or affected versions.

---

## 9. Search and discovery

Search should support:
- Article title and body search.
- Category filtering.
- Optional tag filtering.
- Clear empty state.
- Search query reflected in the URL.
- Keyboard access and visible focus state.

Suggested empty-state copy: “No articles found. Try another keyword or explore a topic.”

---

## 10. Responsive behavior

### Desktop (≥1024px)
- Full navigation.
- Multi-column article grids.
- Optional article table of contents.
- Wide hero composition.

### Tablet (768–1023px)
- Compact navigation.
- Two-column article cards where space permits.
- Collapse article sidebar below content when needed.

### Mobile (<768px)
- Logo, menu, and search in a compact header.
- Single-column content.
- Hero image and text stacked.
- Touch targets at least 44×44px.
- No horizontal overflow.
- Article table of contents becomes a collapsible panel.
- Code blocks scroll horizontally without breaking the page.
- Keep text readable; do not shrink body text to fit.

---

## 11. Interaction and component behavior

Create reusable components:
- `SiteHeader`
- `MobileNavigation`
- `SiteFooter`
- `HeroFeature`
- `ArticleCard`
- `FeaturedArticle`
- `CategoryBadge`
- `AuthorMeta`
- `ReadingTime`
- `TopicGrid`
- `NewsletterForm`
- `SearchPanel`
- `TableOfContents`
- `CodeBlock`
- `ArticleCallout`
- `Pagination`
- `Breadcrumbs`

Interaction states:
- Default, hover, focus-visible, active, disabled, loading, success, and error.
- Use subtle transitions (150–220ms).
- Respect `prefers-reduced-motion`.
- All controls must work with keyboard and screen readers.
- Avoid hover-only disclosure or navigation.

---

## 12. Imagery and graphic language

Use:
- Editorial photography related to networks, devices, infrastructure, digital privacy, and security operations.
- Custom diagrams for attack flows, network concepts, and defensive architecture.
- Abstract geometric patterns inspired by packets, grids, nodes, and system diagrams.
- Red overlays or small red graphic accents, not full red filters on every image.

Avoid:
- Unrelated stock photography.
- Repeated hooded hacker imagery.
- Fake terminal screenshots.
- Decorative images that imply a real incident when they are illustrative.
- Unlicensed logos or copied competitor assets.

Every meaningful image needs descriptive alt text. Decorative imagery should use empty alt text.

---

## 13. SEO, accessibility, and performance

### SEO
- One descriptive H1 per page.
- Unique title and meta description.
- Canonical URLs.
- Open Graph and social preview metadata.
- XML sitemap and robots.txt.
- Article structured data (`Article` or `BlogPosting`) where appropriate.
- Breadcrumb structured data where appropriate.
- Descriptive slugs and internal links.
- Category pages should have useful introductory text.
- Avoid thin, automatically generated tag pages.

### Accessibility
- Semantic HTML landmarks.
- Logical heading order.
- Keyboard navigation.
- Visible focus indicators.
- Sufficient color contrast.
- Form labels and helpful validation.
- Captions/transcripts for relevant media.
- Reduced-motion support.
- Do not rely on color alone to communicate severity or status.

### Performance
- Responsive images with modern formats (AVIF/WebP).
- Lazy-load below-the-fold images.
- Prioritize the main hero image.
- Avoid unnecessary animation libraries.
- Minimize third-party scripts.
- Reserve image dimensions to reduce layout shift.
- Aim for strong Core Web Vitals.

---

## 14. Content and editorial standards

Every article should have:
- Clear reader intent.
- Accurate, specific headline.
- Summary / introduction.
- Logical sections.
- Practical examples where relevant.
- Sources and further reading.
- Author and publication date.
- Updated date when substantive changes occur.
- Relevant category and tags.

For security advisories:
- Verify the original vendor or researcher advisory.
- Include affected versions only when confirmed.
- Explain impact in plain language.
- Provide mitigation or remediation steps.
- Explain whether exploitation is confirmed, reported, or merely theoretical.
- Clearly label proof-of-concept material and lab-only demonstrations.

---

## 15. Suggested homepage wireframe

```text
┌─────────────────────────────────────────────────────────────┐
│ OPTIONAL SECURITY ANNOUNCEMENT                               │
├─────────────────────────────────────────────────────────────┤
│ Axrok       News  Intelligence  Tutorials  Vulnerabilities  │
│                                      Search   Subscribe      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FEATURED CATEGORY             FEATURED STORY IMAGE          │
│  Headline                                                   │
│  Short summary                                              │
│  Author · Date · Read time                                  │
│  [ Read the story ]                                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ LATEST INTELLIGENCE                                         │
│ ┌──────────────────┐ ┌──────────────┐ ┌──────────────┐      │
│ │ Featured article │ │ Article card │ │ Article card │      │
│ └──────────────────┘ └──────────────┘ └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│ EXPLORE TOPICS                                              │
│ [Threat Intel] [AppSec] [Cloud] [Malware] [Privacy]         │
├─────────────────────────────────────────────────────────────┤
│ PRACTICAL GUIDES                                             │
│ [Guide card] [Guide card] [Guide card]                      │
├─────────────────────────────────────────────────────────────┤
│ SECURITY SPOTLIGHT / VERIFIED ADVISORY                       │
├─────────────────────────────────────────────────────────────┤
│ NEWSLETTER SIGNUP                                            │
├─────────────────────────────────────────────────────────────┤
│ FOOTER: About · Contact · Topics · Privacy · Social          │
└─────────────────────────────────────────────────────────────┘
```

---

## 16. Implementation guidance for the coding agent

Treat this document as the design source of truth.

1. Build the shared design tokens first.
2. Create reusable layout and editorial components.
3. Implement the homepage before category and article pages.
4. Build mobile layouts alongside desktop, not as a final patch.
5. Use real content-shaped placeholders with realistic headline lengths.
6. Keep article content readable and source references visible.
7. Implement functional navigation, search, pagination, and newsletter states; do not leave decorative controls pretending to work.
8. Keep content data separate from presentation.
9. Add SEO metadata, semantic markup, accessibility, and performance optimizations.
10. Do not invent an existing Axrok logo. Use a clean text wordmark until official brand assets are supplied.

### Acceptance checklist
- [ ] Consistent Axrok red / black / white palette.
- [ ] Space Grotesk, Inter, and JetBrains Mono typography.
- [ ] Responsive homepage, category listing, and article detail page.
- [ ] Reusable article cards and metadata.
- [ ] Search and navigation have functional states.
- [ ] Newsletter form has validation and feedback.
- [ ] Article page includes sources and readable code blocks.
- [ ] Keyboard navigation and visible focus indicators.
- [ ] SEO metadata and structured data.
- [ ] No copied CN Media News branding or unlicensed assets.
- [ ] No horizontal overflow at mobile widths.

---

## 17. Research references

**These references informed the proposed content architecture and editorial direction. They are inspiration, not assets to copy.**

- [XRISKO — Cybersecurity Intelligence](https://xrisko.com/) — threat intelligence and technical article presentation.
- [Cyberox Technologies — Cybersecurity Blog](https://www.cyberoxtech.com/blog.html) — professional educational content and topic clusters.
- [Hackrocks — Blog](https://hackrocks.com/blog/) — practical cybersecurity learning content.
- [100.3 The X](https://www.Axrok.com/) — the current destination reached by `Axrok.com`; this is a radio station, not the proposed cybersecurity publication.

**Domain note:** Confirm the intended Axrok domain before launch. The current `Axrok.com` destination does not appear to be the cybersecurity blog described in this specification.
