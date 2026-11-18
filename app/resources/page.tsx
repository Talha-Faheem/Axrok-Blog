import { Metadata } from "next";
import Link from "next/link";
import { Wrench, Shield, Terminal, BookOpen, ExternalLink, Download, Search, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Cybersecurity Resources, Tools & Defense Frameworks | AXROK",
  description:
    "Curated collection of industry-standard security analysis tools, research frameworks, cheat sheets, and practical defensive telemetry resources.",
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "Cybersecurity Resources & Defensive Tools | AXROK",
    description: "Curated security tooling, frameworks, cheat sheets, and technical telemetry references.",
    url: "https://axrok-security.com/resources",
    siteName: "AXROK",
    type: "website",
  },
};

const resourceCategories = [
  { id: "all", label: "All Resources" },
  { id: "offensive", label: "Offensive Security & PenTest" },
  { id: "defensive", label: "SOC & Threat Hunting" },
  { id: "reverse-engineering", label: "Malware & Reverse Eng" },
  { id: "cloud", label: "Cloud & DevSecOps" },
  { id: "frameworks", label: "Standards & Frameworks" },
];

const curatedTools = [
  {
    name: "Nuclei Vulnerability Scanner",
    category: "offensive",
    categoryLabel: "Offensive Security",
    description: "Fast and customizable vulnerability scanner based on simple YAML-based DSL templates.",
    url: "https://github.com/projectdiscovery/nuclei",
    badge: "Open Source",
    stars: "18k+",
    tags: ["DAST", "Vulnerability Research", "Automation"],
  },
  {
    name: "BloodHound Active Directory Visualizer",
    category: "offensive",
    categoryLabel: "Offensive Security",
    description: "Graph theory-based attack path management tool for Active Directory and Azure AD environments.",
    url: "https://github.com/BloodHoundAD/BloodHound",
    badge: "Core Tool",
    stars: "9.2k+",
    tags: ["Active Directory", "Identity", "Attack Paths"],
  },
  {
    name: "Ghidra Reverse Engineering Suite",
    category: "reverse-engineering",
    categoryLabel: "Malware & Reverse Eng",
    description: "NSA-developed software reverse engineering framework providing decompiler, disassembler, and scripting.",
    url: "https://ghidra-sre.org",
    badge: "Industry Standard",
    stars: "50k+",
    tags: ["Decompiler", "Binary Analysis", "Malware"],
  },
  {
    name: "Sigma Generic Detection Signatures",
    category: "defensive",
    categoryLabel: "SOC & Threat Hunting",
    description: "Generic and open signature format for describing relevant log events and hunting rules across SIEM platforms.",
    url: "https://github.com/SigmaHQ/sigma",
    badge: "Hunting Standard",
    stars: "8k+",
    tags: ["SIEM", "Detection Engineering", "Rules"],
  },
  {
    name: "MITRE ATT&CK Matrix",
    category: "frameworks",
    categoryLabel: "Standards & Frameworks",
    description: "Globally-accessible knowledge base of adversary tactics, techniques, and procedures based on real-world observations.",
    url: "https://attack.mitre.org",
    badge: "Framework",
    stars: "Global Ref",
    tags: ["TTPs", "Adversary Profiling", "Threat Modeling"],
  },
  {
    name: "Velociraptor Digital Forensics",
    category: "defensive",
    categoryLabel: "SOC & Threat Hunting",
    description: "Advanced digital forensics and incident response platform providing endpoint visibility and hunting.",
    url: "https://github.com/Velocidex/velociraptor",
    badge: "Incident Response",
    stars: "4.8k+",
    tags: ["DFIR", "Telemetry", "Endpoint"],
  },
  {
    name: "Trivy Security Scanner",
    category: "cloud",
    categoryLabel: "Cloud & DevSecOps",
    description: "Comprehensive vulnerability and misconfiguration scanner for containers, Kubernetes, code repositories, and clouds.",
    url: "https://github.com/aquasecurity/trivy",
    badge: "Container Security",
    stars: "24k+",
    tags: ["Containers", "Kubernetes", "SCA", "IaC"],
  },
  {
    name: "YARA Pattern Matching Swiss Army Knife",
    category: "reverse-engineering",
    categoryLabel: "Malware & Reverse Eng",
    description: "Tool aimed at helping malware researchers identify and classify malware samples using rule-based strings and byte patterns.",
    url: "https://github.com/VirusTotal/yara",
    badge: "Malware Standard",
    stars: "7.5k+",
    tags: ["Malware Identification", "Signatures", "Binary"],
  },
  {
    name: "OWASP Top 10 Vulnerabilities",
    category: "frameworks",
    categoryLabel: "Standards & Frameworks",
    description: "Standard awareness document for developers and web application security representing a broad consensus on critical risks.",
    url: "https://owasp.org/www-project-top-ten/",
    badge: "Application Security",
    stars: "Global Standard",
    tags: ["AppSec", "Web Defense", "Compliance"],
  },
];

export default function ResourcesPage() {
  return (
    <div className="py-8 sm:py-12 bg-white min-h-[70vh]">
      <div className="xrock-container">
        {/* Header Hero */}
        <div className="border-b border-neutral-200 pb-8 sm:pb-12 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Wrench className="w-3.5 h-3.5 text-[#F83838]" />
            Defensive Arsenal & Research Index
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-neutral-900 tracking-tight mb-4">
            Security Tooling & Telemetry Resources
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 max-w-3xl font-sans leading-relaxed">
            A curated index of production-tested security tooling, threat intelligence frameworks, reverse engineering suites, and DFIR telemetry analyzers vetted by AXROK researchers.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-500 mt-6">
            <span>{curatedTools.length} Standard Toolkits Indexed</span>
            <span>•</span>
            <span>Continuously Updated</span>
            <span>•</span>
            <span>Evidence-Led Analysis</span>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-neutral-200 pb-4">
          {resourceCategories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="px-3.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:border-[#F83838] hover:text-[#F83838] bg-neutral-50 hover:bg-white transition-all"
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {curatedTools.map((tool) => (
            <div
              key={tool.name}
              id={tool.category}
              className="xrock-card group flex flex-col justify-between bg-white border border-neutral-200 rounded-xl p-6 hover:border-[#F83838] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-[#F83838]">
                    {tool.categoryLabel}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500 font-semibold">
                    {tool.badge}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-neutral-900 group-hover:text-[#F83838] transition-colors mb-2">
                  {tool.name}
                </h3>

                <p className="text-xs text-neutral-600 line-clamp-3 font-sans leading-relaxed mb-4">
                  {tool.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tool.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-50 text-neutral-600 border border-neutral-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">
                  Rating: <strong className="text-neutral-700">{tool.stars}</strong>
                </span>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F83838] hover:underline"
                >
                  Access Repository <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Guide Callout Strip */}
        <div className="mt-14 p-8 rounded-2xl bg-[#080808] text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-xl text-white">
              Need Hands-On Security Tutorials?
            </h3>
            <p className="text-sm text-neutral-400 max-w-xl">
              Explore our step-by-step technical guides covering offensive tradecraft, defensive threat hunting, and hardening methodologies.
            </p>
          </div>
          <Link
            href="/tutorials"
            className="xrock-button-primary text-sm font-semibold whitespace-nowrap"
          >
            Explore Practical Guides →
          </Link>
        </div>
      </div>
    </div>
  );
}
