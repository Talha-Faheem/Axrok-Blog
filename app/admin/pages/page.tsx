"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, FileCode, ExternalLink, X, Save } from "lucide-react";

export default function AdminPagesManager() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [status, setStatus] = useState("published");
  const [error, setError] = useState("");

  const fetchPages = () => {
    setLoading(true);
    fetch("/api/admin/pages")
      .then((r) => r.json())
      .then((d) => {
        if (d.pages) setPages(d.pages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openEditModal = (p: any) => {
    setEditingPage(p);
    setTitle(p.title);
    setSlug(p.slug);
    setContent(p.content || "");
    setSeoTitle(p.seoTitle || "");
    setSeoDescription(p.seoDescription || "");
    setStatus(p.status || "published");
    setError("");
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingPage(null);
    setTitle("");
    setSlug("");
    setContent("");
    setSeoTitle("");
    setSeoDescription("");
    setStatus("published");
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {
      title,
      slug: slug || undefined,
      content,
      seoTitle,
      seoDescription,
      status,
    };

    try {
      const url = editingPage
        ? `/api/admin/pages/${editingPage.id || editingPage._id}`
        : "/api/admin/pages";
      const method = editingPage ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save page");

      setModalOpen(false);
      fetchPages();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string, pageTitle: string) => {
    if (!confirm(`Delete page "${pageTitle}"?`)) return;
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
      if (res.ok) fetchPages();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-xrock-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-xrock-black tracking-tight">
            Static & Editorial Pages
          </h1>
          <p className="text-xs sm:text-sm text-xrock-gray-600 font-sans mt-1">
            Maintain institutional documents: About, Editorial Policy, Contact, Terms, and Privacy.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-xrock-red text-white text-xs font-semibold hover:bg-xrock-red-dark transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Page</span>
        </button>
      </div>

      <div className="bg-white border border-xrock-gray-100 rounded-xl overflow-hidden shadow-xs divide-y divide-xrock-gray-100">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-xrock-gray-600">
            Querying static page collection...
          </div>
        ) : (
          pages.map((p) => (
            <div
              key={p.id || p.slug}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-xrock-gray-50/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-xrock-gray-100 flex items-center justify-center text-xrock-black shrink-0">
                  <FileCode className="w-5 h-5 text-xrock-red" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-xrock-black">{p.title}</h3>
                    <span className="text-[11px] font-mono text-xrock-gray-600">
                      /{p.slug}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                        p.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-xrock-gray-600 line-clamp-1 mt-1 font-sans">
                    {p.seoDescription || "No custom SEO description set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <Link
                  href={`/${p.slug}`}
                  target="_blank"
                  className="p-2 rounded border border-xrock-gray-100 bg-white hover:bg-xrock-gray-50 text-xrock-black text-xs font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Public Page</span>
                </Link>
                <button
                  onClick={() => openEditModal(p)}
                  className="p-2 rounded border border-xrock-gray-100 bg-white hover:bg-xrock-gray-50 text-xrock-black text-xs font-semibold flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Content</span>
                </button>
                <button
                  onClick={() => handleDelete(p.id || p._id, p.title)}
                  className="p-2 rounded border border-xrock-gray-100 bg-white hover:bg-red-50 text-xrock-red"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-xrock-gray-100 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-xrock-gray-100">
              <h3 className="text-base font-display font-bold text-xrock-black">
                {editingPage ? `Edit ${editingPage.title}` : "Create New Static Page"}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-xrock-gray-600" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold uppercase text-[11px] mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="About AXROK"
                    className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold uppercase text-[11px] mb-1">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="about"
                    className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-[11px] mb-1">
                  Page Content (HTML supported)
                </label>
                <textarea
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<h2>Heading</h2><p>Page paragraphs...</p>"
                  className="w-full p-3 font-mono text-xs rounded-lg border border-xrock-gray-100 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-[11px] mb-1">
                  SEO Description
                </label>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Search engine meta description..."
                  className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100"
                />
              </div>

              <div className="pt-4 border-t border-xrock-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-xrock-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-xrock-red text-white font-semibold hover:bg-xrock-red-dark"
                >
                  Save Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
