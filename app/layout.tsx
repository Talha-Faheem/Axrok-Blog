import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { JsonLd } from "@/components/json-ld";
import { siteMetadata } from "@/lib/data";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Xrock — Understand Threats. Build Stronger Defenses.",
    template: "%s | Xrock Cybersecurity Intelligence",
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
  authors: [{ name: "Xrock Editorial Team" }],
  creator: "Xrock",
  publisher: "Xrock Media",
  metadataBase: new URL("https://xrock-security.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Xrock — Understand Threats. Build Stronger Defenses.",
    description:
      "Credible, technically informed cybersecurity news, threat intelligence, vulnerability analyses, and practical defense guides.",
    url: "https://xrock-security.com",
    siteName: "Xrock",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Xrock Cybersecurity Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xrock — Cybersecurity Publication & Threat Intelligence",
    description: "Understand threats. Build stronger defenses.",
    creator: "@xrock_sec",
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
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
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

