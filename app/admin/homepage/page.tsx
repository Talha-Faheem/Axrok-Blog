"use client";

import { useState, useEffect } from "react";
import { Sliders, Save, CheckCircle2, AlertCircle, Eye, ArrowRight } from "lucide-react";

export default function AdminHomepagePage() {
  const [settings, setSettings] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/homepage").then((r) => r.json()),
      fetch("/api/admin/posts?limit=50&status=published").then((r) => r.json()),
    ])
      .then(([homeData, postsData]) => {
        if (homeData.settings) setSettings(homeData.settings);
        if (postsData.posts) setPosts(postsData.posts);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save homepage settings");

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: string) => {
    setSettings((prev: any) => ({
      ...prev,
      visibleSections: {
        ...prev.visibleSections,
        [section]: !prev.visibleSections[section],
      },
    }));
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-xrock-gray-600">
        Loading homepage customization schema...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-xrock-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-xrock-black tracking-tight">
            Homepage Content & Layout Manager
          </h1>
          <p className="text-xs sm:text-sm text-xrock-gray-600 font-sans mt-1">
            Assign the lead investigation hero, featured story carousels, and section visibility.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-xrock-red text-white text-xs font-semibold hover:bg-xrock-red-dark transition-colors shadow-sm self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Homepage"}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Homepage configuration updated and public cache revalidated!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Announcement Strip Controls */}
        <div className="bg-white border border-xrock-gray-100 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-xrock-gray-100">
            <div>
              <h2 className="text-sm font-bold text-xrock-black font-display">
                Top Announcement Bar
              </h2>
              <p className="text-xs text-xrock-gray-600">
                Slim alert bar for active zero-day advisories and critical publication dispatches
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={settings?.announcement?.enabled ?? true}
                onChange={(e) =>
                  setSettings((prev: any) => ({
                    ...prev,
                    announcement: { ...prev.announcement, enabled: e.target.checked },
                  }))
                }
                className="rounded text-xrock-red"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-xrock-black mb-1">
                Badge Label
              </label>
              <input
                type="text"
                value={settings?.announcement?.badge || ""}
                onChange={(e) =>
                  setSettings((prev: any) => ({
                    ...prev,
                    announcement: { ...prev.announcement, badge: e.target.value },
                  }))
                }
                className="w-full px-3 py-1.5 rounded border border-xrock-gray-100 text-xs font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono font-bold uppercase text-xrock-black mb-1">
                Message Text
              </label>
              <input
                type="text"
                value={settings?.announcement?.text || ""}
                onChange={(e) =>
                  setSettings((prev: any) => ({
                    ...prev,
                    announcement: { ...prev.announcement, text: e.target.value },
                  }))
                }
                className="w-full px-3 py-1.5 rounded border border-xrock-gray-100 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Lead Hero Article Assignment */}
        <div className="bg-white border border-xrock-gray-100 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-xrock-black font-display">
              Lead Editorial Hero (Section 6.3)
            </h2>
            <p className="text-xs text-xrock-gray-600">
              Select the primary featured investigation that appears with high prominence on the homepage
            </p>
          </div>

          <select
            value={settings?.heroPostSlug || ""}
            onChange={(e) =>
              setSettings((prev: any) => ({ ...prev, heroPostSlug: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 text-xs font-semibold text-xrock-black bg-white focus:outline-none focus:border-xrock-red"
          >
            <option value="">-- Select an article --</option>
            {posts.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title} ({p.category})
              </option>
            ))}
          </select>
        </div>

        {/* Featured Story Slugs */}
        <div className="bg-white border border-xrock-gray-100 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-xrock-black font-display">
              Vulnerability Spotlight Story (Section 6.7)
            </h2>
            <p className="text-xs text-xrock-gray-600">
              Article linked in the dark CVE advisory spotlight component
            </p>
          </div>

          <select
            value={settings?.spotlightPostSlug || ""}
            onChange={(e) =>
              setSettings((prev: any) => ({ ...prev, spotlightPostSlug: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 text-xs font-semibold text-xrock-black bg-white focus:outline-none focus:border-xrock-red"
          >
            <option value="">-- Select an article --</option>
            {posts.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Section Visibility Toggles */}
        <div className="bg-white border border-xrock-gray-100 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-xrock-black font-display pb-2 border-b border-xrock-gray-100">
            Homepage Section Visibility Controls
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { id: "hero", label: "Editorial Hero Feature" },
              { id: "latestIntelligence", label: "Latest Intelligence Feed (Section 6.4)" },
              { id: "topics", label: "Explore Topics Taxonomy Grid (Section 6.5)" },
              { id: "practicalGuides", label: "Practical Guides & Defensive Labs (Section 6.6)" },
              { id: "vulnerabilitySpotlight", label: "Verified Vulnerability Spotlight (Section 6.7)" },
              { id: "newsletter", label: "Newsletter Subscription Strip (Section 6.8)" },
            ].map((sec) => (
              <label
                key={sec.id}
                className="flex items-center justify-between p-3 rounded-lg border border-xrock-gray-100 hover:bg-xrock-gray-50 cursor-pointer"
              >
                <span className="font-semibold text-xrock-black">{sec.label}</span>
                <input
                  type="checkbox"
                  checked={settings?.visibleSections?.[sec.id] !== false}
                  onChange={() => toggleSection(sec.id)}
                  className="rounded text-xrock-red focus:ring-xrock-red w-4 h-4"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-xrock-red text-white text-xs font-semibold hover:bg-xrock-red-dark transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Homepage Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
