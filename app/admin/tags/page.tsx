"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Tags, X, AlertCircle } from "lucide-react";

export default function AdminTagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const fetchTags = () => {
    setLoading(true);
    fetch("/api/tags")
      .then((r) => r.json())
      .then((d) => {
        if (d.tags) setTags(d.tags);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const openCreateModal = () => {
    setEditingTag(null);
    setName("");
    setSlug("");
    setDescription("");
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (t: any) => {
    setEditingTag(t);
    setName(t.name);
    setSlug(t.slug);
    setDescription(t.description || "");
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const url = editingTag
        ? `/api/admin/tags/${editingTag.id || editingTag._id}`
        : "/api/admin/tags";
      const method = editingTag ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug: slug || undefined, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save tag");

      setModalOpen(false);
      fetchTags();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string, tagName: string) => {
    if (!confirm(`Delete tag #${tagName}?`)) return;
    try {
      const res = await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
      if (res.ok) fetchTags();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-xrock-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-xrock-black tracking-tight">
            Technical Tags Management
          </h1>
          <p className="text-xs sm:text-sm text-xrock-gray-600 font-sans mt-1">
            Tags power CVE cross-referencing, attack techniques, and granular search indexing.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-xrock-red text-white text-xs font-semibold hover:bg-xrock-red-dark transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Tag</span>
        </button>
      </div>

      <div className="bg-white border border-xrock-gray-100 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-xrock-gray-600">
            Loading tags from database...
          </div>
        ) : (
          <div className="divide-y divide-xrock-gray-100">
            {tags.map((t) => (
              <div
                key={t.id || t.slug}
                className="p-4 flex items-center justify-between hover:bg-xrock-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-xrock-gray-100 flex items-center justify-center text-xrock-black font-mono font-bold text-xs">
                    #
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-xrock-black">{t.name}</span>
                      <span className="text-[11px] font-mono text-xrock-gray-600">
                        ({t.slug})
                      </span>
                    </div>
                    {t.description && (
                      <p className="text-xs text-xrock-gray-600">{t.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-1.5 rounded border border-xrock-gray-100 hover:bg-xrock-gray-50 text-xrock-black text-xs"
                    title="Edit Tag"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id || t._id, t.name)}
                    className="p-1.5 rounded border border-xrock-gray-100 hover:bg-red-50 text-xrock-red"
                    title="Delete Tag"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-xrock-gray-100 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-xrock-gray-100">
              <h3 className="text-base font-display font-bold text-xrock-black">
                {editingTag ? "Edit Tag" : "Create Technical Tag"}
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
              <div>
                <label className="block font-mono font-bold uppercase text-[11px] text-xrock-black mb-1">
                  Tag Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CVE-2024-38077"
                  className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 focus:outline-none focus:border-xrock-red font-semibold"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-[11px] text-xrock-black mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="cve-2024-38077"
                  className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 focus:outline-none focus:border-xrock-red font-mono"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-[11px] text-xrock-black mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional brief description of this tag classification..."
                  className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 focus:outline-none focus:border-xrock-red"
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
                  {editingTag ? "Save Tag" : "Create Tag"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
