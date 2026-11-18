"use client";

import { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setSettings(d.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-xrock-gray-600">
        Loading site configurations...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-xrock-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-xrock-black tracking-tight">
            Platform & Brand Settings
          </h1>
          <p className="text-xs sm:text-sm text-xrock-gray-600 font-sans mt-1">
            Global branding tokens, canonical metadata, and social channels.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-xrock-red text-white text-xs font-semibold hover:bg-xrock-red-dark transition-colors shadow-sm self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Platform Settings"}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Platform settings updated successfully across all pages!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs font-sans">
        {/* Brand Identity */}
        <div className="bg-white border border-xrock-gray-100 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-xrock-black font-display pb-2 border-b border-xrock-gray-100">
            Brand Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono font-bold uppercase text-[11px] mb-1">
                Publication Name
              </label>
              <input
                type="text"
                value={settings?.siteName || ""}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 font-semibold"
              />
            </div>

            <div>
              <label className="block font-mono font-bold uppercase text-[11px] mb-1">
                Editorial Tagline
              </label>
              <input
                type="text"
                value={settings?.tagline || ""}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100"
              />
            </div>

            <div>
              <label className="block font-mono font-bold uppercase text-[11px] mb-1">
                Contact & Tips Email
              </label>
              <input
                type="email"
                value={settings?.contactEmail || ""}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 font-mono"
              />
            </div>

            <div>
              <label className="block font-mono font-bold uppercase text-[11px] mb-1">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={settings?.footerText || ""}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white border border-xrock-gray-100 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-xrock-black font-display pb-2 border-b border-xrock-gray-100">
            Social & RSS Syndication
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-[11px] mb-1">Twitter / X URL</label>
              <input
                type="url"
                value={settings?.socialLinks?.twitter || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 rounded border border-xrock-gray-100 font-mono"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] mb-1">GitHub Organization</label>
              <input
                type="url"
                value={settings?.socialLinks?.github || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, github: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 rounded border border-xrock-gray-100 font-mono"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] mb-1">LinkedIn Profile</label>
              <input
                type="url"
                value={settings?.socialLinks?.linkedin || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 rounded border border-xrock-gray-100 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SEO Defaults */}
        <div className="bg-white border border-xrock-gray-100 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-xrock-black font-display pb-2 border-b border-xrock-gray-100">
            Default SEO & Metadata
          </h2>

          <div>
            <label className="block font-mono font-bold uppercase text-[11px] mb-1">
              Default Browser Title
            </label>
            <input
              type="text"
              value={settings?.seoDefaults?.title || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seoDefaults: { ...settings.seoDefaults, title: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100"
            />
          </div>

          <div>
            <label className="block font-mono font-bold uppercase text-[11px] mb-1">
              Default Meta Description
            </label>
            <textarea
              rows={3}
              value={settings?.seoDefaults?.description || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seoDefaults: { ...settings.seoDefaults, description: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-xrock-red text-white text-xs font-semibold hover:bg-xrock-red-dark transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Platform Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
