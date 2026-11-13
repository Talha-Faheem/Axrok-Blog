import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { JsonLd } from "@/components/json-ld";
import { siteMetadata } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    default: "Xroack — Understand Threats. Build Stronger Defenses.",
    template: "%s | Xroack Cybersecurity Intelligence",
  },
  description:
    "Credible, technically informed cybersecurity news, threat intelligence, vulnerability research, and practical defense architecture.",
  keywords: [
    "Cybersecurity",
    "Threat Intelligence",
    "Vulnerability Research",
    "CVE Advisories",
    "Malware Analysis",
    "Cloud Security",
    "AppSec",
    "Zero Trust",
  ],
  authors: [{ name: "Xroack Editorial Team" }],
  creator: "Xroack",
  publisher: "Xroack Media",
  metadataBase: new URL("https://xroack-security.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Xroack — Understand Threats. Build Stronger Defenses.",
    description:
      "Credible, technically informed cybersecurity news, threat intelligence, vulnerability analyses, and practical defense guides.",
    url: "https://xroack-security.com",
    siteName: "Xroack",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Xroack Cybersecurity Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xroack — Cybersecurity Publication & Threat Intelligence",
    description: "Understand threats. Build stronger defenses.",
    creator: "@xroack_sec",
    images: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&h=630&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-white text-xrock-black selection:bg-xrock-red selection:text-white">
        <JsonLd />
        <AnnouncementBanner />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
