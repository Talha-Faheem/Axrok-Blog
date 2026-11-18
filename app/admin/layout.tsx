"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  Users,
  Image as ImageIcon,
  Sliders,
  Mail,
  FileCode,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => { });
  }, [isLoginPage]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  // If we are on the login page, render children without the admin sidebar/header
  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Articles", href: "/admin/blogs", icon: FileText },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Tags", href: "/admin/tags", icon: Tags },
    { label: "Authors", href: "/admin/authors", icon: Users },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    { label: "Homepage", href: "/admin/homepage", icon: Sliders },
    { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { label: "Pages", href: "/admin/pages", icon: FileCode },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-xrock-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-xrock-black text-white border-r border-xrock-gray-800 shrink-0 select-none">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-xrock-gray-800">
          <Link href="/" className="flex items-center group">
            <div className="relative inline-flex items-center">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white leading-none">
                AXROK
              </span>
              <span className="w-2 h-2 bg-[#F83838] -mt-3.5 ml-0.5 inline-block shrink-0"></span>
            </div>
          </Link>
          <span className="ml-3 text-[10px] font-mono tracking-wider text-xrock-gray-300 uppercase px-1.5 py-0.5 bg-xrock-gray-900 border border-xrock-gray-800 rounded">
            CMS
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isActive
                  ? "bg-xrock-red text-white shadow-sm"
                  : "text-xrock-gray-300 hover:text-white hover:bg-xrock-gray-900"
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-xrock-gray-800 bg-xrock-gray-950">
          <div className="flex items-center justify-between gap-2 px-2 py-1.5">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-xrock-gray-300 truncate font-mono">{user?.email || "admin@axrok.com"}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded text-xrock-gray-300 hover:text-xrock-red hover:bg-xrock-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-xrock-gray-100 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-xrock-black hover:bg-xrock-gray-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-red hidden sm:inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Authenticated Session
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-xrock-gray-300 text-xs font-semibold text-xrock-black hover:border-xrock-black hover:bg-xrock-gray-50 transition-colors"
            >
              <span>View Public Publication</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-xrock-black text-white border-b border-xrock-gray-800 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isActive
                    ? "bg-xrock-red text-white"
                    : "text-xrock-gray-300 hover:text-white hover:bg-xrock-gray-900"
                    }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-xrock-gray-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-xrock-red font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

