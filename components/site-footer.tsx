import Link from "next/link";
import { Shield, Github, Twitter, Disc as Discord, Rss, ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-xrock-black text-white pt-14 pb-10 border-t border-xrock-gray-800">
      <div className="xrock-container">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-xrock-gray-800">
          {/* Brand Info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-display font-black text-xrock-black text-lg">
                X
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                XROACK<span className="text-xrock-red">.</span>
              </span>
            </div>

            <p className="text-sm text-xrock-gray-300 leading-relaxed max-w-sm font-sans">
              Understand threats. Build stronger defenses. An evidence-led technical publication covering offensive tradecraft, defensive engineering, and vulnerability analysis.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/xroack"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className="w-8 h-8 rounded-lg bg-xrock-gray-950 border border-xrock-gray-800 flex items-center justify-center text-xrock-gray-300 hover:text-white hover:border-xrock-red transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/xroack_sec"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter X profile"
                className="w-8 h-8 rounded-lg bg-xrock-gray-950 border border-xrock-gray-800 flex items-center justify-center text-xrock-gray-300 hover:text-white hover:border-xrock-red transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="/rss.xml"
                aria-label="RSS Feed"
                className="w-8 h-8 rounded-lg bg-xrock-gray-950 border border-xrock-gray-800 flex items-center justify-center text-xrock-gray-300 hover:text-white hover:border-xrock-red transition-colors"
              >
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Coverage */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-red">
              Coverage
            </h4>
            <ul className="space-y-2 text-xs text-xrock-gray-300">
              <li>
                <a href="#threat-intel" className="hover:text-white transition-colors">
                  Threat Intelligence
                </a>
              </li>
              <li>
                <a href="#vulnerability-spotlight" className="hover:text-white transition-colors">
                  Vulnerability Research
                </a>
              </li>
              <li>
                <a href="#topics" className="hover:text-white transition-colors">
                  Malware & Ransomware
                </a>
              </li>
              <li>
                <a href="#topics" className="hover:text-white transition-colors">
                  Cloud & Container Security
                </a>
              </li>
              <li>
                <a href="#topics" className="hover:text-white transition-colors">
                  Zero Trust & Identity
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources & Labs */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-red">
              Defensive Labs
            </h4>
            <ul className="space-y-2 text-xs text-xrock-gray-300">
              <li>
                <a href="#guides" className="hover:text-white transition-colors">
                  Practical Hardening Guides
                </a>
              </li>
              <li>
                <a href="#guides" className="hover:text-white transition-colors">
                  Kernel sysctl Benchmarks
                </a>
              </li>
              <li>
                <a href="#guides" className="hover:text-white transition-colors">
                  Malware Analysis Sandboxes
                </a>
              </li>
              <li>
                <a href="#guides" className="hover:text-white transition-colors">
                  OWASP API Defense Matrices
                </a>
              </li>
              <li>
                <a href="#vulnerability-spotlight" className="hover:text-white transition-colors">
                  CVE Disclosure Telemetry
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-red">
              Publication Trust
            </h4>
            <ul className="space-y-2 text-xs text-xrock-gray-300">
              <li>
                <a href="#footer" className="hover:text-white transition-colors">
                  Editorial Standards
                </a>
              </li>
              <li>
                <a href="#footer" className="hover:text-white transition-colors">
                  Coordinated Disclosure Policy
                </a>
              </li>
              <li>
                <a href="#footer" className="hover:text-white transition-colors">
                  security.txt (RFC 9116)
                </a>
              </li>
              <li>
                <a href="#footer" className="hover:text-white transition-colors">
                  Privacy Policy & GDPR
                </a>
              </li>
              <li>
                <a href="#footer" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-xrock-gray-600 font-mono">
          <p>© {currentYear} Xroack. All rights reserved. Built with Next.js, Sanity CMS & Tailwind CSS.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              All Threat Feeds Operational
            </span>
            <span>Edge Hosted via Cloudflare / Vercel</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

