# Xroack — Cybersecurity Publication & Threat Intelligence Platform

Xroack is a modern, high-performance cybersecurity editorial newsroom and educational publication built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Sanity CMS**, strictly implemented according to the design specification and token system.

---

## 🚀 Tech Stack

### 1. Frontend
- **Framework:** Next.js 15 (App Router) — Server-Side Rendering (SSR), Static Site Generation (SSG), and Edge Caching.
- **Language:** TypeScript — Full strict type safety (`types/index.ts`).
- **Styling:** Tailwind CSS + Custom CSS Variables matching `Axrok-design-tokens.css`.
- **Typography:** Google Fonts (`Space Grotesk` display headlines, `Inter` reading body, `JetBrains Mono` code & CVE tags).
- **Icons:** Lucide React.
- **UI Components:** Reusable modular architecture inspired by shadcn/ui.

### 2. Content Management System (CMS)
- **Sanity Content Lake & Image CDN:** Complete schema definitions in `sanity/schema/`:
  - `post.ts` (Articles, rich Portable Text body, deks, authors, categories)
  - `category.ts` (12 taxonomies: Threat Intelligence, Vulnerability Research, AI Security, etc.)
  - `author.ts` (Verified analysts, credentials, bios, avatars)
  - `advisory.ts` (Structured CVE advisory spotlight, CVSS score, affected systems, verified mitigations)
- **Sanity Client:** `lib/sanity.ts` with graceful fallback data layer (`lib/data.ts`) when API tokens are not configured.

### 3. Backend & Server Actions
- **Next.js Server Actions:**
  - `app/actions/newsletter.ts` — Brevo newsletter subscription with Zod schema validation, honeypot anti-bot protection, and in-memory rate limiting.
- **Edge Search:** Client + server instant modal search dialog (`components/search-modal.tsx`) with category filtering and keyboard navigation (`⌘K` / `ESC`).

### 4. SEO & Structured Data
- **Metadata API:** Dynamic Open Graph, Twitter Summary Cards, and canonical URLs configured in `app/layout.tsx`.
- **Schema.org JSON-LD:** Structured data for `WebSite`, `NewsMediaOrganization`, and `NewsArticle` (`components/json-ld.tsx`).
- **Sitemap & Robots:** Automatic XML sitemap generation (`app/sitemap.ts`) and crawler directives (`app/robots.ts`).

---

## 🏛 Homepage Architecture (Specification Order)

| Section | Component | Description |
|---|---|---|
| **6.1 Announcement Strip** | `AnnouncementBanner` | Slim dismissible banner for critical security advisories (CVE-2024-38077). |
| **6.2 Main Header** | `SiteHeader` | Brand wordmark, primary navigation, instant `⌘K` search trigger, subscribe CTA, and responsive mobile drawer. |
| **6.3 Hero Story** | `HeroFeature` | Visual editorial hero featuring lead investigation: *"Inside the attack surface: the security risks teams overlook"*. |
| **6.4 Latest Intelligence** | `LatestIntelligence` | Grid featuring prominent lead dispatch + supporting telemetry reports with reading time and author credentials. |
| **6.5 Explore Topics** | `TopicGrid` | 8-card taxonomy grid covering Threat Intel, AppSec, Cloud, Malware, AI Security, etc. |
| **6.6 Practical Guides** | `PracticalGuides` | Evergreen lab walkthroughs, sysctl hardening checklists, and offensive theory with difficulty ratings. |
| **6.7 Vulnerability Spotlight** | `VulnerabilitySpotlight` | High-contrast dark panel showcasing verified advisory (CVSS 9.8, affected systems, defensive mitigations). |
| **6.8 Newsletter Panel** | `NewsletterSection` | Clean subscription box with privacy guarantee, Brevo integration, and validation feedback. |
| **6.9 Site Footer** | `SiteFooter` | Editorial disclosures, RFC 9116 security.txt, taxonomy links, and live operational status indicator. |

---

## 🛠 Local Setup & Running

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file (optional for local testing)
cp .env.example .env.local

# 3. Start development server
npm run dev

# 4. Open in browser
# Visit http://localhost:3000
```

