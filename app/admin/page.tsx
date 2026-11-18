"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Clock,
  Calendar,
  FolderTree,
  Tags,
  Users,
  Mail,
  Plus,
  ArrowRight,
  Shield,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-xrock-gray-100 rounded w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-xrock-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Articles", value: stats?.totalArticles ?? 0, icon: FileText, color: "text-xrock-black" },
    { label: "Published", value: stats?.publishedArticles ?? 0, icon: CheckCircle2, color: "text-emerald-600" },
    { label: "Drafts", value: stats?.draftArticles ?? 0, icon: Clock, color: "text-amber-600" },
    { label: "Scheduled", value: stats?.scheduledArticles ?? 0, icon: Calendar, color: "text-blue-600" },
    { label: "Taxonomies", value: stats?.categoriesCount ?? 0, icon: FolderTree, color: "text-xrock-red" },
    { label: "Technical Tags", value: stats?.tagsCount ?? 0, icon: Tags, color: "text-purple-600" },
    { label: "Researchers", value: stats?.authorsCount ?? 0, icon: Users, color: "text-indigo-600" },
    { label: "Subscribers", value: stats?.subscribersCount ?? 0, icon: Mail, color: "text-xrock-red" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-xrock-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-xrock-black tracking-tight">
            Security Desk Overview
          </h1>
          <p className="text-xs sm:text-sm text-xrock-gray-600 font-sans mt-1">
            Real-time publication telemetry, editorial inventory, and live database metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-xrock-red text-white text-xs font-semibold hover:bg-xrock-red-dark transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </Link>
        </div>
      </div>

      {/* Actual Database Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="p-5 rounded-xl border border-xrock-gray-100 bg-white shadow-xs hover:border-xrock-gray-300 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-gray-600">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className={`text-2xl sm:text-3xl font-display font-extrabold ${card.color}`}>
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Launch & Recent Articles Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Articles (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-display font-bold text-xrock-black">
              Recently Updated Articles
            </h2>
            <Link
              href="/admin/blogs"
              className="text-xs font-semibold text-xrock-red hover:underline inline-flex items-center gap-1"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-xrock-gray-100 rounded-xl overflow-hidden shadow-xs">
            {stats?.recentArticles && stats.recentArticles.length > 0 ? (
              <div className="divide-y divide-xrock-gray-100">
                {stats.recentArticles.map((art: any) => (
                  <div
                    key={art.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-xrock-gray-50/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            art.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : art.status === "scheduled"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {art.status}
                        </span>
                        <span className="text-[11px] font-mono text-xrock-gray-600">
                          {art.category}
                        </span>
                      </div>
                      <Link
                        href={`/admin/blogs/${art.id}/edit`}
                        className="text-sm font-semibold text-xrock-black hover:text-xrock-red transition-colors line-clamp-1"
                      >
                        {art.title}
                      </Link>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/admin/blogs/${art.id}/edit`}
                        className="text-xs px-2.5 py-1 rounded border border-xrock-gray-100 bg-white hover:bg-xrock-gray-50 text-xrock-black font-semibold transition-colors"
                      >
                        Edit
                      </Link>
                      {art.status === "published" && (
                        <Link
                          href={`/blog/${art.slug}`}
                          target="_blank"
                          className="text-xs p-1.5 text-xrock-gray-600 hover:text-xrock-black"
                          title="View Live"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-xrock-gray-600 font-mono">
                No articles found in database. Click "Create Article" to begin.
              </div>
            )}
          </div>
        </div>

        {/* Operational Status & Quick Tools */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-xrock-gray-800 bg-xrock-black text-white space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-xrock-red">
              <Shield className="w-4 h-4 text-emerald-400" />
              System Status: Active
            </div>
            <p className="text-xs text-xrock-gray-300 font-sans leading-relaxed">
              Database operational. All article routes revalidate on publication. Automated cron scheduler is active for embargoed disclosures.
            </p>
            <div className="pt-2 border-t border-xrock-gray-800 text-[11px] font-mono text-xrock-gray-300 space-y-1">
              <div>Database: <span className="text-emerald-400 font-bold">Connected</span></div>
              <div>Security Core: <span className="text-white">AXROK 2.0</span></div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-xrock-gray-100 bg-white space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-black">
              Fast Management Links
            </h3>
            <div className="flex flex-col gap-2 text-xs font-semibold">
              <Link
                href="/admin/homepage"
                className="p-2.5 rounded-lg border border-xrock-gray-100 hover:border-xrock-red text-xrock-black hover:text-xrock-red transition-all flex items-center justify-between"
              >
                <span>Customize Homepage Sections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/admin/categories"
                className="p-2.5 rounded-lg border border-xrock-gray-100 hover:border-xrock-red text-xrock-black hover:text-xrock-red transition-all flex items-center justify-between"
              >
                <span>Manage Taxonomies & Slugs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/admin/newsletter"
                className="p-2.5 rounded-lg border border-xrock-gray-100 hover:border-xrock-red text-xrock-black hover:text-xrock-red transition-all flex items-center justify-between"
              >
                <span>Download Newsletter CSV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
