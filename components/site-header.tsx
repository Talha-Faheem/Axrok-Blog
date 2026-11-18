"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { SearchModal } from "@/components/search-modal";

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Cybersecurity News", href: "/news" },
    { label: "Threat Intelligence", href: "/threat-intelligence" },
    { label: "Tutorials", href: "/tutorials" },
    { label: "Vulnerabilities", href: "/vulnerabilities" },
    { label: "Tools & Resources", href: "/resources" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
          isScrolled
            ? "bg-[#080808] text-white border-neutral-800 shadow-2xl backdrop-blur-md"
            : "bg-white text-[#080808] border-[#E8E8E8] shadow-xs"
        }`}
      >
        <div className="xrock-container flex items-center justify-between h-18 sm:h-20 gap-4">
          {/* Logo & Brand Wordmark per Figma Design: AXROK with Red Square Accent */}
          <Link
            href="/"
            className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F83838] rounded-sm py-1"
          >
            <div className="relative inline-flex items-center">
              <span
                className={`font-display font-extrabold text-2xl sm:text-[28px] tracking-tight leading-none transition-colors ${
                  isScrolled
                    ? "text-white group-hover:text-neutral-200"
                    : "text-[#080808] group-hover:text-neutral-800"
                }`}
              >
                AXROK
              </span>
              {/* Red Accent Square at top-right of the K */}
              <span className="w-2 h-2 bg-[#F83838] -mt-3.5 ml-0.5 inline-block shrink-0"></span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-6 xl:gap-8 h-full"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative flex items-center h-full text-[14px] sm:text-[15px] font-medium transition-colors ${
                    isScrolled
                      ? isActive
                        ? "text-white font-semibold"
                        : "text-neutral-300 hover:text-white"
                      : isActive
                      ? "text-[#080808] font-semibold"
                      : "text-[#080808] hover:text-[#F83838]"
                  }`}
                >
                  <span>{link.label}</span>
                  {/* Active bottom red bar indicator matching Figma */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#F83838]"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Header Utilities: Search & CTA */}
          <div className="flex items-center gap-4">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search dialog"
              className={`p-2 rounded-lg transition-colors ${
                isScrolled
                  ? "text-neutral-300 hover:text-white hover:bg-neutral-800"
                  : "text-[#080808] hover:text-[#F83838] hover:bg-neutral-100"
              }`}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Subscribe CTA Button per Figma */}
            <a
              href="#newsletter"
              className="bg-[#F83838] hover:bg-[#980000] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all shadow-xs inline-flex items-center justify-center"
            >
              Subscribe
            </a>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className={`lg:hidden p-2 rounded-lg border transition-colors ${
                isScrolled
                  ? "text-white border-neutral-700 hover:bg-neutral-800"
                  : "text-[#080808] border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div
            className={`lg:hidden border-t px-4 py-4 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-150 ${
              isScrolled
                ? "bg-[#080808] border-neutral-800 text-white"
                : "bg-white border-neutral-200 text-neutral-800"
            }`}
          >
            <nav className="flex flex-col space-y-2 text-sm font-semibold">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isScrolled
                      ? "hover:bg-neutral-900 hover:text-[#F83838] text-neutral-200"
                      : "hover:bg-neutral-50 hover:text-[#F83838] text-neutral-800"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div
              className={`pt-2 border-t flex flex-col gap-2 ${
                isScrolled ? "border-neutral-800" : "border-neutral-200"
              }`}
            >
              <a
                href="#newsletter"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-[#F83838] text-white font-semibold text-sm hover:bg-[#980000] transition-colors"
              >
                Subscribe to Publication
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
