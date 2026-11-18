# Xroack — Cybersecurity Publication & Threat Intelligence Platform

Xroack is a modern, high-performance cybersecurity editorial newsroom and educational publication built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Sanity CMS**, strictly implemented according to the design specification and token system.

---

## 2. Technology Stack

### 2.1 Frontend Architecture

| Technology | Implementation |
|---|---|
| Framework | Next.js 15 — App Router |
| Programming Language | TypeScript (Strict Mode) |
| Styling | Tailwind CSS |
| Design System | Custom CSS Variables and Design Tokens |
| Typography | Space Grotesk, Inter, JetBrains Mono |
| Icons | Lucide React |
| UI Architecture | Reusable, modular components inspired by shadcn/ui |
| Rendering | Server-Side Rendering, Static Site Generation, Incremental Static Regeneration |
| Image Optimization | Next.js Image Optimization |
| Performance | Server Components, Code Splitting, Caching |

**Architecture Standards:**

- Follow Next.js App Router conventions.
- Use React Server Components by default.
- Implement Client Components only where interactivity is required.
- Maintain strict TypeScript types throughout the application.
- Separate presentation, business logic, and data-access layers.
- Build reusable components with consistent design tokens.
- Optimize loading performance and Core Web Vitals.

### 2.2 Content Management System

**CMS: Sanity**

Sanity serves as the centralized content management infrastructure, allowing editors and administrators to manage articles, authors, categories, and vulnerability advisories.

#### Content Schemas

**Post Schema — `sanity/schema/post.ts`**

- Article title and slug
- SEO title and meta description
- Featured image and image attribution
- Article excerpt and editorial dek
- Rich-text Portable Text content
- Author references
- Category references
- Publication and update timestamps
- Featured and trending status
- Estimated reading time
- Related articles
- Tags and keywords

**Category Schema — `sanity/schema/category.ts`**

Structured cybersecurity categories, including:

1. Threat Intelligence
2. Vulnerability Research
3. Application Security
4. Network Security
5. Cloud Security
6. Malware Analysis
7. AI Security
8. Data Privacy
9. Digital Forensics
10. Security Engineering
11. Cryptography
12. Cybersecurity Fundamentals

**Author Schema — `sanity/schema/author.ts`**

- Author name
- Professional biography
- Profile photograph
- Technical expertise
- Professional credentials
- Social and professional links
- Author verification status

**Advisory Schema — `sanity/schema/advisory.ts`**

- CVE identifier
- Vulnerability title
- Technical description
- CVSS score and severity
- Affected products and versions
- Attack vector
- Exploitation status
- Verified remediation steps
- Official references
- Publication and update dates

### 2.3 Data Access Architecture

Implement a centralized Sanity data-access layer.

**Core files:**

- `lib/sanity.ts` — Sanity client configuration.
- `lib/queries.ts` — Reusable GROQ queries.
- `lib/data.ts` — Content retrieval and fallback data.
- `types/index.ts` — Shared TypeScript interfaces.
- `sanity/schema/` — CMS schema definitions.

The application must support graceful fallback content when Sanity credentials are unavailable during local development.

Production environments should clearly distinguish between actual CMS content and fallback demonstration content.

---

## 3. Backend Functionality and Integrations

### 3.1 Newsletter Subscription

**File:** `app/actions/newsletter.ts`

Implement a secure newsletter subscription workflow using Brevo.

Features:

- Server-side subscription processing.
- Zod-based input validation.
- Email format validation.
- Honeypot-based bot protection.
- Rate limiting.
- Duplicate subscription handling.
- Clear success and error responses.
- Environment-based API configuration.

**Security Requirement:** Do not expose Brevo API keys or other private credentials to client-side code.

For production deployments, use a distributed rate-limiting mechanism instead of relying exclusively on in-memory storage.

### 3.2 Search System

**Component:** `components/search-modal.tsx`

Implement an interactive search experience with:

- Instant article search.
- Search by title and keywords.
- Category-based filtering.
- Keyboard navigation.
- `⌘K` / `Ctrl+K` shortcut support.
- `ESC` to close.
- Responsive modal interface.
- Accessible keyboard interactions.

Search should retrieve published content and avoid exposing unpublished CMS documents.

---

## 4. SEO and Structured Data

AXROK must follow modern technical SEO and structured-data standards.

### Metadata Implementation

Use the Next.js Metadata API for:

- Dynamic page titles.
- Meta descriptions.
- Canonical URLs.
- Open Graph metadata.
- Twitter/X summary cards.
- Social sharing images.
- Robots directives.

### Structured Data

Implement Schema.org JSON-LD through:

`components/json-ld.tsx`

Supported schemas:

- `WebSite`
- `Organization`
- `NewsMediaOrganization`
- `NewsArticle`
- `BreadcrumbList`

Use structured data only where it accurately represents the published content.

### Search Engine Infrastructure

| File | Responsibility |
|---|---|
| `app/sitemap.ts` | Dynamic XML sitemap |
| `app/robots.ts` | Search crawler directives |
| `public/security.txt` | Security disclosure information |
| Metadata API | Page-specific SEO configuration |

Also implement:

- Semantic HTML.
- Descriptive image alt text.
- Internal linking.
- Article breadcrumbs.
- RSS feed.
- Proper indexing controls.
- Consistent canonical URLs.

---

## 5. Homepage Architecture

The homepage must follow the exact editorial sequence below.

### 5.1 Announcement Strip

**Component:** `AnnouncementBanner`

A slim, dismissible announcement bar for important cybersecurity developments.

Features:
- Critical vulnerability announcements.
- Security alerts and editorial updates.
- Direct links to relevant advisories.
- Persistent dismissal state.

### 5.2 Main Navigation Header

**Component:** `SiteHeader`

A premium editorial navigation system featuring:

- AXROK brand wordmark.
- Primary navigation.
- Search trigger.
- Newsletter subscription CTA.
- Responsive mobile navigation drawer.
- Sticky header behavior.

Suggested navigation:

Home | Threat Intelligence | Vulnerabilities | Research | Tutorials | About

### 5.3 Hero Feature

**Component:** `HeroFeature`

A visually prominent editorial section highlighting the most important investigation or cybersecurity story.

Featured editorial headline:

"Inside the Attack Surface: The Security Risks Teams Overlook"

Features:

- Large editorial headline.
- High-quality cybersecurity imagery.
- Short editorial introduction.
- Author attribution.
- Publication date.
- Reading time.
- Prominent article navigation.

### 5.4 Latest Intelligence

**Component:** `LatestIntelligence`

A structured editorial grid featuring recent cybersecurity developments.

Content includes:

- Lead investigative article.
- Supporting threat intelligence reports.
- Vulnerability disclosures.
- Malware research.
- Security industry updates.

Each article card should display its category, headline, excerpt, author, publication date, and reading time.

### 5.5 Explore Topics

**Component:** `TopicGrid`

A visual taxonomy section featuring eight primary cybersecurity categories.

Suggested topics:

- Threat Intelligence
- Application Security
- Cloud Security
- Malware Analysis
- AI Security
- Network Security
- Vulnerability Research
- Digital Forensics

Each topic card should include a distinctive visual treatment, description, and navigation link.

### 5.6 Practical Security Guides

**Component:** `PracticalGuides`

An educational section featuring technical tutorials and practical cybersecurity resources.

Content examples:

- Linux System Hardening.
- Secure Server Configuration.
- OWASP Security Testing.
- Network Traffic Analysis.
- Web Application Security.
- Incident Response Fundamentals.

Display:

- Difficulty level.
- Estimated completion time.
- Relevant technologies.
- Author information.
- Guide description.

### 5.7 Vulnerability Spotlight

**Component:** `VulnerabilitySpotlight`

A visually distinctive vulnerability intelligence panel highlighting a significant security advisory.

Information displayed:

- CVE identifier.
- CVSS score.
- Severity classification.
- Affected products.
- Vulnerability summary.
- Verified mitigation recommendations.
- Official security references.

Use a high-contrast dark visual treatment with clear severity indicators.

All vulnerability information must be verified against authoritative sources such as NVD, CISA, and official vendor security advisories.

### 5.8 Newsletter Subscription

**Component:** `NewsletterSection`

A dedicated newsletter subscription section encouraging visitors to receive cybersecurity updates.

Features:

- Professional editorial presentation.
- Clear subscription value proposition.
- Email input validation.
- Brevo integration.
- Success and error feedback.
- Privacy and unsubscribe information.

### 5.9 Footer

**Component:** `SiteFooter`

A comprehensive editorial footer containing:

- AXROK brand information.
- Editorial mission.
- Navigation links.
- Cybersecurity categories.
- Contact information.
- Privacy policy.
- Terms of service.
- Editorial disclosure.
- Security disclosure.
- Operational status indicator.

---

## 6. Recommended Project Structure

```text
axrok/
├── app/
│   ├── actions/
│   │   └── newsletter.ts
│   ├── about/
│   ├── articles/
│   │   └── [slug]/
│   ├── authors/
│   │   └── [slug]/
│   ├── categories/
│   │   └── [slug]/
│   ├── advisories/
│   │   └── [slug]/
│   ├── guides/
│   ├── search/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   └── globals.css │
├── components/
│   ├── layout/
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   └── announcement-banner.tsx
│   ├── home/
│   │   ├── hero-feature.tsx
│   │   ├── latest-intelligence.tsx
│   │   ├── topic-grid.tsx
│   │   ├── practical-guides.tsx
│   │   ├── vulnerability-spotlight.tsx
│   │   └── newsletter-section.tsx
│   ├── articles/
│   ├── search-modal.tsx
│   ├── json-ld.tsx
│   └── ui/
├── lib/
│   ├── sanity.ts
│   ├── queries.ts
│   ├── data.ts
│   ├── utils.ts
│   └── validations/
├── sanity/
│   └── schema/
│       ├── post.ts
│       ├── category.ts
│       ├── author.ts
│       └── advisory.ts
├── types/
│   └── index.ts
├── public/
│   ├── images/
│   ├── icons/
│   └── security.txt
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 7. Design System and Visual Direction

AXROK must maintain a consistent, professional cybersecurity editorial identity.

### Design Principles

- Premium cybersecurity newsroom aesthetic.
- Minimal, structured editorial layouts.
- Strong typography hierarchy.
- High-quality cybersecurity imagery.
- Consistent spacing and alignment.
- Restrained use of accent colors.
- Clear visual distinction between news, research, and educational content.
- Responsive layouts across desktop, tablet, and mobile.

### Typography

| Font | Usage |
|---|---|
| Space Grotesk | Headlines, section titles, brand typography |
| Inter | Body text, navigation, descriptions |
| JetBrains Mono | CVE identifiers, code, technical labels, metadata |

### Design Tokens

Use the existing AXROK design token system:

`Axrok-design-tokens.css`

All colors, typography, spacing, borders, radii, and shadows should be defined through centralized design tokens rather than scattered hardcoded values.

---

## 8. Security and Production Standards

AXROK is a cybersecurity publication, so its own application security must follow industry best practices.

Required standards:

- Secure environment variable management.
- Server-side secret handling.
- Input validation and sanitization.
- Content Security Policy where compatible.
- Secure HTTP response headers.
- HTTPS enforcement.
- Rate limiting for public-facing endpoints.
- Protection against XSS and injection vulnerabilities.
- Secure CMS access and publishing permissions.
- Dependency vulnerability monitoring.
- Error handling without exposing sensitive implementation details.
- Proper cache invalidation for updated or unpublished articles.

---

## 9. Performance and Quality Requirements

The platform should be optimized for production deployment.

### Performance

- Server Components by default.
- Optimized image delivery.
- Lazy loading below-the-fold media.
- Static generation for suitable editorial pages.
- Incremental Static Regeneration for content updates.
- Efficient Sanity queries.
- Minimal client-side JavaScript.
- Proper font loading.
- Responsive image sizes.

### Quality Assurance

- TypeScript strict-mode compliance.
- ESLint validation.
- Production build verification.
- Responsive design testing.
- Accessibility testing.
- SEO metadata validation.
- Newsletter workflow testing.
- CMS content retrieval testing.
- Broken-link testing.

---

## 10. Local Development Setup

### Prerequisites

- Node.js LTS.
- npm.
- Git.
- Sanity account (optional during initial development).
- Brevo account (required for production newsletter integration).

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project
cd axrok

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open:

`http://localhost:3000`

### Production Build

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

---

## 11. Final Implementation Expectations

The completed AXROK platform must function as a professional cybersecurity publication rather than a static landing-page template.

The implementation must prioritize:

1. A premium, recognizable AXROK brand identity.
2. Fully responsive editorial UI.
3. Functional navigation and article pages.
4. Real Sanity CMS integration.
5. Structured cybersecurity content.
6. Dynamic search functionality.
7. Working newsletter subscriptions.
8. Accurate vulnerability intelligence.
9. Technical SEO and structured data.
10. Production-grade security and performance.

**Important:** Do not replace real functionality with decorative UI elements. All navigation links, search interactions, newsletter workflows, content retrieval, and article routes must work correctly.

Maintain a clean, modular, scalable codebase and preserve the AXROK design token system throughout the implementation.

**Official Project Name: AXROK**

Use AXROK consistently across the website, metadata, components, documentation, CMS references, branding, and deployment configuration. Never use Xroak or Xroack as the project name.
