"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, ShieldAlert, Sparkles, ChevronDown } from "lucide-react";
import { SearchModal } from "@/components/search-modal";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "News", href: "#latest-news" },
    { label: "Threat Intel", href: "#threat-intel" },
    { label: "Tutorials", href: "#guides" },
    { label: "Vulnerabilities", href: "#vulnerability-spotlight" },
    { label: "Topics", href: "#topics" },
    { label: "About", href: "#footer" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-xrock-gray-100 shadow-sm"
            : "bg-white border-xrock-gray-100"
        }`}
      >
        <div className="xrock-container flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xrock-red rounded"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-xrock-black flex items-center justify-center font-display font-bold text-white tracking-wider border border-xrock-gray-800 shadow-sm group-hover:border-xrock-red transition-colors relative overflow-hidden">
              <span className="text-xl sm:text-2xl text-white">X</span>
              <div className="absolute top-0 right-0 w-2 h-2 bg-xrock-red rounded-bl-sm"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-2xl sm:text-[26px] tracking-tight text-xrock-black leading-none group-hover:text-xrock-red-dark transition-colors">
                XROACK<span className="text-xrock-red">.</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-xrock-gray-600 font-semibold mt-0.5">
                Cybersecurity Intel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-7 text-[14px] font-semibold text-xrock-gray-800"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-xrock-red transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-xrock-red hover:after:w-full after:transition-all after:duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Header Utilities: Search & CTA */}
          <div className="flex items-center gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search dialog"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-xrock-gray-100 bg-xrock-gray-50 hover:bg-xrock-gray-100 hover:border-xrock-gray-300 transition-colors text-xs text-xrock-gray-600"
            >
              <Search className="w-4 h-4 text-xrock-gray-800" />
              <span className="hidden sm:inline font-medium">Search Intel...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-xrock-gray-300 rounded text-xrock-gray-600 shadow-xs">
                ⌘K
              </kbd>
            </button>

            {/* Subscribe CTA Button */}
            <a
              href="#newsletter"
              className="xrock-button-primary text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap"
            >
              Subscribe
            </a>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden p-2 rounded-lg text-xrock-black hover:bg-xrock-gray-50 border border-xrock-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-xrock-gray-100 bg-white px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col space-y-2 text-sm font-semibold text-xrock-gray-800">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-xrock-gray-50 hover:text-xrock-red transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-2 border-t border-xrock-gray-100 flex flex-col gap-2">
              <a
                href="#newsletter"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-xrock-red text-white font-semibold text-sm hover:bg-xrock-red-dark transition-colors"
              >
                Join Publication Newsletter
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

