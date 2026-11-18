export const initialSeedData = {
  users: [
    {
      id: "usr-admin-1",
      name: "AXROK Security Officer",
      email: "admin@axrok.com",
      passwordHash: "$2b$10$hk4PuPQY37Zfh6loc2Bg2.ipkiCmpXmWk1a2GzP3VNmHCrcHIELzm", // AxrokAdmin2026!
      role: "admin",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  categories: [
    {
      id: "cat-1",
      name: "Threat Intelligence",
      slug: "threat-intelligence",
      description: "Deep technical breakdowns of active threat vectors, advanced persistent adversaries, and verified telemetry.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      seoTitle: "Threat Intelligence & Adversary Tracking | AXROK",
      seoDescription: "Verified threat intelligence briefings, attack campaign disclosures, and telemetry.",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-2",
      name: "Vulnerability Research",
      slug: "vulnerability-research",
      description: "Root cause analyses, CVSS assessments, zero-day disclosures, and verified mitigation manuals.",
      image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&q=80",
      seoTitle: "Vulnerability Research & Zero-Day Analysis | AXROK",
      seoDescription: "Deep analysis of critical vulnerabilities, CVE breakdowns, and patch verifications.",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-3",
      name: "Malware & Ransomware",
      slug: "malware-ransomware",
      description: "Reverse engineering, campaign attribution, unpacker primitives, and evasion telemetry.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
      seoTitle: "Malware & Ransomware Analysis | AXROK",
      seoDescription: "Technical teardowns of modern ransomware payloads, loaders, and botnets.",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-4",
      name: "Network Security",
      slug: "network-security",
      description: "Perimeter defense, BGP hijacking mitigation, packet inspection, and encrypted protocol security.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      seoTitle: "Network Security & Protocol Telemetry | AXROK",
      seoDescription: "Architecture and traffic forensics for resilient network perimeters.",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-5",
      name: "Web & Application Security",
      slug: "web-app-security",
      description: "Exploit primitives in authentication, SSRF, memory safety, and modern software supply chains.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      seoTitle: "Web & Application Security | AXROK",
      seoDescription: "AppSec vulnerability research, CI/CD security, and offensive tradecraft.",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-6",
      name: "Cloud Security",
      slug: "cloud-security",
      description: "IAM privilege escalation, Kubernetes workload isolation, and cloud infrastructure hardening.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      seoTitle: "Cloud & Infrastructure Security | AXROK",
      seoDescription: "Multi-cloud architecture, posture management, and container security.",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-7",
      name: "AI Security",
      slug: "ai-security",
      description: "Adversarial prompt injection, training data extraction, and LLM agent perimeter controls.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      seoTitle: "AI & Model Security Research | AXROK",
      seoDescription: "Adversarial testing and model alignment security.",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-8",
      name: "Privacy & Data Protection",
      slug: "privacy-data-protection",
      description: "Applied cryptography, zero-knowledge proofs, and regulatory compliance telemetry.",
      image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80",
      seoTitle: "Privacy & Cryptography | AXROK",
      seoDescription: "Cryptographic protocol evaluations and confidentiality engineering.",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  tags: [
    { id: "tag-1", name: "CVE-2024-38077", slug: "cve-2024-38077", description: "Windows RDP Licensing RCE vulnerability" },
    { id: "tag-2", name: "Zero-Day", slug: "zero-day", description: "Previously undisclosed zero-day exploits" },
    { id: "tag-3", name: "Kernel Exploit", slug: "kernel-exploit", description: "Privilege escalation and memory corruption in kernelspace" },
    { id: "tag-4", name: "Cloud Security", slug: "cloud-security", description: "AWS, GCP, Azure infrastructure" },
    { id: "tag-5", name: "AppSec", slug: "appsec", description: "Application security and safe code engineering" },
    { id: "tag-6", name: "Post-Quantum", slug: "post-quantum", description: "Lattice-based cryptography and migration" },
    { id: "tag-7", name: "Ransomware", slug: "ransomware", description: "Extortion actors and payload analysis" },
    { id: "tag-8", name: "Kubernetes", slug: "kubernetes", description: "K8s workload hardening and RBAC" },
    { id: "tag-9", name: "Reverse Engineering", slug: "reverse-engineering", description: "Disassembly and dynamic malware analysis" },
    { id: "tag-10", name: "CI/CD Security", slug: "ci-cd-security", description: "Supply chain and pipeline protection" },
  ],
  authors: [
    {
      id: "auth-1",
      name: "Marcus Vance",
      slug: "marcus-vance",
      biography: "Lead Offensive Security Researcher at AXROK. Former red team lead with 12+ years experience investigating identity boundaries and enterprise attack surfaces.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      designation: "Lead Offensive Security Researcher",
      socialLinks: {
        twitter: "https://twitter.com/axrok_sec",
        github: "https://github.com/axrok",
        linkedin: "https://linkedin.com/in/axrok-security",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "auth-2",
      name: "Dr. Elena Rostova",
      slug: "dr-elena-rostova",
      biography: "Principal Cryptographer & Protocol Analyst. PhD in Applied Mathematics. Specializes in post-quantum lattice primitives and protocol verification.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
      designation: "Principal Cryptographer",
      socialLinks: {
        twitter: "https://twitter.com/axrok_sec",
        github: "https://github.com/axrok",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "auth-3",
      name: "Sarah Lin",
      slug: "sarah-lin",
      biography: "Cloud Infrastructure & Detection Engineer. Author of open-source eBPF observability tools and contributor to container security benchmarks.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
      designation: "Detection Engineering Lead",
      socialLinks: {
        twitter: "https://twitter.com/axrok_sec",
        github: "https://github.com/axrok",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "auth-4",
      name: "David K.",
      slug: "david-k",
      biography: "Kernel Exploitation Specialist. Focuses on hypervisor boundaries, memory safety migrations, and hardware security extensions.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      designation: "Low-Level Research Specialist",
      socialLinks: {
        twitter: "https://twitter.com/axrok_sec",
        github: "https://github.com/axrok",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  posts: [
    {
      id: "post-1",
      title: "Inside the attack surface: the security risks teams overlook",
      slug: "inside-the-attack-surface-the-security-risks-teams-overlook",
      excerpt: "Modern enterprise infrastructure is rarely breached through fortified perimeters. Stale automation credentials, misconfigured identity boundaries, and forgotten staging API gateways create the quiet ingress paths attackers favor most.",
      content: `<h2>The Evolution of Modern Ingress Vectors</h2>
<p>In modern cloud-native enterprises, the traditional perimeter defense model is no longer sufficient. Attack surface management has expanded beyond internet-facing firewalls to encompass federated identity tokens, automation service accounts, and ephemeral build pipelines.</p>

<div class="xrock-callout xrock-callout-danger">
  <strong>Key Finding:</strong> Over 68% of analyzed enterprise compromises initiated not via remote code execution zero-days, but via over-privileged CI/CD execution contexts and orphaned staging subdomains.
</div>

<h3>1. Stale Automation Tokens and Ephemeral Identities</h3>
<p>Service principals and machine-to-machine OAuth credentials frequently lack automated rotation mechanisms. When an automation pipeline executes, it requires high-privilege IAM roles that are rarely decommissioned after project retirement.</p>

<div class="xrock-terminal">
  <pre><code># Inspecting over-privileged IAM bindings in cloud audit logs
$ gcloud asset search-all-iam-policies --scope="organizations/102938475" \
  --query="policy:roles/owner AND policy:serviceAccount" \
  --format="table(policy.bindings.role, resource)"</code></pre>
</div>

<h3>2. Secondary Gateways and Shadow Subdomains</h3>
<p>Staging environments often replicate production databases without applying production-grade WAF rules. Attackers systematically query certificate transparency logs to identify test endpoints that bypass Multi-Factor Authentication requirements.</p>

<h3>3. Defensive Countermeasures</h3>
<p>Organizations must adopt continuous discovery pipelines, enforce short-lived credentials via OpenID Connect (OIDC), and treat infrastructure code with rigorous static taint analysis.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Digital network topology visualization depicting enterprise attack surfaces",
      category: "threat-intelligence",
      tags: ["cloud-security", "zero-day", "appsec"],
      author: "marcus-vance",
      status: "published",
      isFeatured: true,
      isTrending: true,
      readingTime: 7,
      seoTitle: "Inside the Attack Surface: Overlooked Risks | AXROK",
      seoDescription: "Examine how stale credentials, unmonitored staging gateways, and federated identity boundaries expose enterprise networks.",
      canonicalUrl: "https://axrok-security.com/blog/inside-the-attack-surface-the-security-risks-teams-overlook",
      sources: [
        { title: "CISA Known Exploited Vulnerabilities Catalog", url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog" },
        { title: "NIST SP 800-207 Zero Trust Architecture", url: "https://csrc.nist.gov/pubs/sp/800/207/final" },
      ],
      publishedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "post-2",
      title: "Deep-Dive: CVE-2024-38077 Windows RDP Licensing Service RCE",
      slug: "deep-dive-windows-rce-cve-2024-38077",
      excerpt: "Technical breakdown of the unauthenticated Remote Code Execution flaw in Windows Remote Desktop Licensing Service. Includes root cause memory corruption mechanics and defensive firewall mitigation.",
      content: `<h2>Vulnerability Overview</h2>
<p>CVE-2024-38077 (dubbed 'MadLicence') is a critical heap-based buffer overflow in the Windows Remote Desktop Licensing Service (<code>lserver.exe</code>). With a maximum CVSS score of 9.8, an unauthenticated remote adversary can achieve arbitrary SYSTEM-level code execution by sending specially crafted RPC requests over port 135 and dynamic RPC ports.</p>

<div class="xrock-callout xrock-callout-warning">
  <strong>Severity:</strong> CVSS 9.8 Critical | Remote Code Execution | Unauthenticated Network Vector
</div>

<h3>Root Cause Analysis</h3>
<p>The flaw resides in the decoding logic for custom license pack protocol buffers. An integer overflow during packet length calculation results in insufficient heap memory allocation. When the server subsequent deserializes user-controlled data into the undersized buffer, adjacent memory structures are overwritten.</p>

<div class="xrock-terminal">
  <pre><code>// Vulnerable length calculation pseudocode
DWORD packetLength = ReadDWORD(pStream);
DWORD bufferSize = packetLength + HEADER_SIZE; // Integer overflow if packetLength > 0xFFFFFFF0
BYTE* pBuffer = (BYTE*)HeapAlloc(hHeap, 0, bufferSize);
memcpy(pBuffer, pStream->data, packetLength); // Heap overflow</code></pre>
</div>

<h3>Mitigation & Defensive Actions</h3>
<p>Administrators must apply Microsoft's official security update immediately. For systems where updates cannot be immediately applied, restrict access to the Remote Desktop Licensing service by disabling <code>lserver.exe</code> on machines that do not explicitly require terminal licensing roles.</p>

<div class="xrock-terminal">
  <pre><code># PowerShell command to disable the vulnerable service
Stop-Service -Name TermServLicensing -Force
Set-Service -Name TermServLicensing -StartupType Disabled</code></pre>
</div>`,
      featuredImage: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Server memory buffer visualization",
      category: "vulnerability-research",
      tags: ["cve-2024-38077", "zero-day", "kernel-exploit"],
      author: "david-k",
      status: "published",
      isFeatured: false,
      isTrending: true,
      readingTime: 6,
      seoTitle: "CVE-2024-38077 Technical Analysis & Patch Guide | AXROK",
      seoDescription: "Comprehensive vulnerability analysis of Windows Remote Desktop Licensing RCE CVE-2024-38077.",
      publishedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "post-3",
      title: "Hypervisor Escape Mechanisms in Type-1 Virtualization Environments",
      slug: "hypervisor-escape-mechanisms-type-1-virtualization",
      excerpt: "Examining I/O virtualization vulnerabilities, DMA remapping flaws, and how modern ring -1 isolation models mitigate untrusted guest tenant execution.",
      content: `<h2>The Architecture of Virtual Machine Boundary Escapes</h2>
<p>Type-1 hypervisors form the backbone of multi-tenant cloud infrastructure. An escape occurs when an unprivileged payload running inside a guest operating system executes code in the host hypervisor context.</p>

<h3>DMA Remapping and IOMMU Bypass Primitives</h3>
<p>Direct Memory Access (DMA) allows guest virtual machines to communicate directly with physical hardware peripherals. When IOMMU page tables are improperly partitioned, memory read/write requests can target host hypervisor control structures.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Virtual machine hardware circuitry",
      category: "threat-intelligence",
      tags: ["kernel-exploit", "cloud-security"],
      author: "david-k",
      status: "published",
      isFeatured: false,
      isTrending: false,
      readingTime: 9,
      publishedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "post-4",
      title: "Ransomware Operators Pivot to Cloud Storage APIs for Data Exfiltration",
      slug: "ransomware-operators-pivot-to-cloud-storage-apis",
      excerpt: "Telemetry reveals active threat groups abandoning custom C2 drop servers in favor of signed enterprise OneDrive and S3 API calls to bypass DLP controls.",
      content: `<h2>Living off the Cloud: The New Exfiltration Paradigm</h2>
<p>Rather than deploying dedicated Command and Control (C2) domains that trigger threat-intelligence domain reputation blocks, advanced ransomware syndicates now stage data directly into public cloud storage services using legitimate API tokens.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Ransomware encrypted data flow",
      category: "malware-ransomware",
      tags: ["ransomware", "cloud-security"],
      author: "marcus-vance",
      status: "published",
      isFeatured: false,
      isTrending: true,
      readingTime: 6,
      publishedAt: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "post-5",
      title: "Post-Quantum TLS 1.3: Architectural Readiness and Benchmark Tests",
      slug: "practical-guide-post-quantum-tls-1-3-readiness",
      excerpt: "Benchmarking hybrid ML-KEM key exchange latency over congested high-packet loss networks. A step-by-step migration guide for enterprise edge proxies.",
      content: `<h2>Preparing TLS Infrastructure for Quantum Adversaries</h2>
<p>With NIST standardizing ML-KEM (Kyber) and ML-DSA (Dilithium), engineering teams must prepare their public-facing load balancers for the increased handshake sizes associated with post-quantum cryptography.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Quantum computing visual representation",
      category: "privacy-data-protection",
      tags: ["post-quantum", "network-security"],
      author: "dr-elena-rostova",
      status: "published",
      isFeatured: false,
      isTrending: false,
      readingTime: 8,
      publishedAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "post-6",
      title: "Auditing GitHub Actions: CI/CD Pipeline Poisoning Vectors",
      slug: "auditing-github-actions-ci-cd-poisoning-vectors",
      excerpt: "Step-by-step breakdown of pull_request_target exploitation, unpinned third-party actions, and malicious runners accessing deployment secrets.",
      content: `<h2>The Software Supply Chain Vulnerability Surface</h2>
<p>GitHub Actions pipelines are the primary build automation backbone for millions of projects. Misconfigured workflow triggers allow pull requests from untrusted forks to execute arbitrary code within high-privilege runner contexts.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Software pipeline code execution",
      category: "web-app-security",
      tags: ["ci-cd-security", "appsec"],
      author: "sarah-lin",
      status: "published",
      isFeatured: false,
      isTrending: false,
      readingTime: 7,
      publishedAt: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "post-7",
      title: "Building an Air-Gapped Malware Analysis Sandbox with Proxmox & FlareVM",
      slug: "air-gapped-malware-analysis-lab-proxmox-flarevm",
      excerpt: "Step-by-step tutorial on deploying isolated virtual networks, INetSim fake services, and automated snapshot rollbacks for detonating live samples.",
      content: `<h2>Lab Architecture Overview</h2>
<p>A safe malware detonation environment requires complete isolation from the production network while simulating essential internet services (DNS, HTTP, SMTP) to observe payload behavior.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Malware laboratory virtual machines",
      category: "malware-ransomware",
      tags: ["reverse-engineering", "network-security"],
      author: "marcus-vance",
      status: "published",
      isFeatured: false,
      isTrending: false,
      readingTime: 12,
      publishedAt: new Date(Date.now() - 3600000 * 24 * 9).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 24 * 9).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "post-8",
      title: "Linux Kernel Hardening: Essential sysctl and Security Primitives",
      slug: "linux-kernel-hardening-guide-sysctl-security-primitives",
      excerpt: "Production hardening manual: ASLR entropy tuning, eBPF JIT compiler restrictions, ptrace scoping, and dmesg information disclosure prevention.",
      content: `<h2>Hardening the Linux Core</h2>
<p>Default Linux kernel distributions balance convenience with security. In hardened server environments, kernel parameters must be adjusted to eliminate common exploitation primitives.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Linux terminal command interface",
      category: "network-security",
      tags: ["kernel-exploit", "appsec"],
      author: "david-k",
      status: "published",
      isFeatured: false,
      isTrending: false,
      readingTime: 10,
      publishedAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  homepageSettings: {
    heroPostSlug: "inside-the-attack-surface-the-security-risks-teams-overlook",
    featuredPostSlugs: [
      "deep-dive-windows-rce-cve-2024-38077",
      "hypervisor-escape-mechanisms-type-1-virtualization",
      "ransomware-operators-pivot-to-cloud-storage-apis",
    ],
    trendingPostSlugs: [
      "inside-the-attack-surface-the-security-risks-teams-overlook",
      "deep-dive-windows-rce-cve-2024-38077",
      "ransomware-operators-pivot-to-cloud-storage-apis",
      "practical-guide-post-quantum-tls-1-3-readiness",
    ],
    spotlightPostSlug: "deep-dive-windows-rce-cve-2024-38077",
    visibleSections: {
      announcement: true,
      hero: true,
      latestIntelligence: true,
      topics: true,
      practicalGuides: true,
      vulnerabilitySpotlight: true,
      newsletter: true,
    },
    sectionOrder: [
      "announcement",
      "hero",
      "latestIntelligence",
      "topics",
      "practicalGuides",
      "vulnerabilitySpotlight",
      "newsletter",
    ],
    announcement: {
      enabled: true,
      badge: "CRITICAL ADVISORY",
      text: "CVE-2024-38077: Windows Remote Desktop Licensing RCE vulnerability actively analyzed.",
      link: "/vulnerabilities",
    },
  },
  siteSettings: {
    siteName: "AXROK",
    tagline: "Understand threats. Build stronger defenses.",
    logo: "",
    favicon: "/favicon.ico",
    socialLinks: {
      twitter: "https://twitter.com/axrok_sec",
      github: "https://github.com/axrok",
      linkedin: "https://linkedin.com/company/axrok",
      youtube: "",
      rss: "/rss.xml",
    },
    contactEmail: "contact@axrok-security.com",
    footerText: "AXROK. All rights reserved. Built with Next.js, MongoDB & Tailwind CSS.",
    seoDefaults: {
      title: "AXROK — Understand Threats. Build Stronger Defenses.",
      description: "Credible, technically informed cybersecurity news, threat intelligence, vulnerability analyses, and practical defense guides.",
      keywords: ["Cybersecurity", "Threat Intelligence", "Vulnerability Research", "CVE Advisories", "AppSec", "Zero Trust"],
    },
    announcement: {
      enabled: true,
      badge: "CRITICAL ADVISORY",
      message: "CVE-2024-38077: Windows Remote Desktop Licensing RCE vulnerability actively analyzed.",
      linkText: "Technical Analysis →",
      linkUrl: "/vulnerabilities",
    },
  },
  pages: [
    {
      id: "page-about",
      title: "About AXROK",
      slug: "about",
      content: `<h2>Evidence-Led Cybersecurity Intelligence</h2>
<p>AXROK is an independent technical publication and research lab dedicated to demystifying modern attack vectors, advancing defensive engineering, and providing verifiable security intelligence.</p>
<h3>Our Editorial Mission</h3>
<p>We reject fear-driven headlines and generic stock photography. Every article, vulnerability analysis, and architectural guide published on AXROK is authored and peer-reviewed by active practitioners, reverse engineers, and protocol researchers.</p>`,
      seoTitle: "About AXROK — Editorial Mission & Security Team",
      seoDescription: "Learn about AXROK's mission to deliver evidence-led cybersecurity intelligence.",
      status: "published",
    },
    {
      id: "page-contact",
      title: "Contact the Editorial Desk",
      slug: "contact",
      content: `<h2>Secure Communication & Vulnerability Tips</h2>
<p>We welcome vulnerability disclosures, research tips, and editorial inquiries. For sensitive submissions, please utilize our PGP key or reach out to our encrypted mailbox.</p>
<p>Email: <code>tips@axrok-security.com</code></p>`,
      seoTitle: "Contact AXROK — Secure Tips & Submissions",
      seoDescription: "Contact the AXROK security editorial desk.",
      status: "published",
    },
    {
      id: "page-editorial-policy",
      title: "Editorial & Disclosure Policy",
      slug: "editorial-policy",
      content: `<h2>Coordinated Disclosure Principles</h2>
<p>AXROK strictly adheres to standard 90-day coordinated vulnerability disclosure frameworks. We never publish exploitable zero-day proof-of-concepts without vendor notification and mitigation availability.</p>`,
      seoTitle: "AXROK Editorial & Disclosure Standards",
      seoDescription: "Read AXROK's coordinated disclosure and editorial standards.",
      status: "published",
    },
    {
      id: "page-privacy-policy",
      title: "Privacy Policy",
      slug: "privacy-policy",
      content: `<h2>Privacy & Data Telemetry Guarantee</h2>
<p>AXROK does not utilize intrusive third-party behavioral trackers. Newsletter subscriptions are processed securely and never shared with third parties.</p>`,
      seoTitle: "AXROK Privacy Policy",
      seoDescription: "AXROK privacy policy and data governance.",
      status: "published",
    },
    {
      id: "page-terms",
      title: "Terms of Service",
      slug: "terms",
      content: `<h2>Terms of Service & Research Use</h2>
<p>All materials and code snippets published on AXROK are provided for defensive educational and authorization testing purposes only.</p>`,
      seoTitle: "AXROK Terms of Service",
      seoDescription: "AXROK terms of service.",
      status: "published",
    },
  ],
  newsletterSubscribers: [
    {
      id: "sub-1",
      email: "security.analyst@example.com",
      status: "active",
      subscribedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    {
      id: "sub-2",
      email: "ciso.dispatch@enterprise.org",
      status: "active",
      subscribedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ],
  media: [
    {
      id: "med-1",
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
      filename: "network-threat-topology.jpg",
      format: "jpg",
      size: 420000,
      altText: "Digital network topology visualization",
      uploadedAt: new Date().toISOString(),
    },
    {
      id: "med-2",
      url: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80",
      filename: "memory-buffer-overflow.jpg",
      format: "jpg",
      size: 380000,
      altText: "Memory buffer vulnerability telemetry",
      uploadedAt: new Date().toISOString(),
    },
  ],
};
