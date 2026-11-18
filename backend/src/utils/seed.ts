import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Category } from "../models/Category.js";
import { Tag } from "../models/Tag.js";
import { Author } from "../models/Author.js";
import { Post } from "../models/Post.js";
import { HomepageSettings } from "../models/HomepageSettings.js";
import { SiteSettings } from "../models/SiteSettings.js";
import { Page } from "../models/Page.js";
import { logger } from "./logger.js";

export async function seedDatabase(): Promise<void> {
  const connected = await connectDB();
  if (!connected) {
    logger.warn("Skipping DB seed - MongoDB not connected");
    return;
  }

  try {
    // 1. Admin User
    const existingAdmin = await User.findOne({ email: "admin@axrok.com" });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash("AxrokAdmin2026!", 10);
      await User.create({
        name: "AXROK Security Officer",
        email: "admin@axrok.com",
        passwordHash,
        role: "admin",
        accountStatus: "active",
      });
      logger.info("Admin user created: admin@axrok.com / AxrokAdmin2026!");
    }

    // 2. Initial Categories
    const categoriesCount = await Category.countDocuments();
    if (categoriesCount === 0) {
      await Category.insertMany([
        { name: "Threat Intelligence", slug: "threat-intelligence", description: "Adversary tradecraft, APT operations, campaigns, and telemetry.", order: 1, featured: true },
        { name: "Vulnerability Research", slug: "vulnerability-research", description: "Zero-day disclosures, exploit primitives, root-cause analyses, and CVE teardowns.", order: 2, featured: true },
        { name: "Malware & Ransomware", slug: "malware-ransomware", description: "Binary reverse engineering, C2 protocols, unpackers, and detection rules.", order: 3, featured: true },
        { name: "Network Security", slug: "network-security", description: "Protocol analysis, perimeter defense, segmentation, and zero trust telemetry.", order: 4, featured: true },
        { name: "Web & App Security", slug: "web-app-security", description: "Application architecture, injection primitives, logic bugs, and supply chain threats.", order: 5, featured: true },
        { name: "Cloud Security", slug: "cloud-security", description: "IAM privilege escalation, Kubernetes runtime defense, container breakout analysis.", order: 6, featured: true },
        { name: "AI Security", slug: "ai-security", description: "Prompt injection, weights exfiltration, model evasion, and agent isolation.", order: 7, featured: true },
      ]);
      logger.info("Initial categories seeded.");
    }

    // 3. Initial Tags
    const tagsCount = await Tag.countDocuments();
    if (tagsCount === 0) {
      await Tag.insertMany([
        { name: "Ransomware", slug: "ransomware", description: "Encryption payloads, double extortion, and negotiation telemetry." },
        { name: "Zero-Day", slug: "zero-day", description: "Previously undisclosed vulnerabilities exploited in the wild." },
        { name: "CVE-2024-38077", slug: "cve-2024-38077", description: "Windows Remote Desktop Licensing RCE vulnerability." },
        { name: "Active Directory", slug: "active-directory", description: "Kerberos attacks, domain privilege escalation, and DCSync tradecraft." },
        { name: "Cloud Defense", slug: "cloud-defense", description: "AWS, Azure, and GCP posture management and runtime detection." },
        { name: "Reverse Engineering", slug: "reverse-engineering", description: "Static and dynamic analysis using Ghidra, IDA Pro, and x64dbg." },
      ]);
      logger.info("Initial tags seeded.");
    }

    // 4. Initial Authors
    const authorsCount = await Author.countDocuments();
    if (authorsCount === 0) {
      await Author.insertMany([
        {
          name: "Maya Chen",
          slug: "maya-chen",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
          designation: "Lead Threat Intelligence Analyst",
          biography: "Former incident response lead specializing in state-sponsored adversary tracking and telemetry correlation.",
          socialLinks: { twitter: "https://twitter.com/mayachen_sec", github: "https://github.com/mayachen-sec" },
        },
        {
          name: "Marcus Vance",
          slug: "marcus-vance",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
          designation: "Principal Vulnerability Researcher",
          biography: "Reverse engineer focused on memory corruption, kernel exploit primitives, and hypervisor breakouts.",
          socialLinks: { twitter: "https://twitter.com/marcusvance_sec", github: "https://github.com/marcusvance" },
        },
      ]);
      logger.info("Initial authors seeded.");
    }

    // 5. Initial Posts
    const postsCount = await Post.countDocuments();
    if (postsCount === 0) {
      await Post.create([
        {
          title: "Inside the Attack Surface: The Security Risks Teams Overlook",
          slug: "inside-the-attack-surface-the-security-risks-teams-overlook",
          excerpt: "Security teams have more telemetry than ever. The hardest risks still hide in the gaps between ownership, identity, and infrastructure.",
          content: "<h2>Introduction</h2><p>Modern enterprise infrastructure is rarely breached through fortified perimeters. Stale automation credentials, misconfigured identity boundaries, and forgotten staging API gateways create the quiet ingress paths attackers favor most.</p><h2>The Anatomy of Invisible Exposure</h2><p>Our research team examined telemetry across 140 incident response engagements. The primary point of compromise in over 60% of cases involved non-human identities, service accounts with legacy permissions, or ephemeral cloud nodes that outlived their decommission dates.</p>",
          featuredImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
          category: { name: "Threat Intelligence", slug: "threat-intelligence" },
          author: { name: "Maya Chen", slug: "maya-chen" },
          tags: [{ name: "Zero-Day", slug: "zero-day" }],
          status: "published",
          isFeatured: true,
          isTrending: true,
          readingTime: 9,
          publishedAt: new Date("2026-05-18T10:00:00Z"),
          views: 1250,
        },
        {
          title: "Deep-Dive: CVE-2024-38077 Windows RDP Licensing Service RCE",
          slug: "deep-dive-windows-rce-cve-2024-38077",
          excerpt: "An unauthenticated, integer-overflow heap corruption in Windows Remote Desktop Licensing enables full SYSTEM takeover via crafted RPC packets over dynamic ports.",
          content: "<h2>Vulnerability Summary</h2><p>CVE-2024-38077 represents a critical remote code execution vulnerability impacting the Windows Remote Desktop Licensing service. An unauthenticated attacker can trigger remote heap corruption by sending specifically crafted RPC requests.</p>",
          featuredImage: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80",
          category: { name: "Vulnerability Research", slug: "vulnerability-research" },
          author: { name: "Marcus Vance", slug: "marcus-vance" },
          tags: [{ name: "CVE-2024-38077", slug: "cve-2024-38077" }],
          status: "published",
          isFeatured: true,
          readingTime: 12,
          publishedAt: new Date("2026-05-15T08:00:00Z"),
          views: 3100,
        },
      ]);
      logger.info("Initial posts seeded.");
    }

    // 6. Homepage & Site Settings
    const existingSettings = await HomepageSettings.findOne();
    if (!existingSettings) {
      await HomepageSettings.create({
        heroPostSlug: "inside-the-attack-surface-the-security-risks-teams-overlook",
        spotlightPostSlug: "deep-dive-windows-rce-cve-2024-38077",
      });
    }

    const existingSiteSettings = await SiteSettings.findOne();
    if (!existingSiteSettings) {
      await SiteSettings.create({});
    }

    logger.info("Database seed complete.");
  } catch (err: any) {
    logger.error("Seeding error:", err);
  }
}

if (process.argv[1]?.endsWith("seed.ts")) {
  seedDatabase().then(() => process.exit(0));
}
