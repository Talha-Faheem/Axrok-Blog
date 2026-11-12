import { Article, PracticalGuide, SecurityAdvisory, TopicItem } from "@/types";

export const siteMetadata = {
  title: "Xrock — Understand Threats. Build Stronger Defenses.",
  description:
    "Credible, technically informed cybersecurity news, threat intelligence, vulnerability analyses, practical lab tutorials, and defense architecture.",
  siteUrl: "https://xrock-security.com",
  author: "Xrock Editorial Team",
  twitterHandle: "@xrock_sec",
};

export const heroArticle: Article = {
  id: "hero-1",
  title: "Inside the attack surface: the security risks teams overlook",
  slug: "inside-the-attack-surface-the-security-risks-teams-overlook",
  excerpt:
    "Modern enterprise infrastructure is rarely breached through fortified perimeters. Stale automation credentials, misconfigured identity boundaries, and forgotten staging API gateways create the quiet ingress paths attackers favor most.",
  coverImage:
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
  category: {
    id: "threat-intel",
    title: "Threat Intelligence",
    slug: "threat-intelligence",
    description: "Deep technical breakdowns of active threat vectors, adversaries, and telemetry.",
  },
  author: {
    id: "marcus-vance",
    name: "Marcus Vance",
    role: "Lead Offensive Security Researcher",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  },
  publishedAt: "2026-11-12T14:30:00Z",
  readingTime: "7 min read",
  featured: true,
  tags: ["Attack Surface", "Cloud Security", "Identity Governance"],
};

export const latestArticles: Article[] = [
  {
    id: "art-1",
    title: "Kernel-Level Zero-Day in Virtualization Hypervisors Patched Across Cloud Providers",
    slug: "kernel-zero-day-virtualization-hypervisors-patched",
    excerpt:
      "Analysis of a novel privilege escalation vector affecting hypervisor memory paging, enabling lateral guest-to-host container breakout under specific CPU microarchitectures.",
    coverImage:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    category: {
      id: "vuln-research",
      title: "Vulnerability Research",
      slug: "vulnerability-research",
      description: "Root-cause analyses of CVEs, exploit primitives, and vendor mitigations.",
    },
    author: {
      id: "elena-rostova",
      name: "Dr. Elena Rostova",
      role: "Vulnerability Analyst",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
    },
    publishedAt: "2026-11-11T09:15:00Z",
    readingTime: "5 min read",
    tags: ["Zero-Day", "Hypervisor", "Cloud Infrastructure"],
  },
  {
    id: "art-2",
    title: "Ransomware Cartels Pivot to Silent Cloud Storage API Data Exfiltration",
    slug: "ransomware-cartels-pivot-silent-cloud-storage-exfiltration",
    excerpt:
      "Telemetry indicates groups are abandoning noisy disk encryption in favor of rapid S3-compatible bucket exfiltration, evading traditional endpoint heuristic detection.",
    coverImage:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    category: {
      id: "malware-analysis",
      title: "Malware & Ransomware",
      slug: "malware-ransomware",
      description: "Reverse engineering malware strains, campaign infrastructure, and IoCs.",
    },
    author: {
      id: "david-chen",
      name: "David Chen",
      role: "Senior Incident Responder",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    },
    publishedAt: "2026-11-10T16:45:00Z",
    readingTime: "6 min read",
    tags: ["Ransomware", "Data Exfiltration", "Cloud Forensics"],
  },
  {
    id: "art-3",
    title: "Post-Quantum Cryptography Migration: Practical Deadlines for TLS Reverse Proxies",
    slug: "post-quantum-cryptography-migration-deadlines-tls",
    excerpt:
      "NIST's standardized post-quantum algorithms are live. Here is how network engineering teams should evaluate ML-KEM and hybrid key exchange in production environments.",
    coverImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    category: {
      id: "network-sec",
      title: "Network Security",
      slug: "network-security",
      description: "Protocols, firewalls, zero trust overlays, and cryptographic architectures.",
    },
    author: {
      id: "sarah-jenkins",
      name: "Sarah Jenkins",
      role: "Cryptographic Systems Architect",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
    },
    publishedAt: "2026-11-09T11:20:00Z",
    readingTime: "8 min read",
    tags: ["Cryptography", "PQC", "TLS 1.3"],
  },
  {
    id: "art-4",
    title: "Supply Chain Audit: High-Risk Secrets Exposure in Popular GitHub CI Actions",
    slug: "supply-chain-audit-secrets-exposure-github-ci-actions",
    excerpt:
      "A systematic evaluation of over 3,000 community GitHub actions highlights recurring token permission escalation risks and unpinned commit dependencies.",
    coverImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    category: {
      id: "app-sec",
      title: "Web & Application Security",
      slug: "web-app-security",
      description: "Defending application logic, APIs, CI/CD pipelines, and software supply chains.",
    },
    author: {
      id: "marcus-vance",
      name: "Marcus Vance",
      role: "Lead Offensive Security Researcher",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    },
    publishedAt: "2026-11-08T13:10:00Z",
    readingTime: "4 min read",
    tags: ["DevSecOps", "Supply Chain", "CI/CD"],
  },
];

export const exploreTopics: TopicItem[] = [
  {
    name: "Threat Intelligence",
    slug: "threat-intelligence",
    description: "Adversary tracking, campaign telemetry, and active IoCs.",
    count: 28,
    icon: "ShieldAlert",
  },
  {
    name: "Vulnerability Research",
    slug: "vulnerability-research",
    description: "Deep technical root-causes, fuzzing reports, and CVE dissections.",
    count: 34,
    icon: "Bug",
  },
  {
    name: "Malware & Ransomware",
    slug: "malware-ransomware",
    description: "Payload reversing, evasion mechanisms, and memory injection.",
    count: 19,
    icon: "Skull",
  },
  {
    name: "Network Security",
    slug: "network-security",
    description: "Perimeter segmentation, packet inspection, and WireGuard tunnels.",
    count: 42,
    icon: "Network",
  },
  {
    name: "Web & App Security",
    slug: "web-app-security",
    description: "API authorization, OWASP Top 10, GraphQL, and SSRF mitigations.",
    count: 51,
    icon: "Globe",
  },
  {
    name: "Cloud Security",
    slug: "cloud-security",
    description: "AWS, Azure, and GCP IAM policies, Kubernetes clusters, and eBPF.",
    count: 37,
    icon: "Cloud",
  },
  {
    name: "AI Security",
    slug: "ai-security",
    description: "Prompt injection, LLM jailbreaks, and adversarial ML defenses.",
    count: 23,
    icon: "Cpu",
  },
  {
    name: "Privacy & Encryption",
    slug: "privacy-data-protection",
    description: "Zero-knowledge proofs, homomorphic encryption, and GDPR compliance.",
    count: 18,
    icon: "Lock",
  },
];

export const practicalGuides: PracticalGuide[] = [
  {
    id: "guide-1",
    title: "Building an Air-Gapped Malware Analysis Sandbox with Proxmox & FlareVM",
    slug: "building-air-gapped-malware-analysis-sandbox",
    excerpt:
      "Configure VLAN-isolated dynamic instrumentation networks, automated RAM snapshotting, and INetSim DNS redirection to safely execute unknown binaries.",
    level: "Intermediate",
    category: "Lab Walkthrough",
    stepsCount: 7,
    readingTime: "14 min read",
    iconName: "Terminal",
    updatedAt: "2026-11-10",
  },
  {
    id: "guide-2",
    title: "Hardening Linux Kernel Parameters via sysctl for Public Internet Hosts",
    slug: "hardening-linux-kernel-parameters-sysctl",
    excerpt:
      "A tested, non-breaking configuration guide protecting production Ubuntu and Debian nodes against SYN floods, ICMP redirects, and TCP window spoofing.",
    level: "Beginner",
    category: "Defensive Checklist",
    stepsCount: 8,
    readingTime: "9 min read",
    iconName: "FileCheck",
    updatedAt: "2026-11-06",
  },
  {
    id: "guide-3",
    title: "Dissecting JWT Algorithm Confusion Attacks: From Theory to PoC",
    slug: "jwt-algorithm-confusion-attacks-theory-poc",
    excerpt:
      "Step-by-step breakdown of HMAC-SHA256 vs RSA public key confusion vulnerabilities in signature verification libraries with remediation filters.",
    level: "Advanced",
    category: "Tutorials & Labs",
    stepsCount: 5,
    readingTime: "12 min read",
    iconName: "KeyRound",
    updatedAt: "2026-11-04",
  },
  {
    id: "guide-4",
    title: "Implementing Zero-Trust Workload Identity Federation on Kubernetes",
    slug: "kubernetes-zero-trust-workload-identity-federation",
    excerpt:
      "Eliminate hardcoded cloud credentials using SPIFFE/SPIRE with short-lived STS tokens, cryptographic mTLS pods, and audit logging.",
    level: "Advanced",
    category: "Architecture Guide",
    stepsCount: 9,
    readingTime: "16 min read",
    iconName: "Layers",
    updatedAt: "2026-10-28",
  },
];

export const featuredAdvisory: SecurityAdvisory = {
  id: "adv-2024-38077",
  cveId: "CVE-2024-38077",
  title: "Windows Remote Desktop Licensing Service Remote Code Execution (MadLicense)",
  severity: "Critical",
  cvssScore: 9.8,
  affectedSystems: "Windows Server 2008 through Windows Server 2022 (where RDL Service is enabled)",
  publishedDate: "2026-08-14",
  summary:
    "An unauthenticated, network-adjacent attacker can execute arbitrary remote code with SYSTEM privileges on vulnerable hosts by sending specially crafted RPC packets to the Remote Desktop Licensing service without prior authentication.",
  verifiedMitigation:
    "Apply vendor security updates immediately. If downtime precludes immediate patching, disable the Remote Desktop Licensing (RDL) service if not strictly required, or restrict incoming TCP port 135 and RPC dynamic port range (49152-65535) via perimeter firewall.",
  sourceUrl: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-38077",
  exploitStatus: "Proof of Concept Public",
};

