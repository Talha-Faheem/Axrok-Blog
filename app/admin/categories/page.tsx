"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FolderTree, AlertCircle, CheckCircle2, X } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = () => {
    setLoading(true);
    fetch("/api/categories?all=true")
      .then((r) => r.json())
      .then((d) => {
        if (d.categories) setCategories(d.categories);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCat(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("");
    setSeoTitle("");
    setSeoDescription("");
    setIsActive(true);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCat(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setSeoTitle(cat.seoTitle || "");
    setSeoDescription(cat.seoDescription || "");
    setIsActive(cat.isActive !== false);
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {
      name,
      slug: slug || undefined,
      description,
      image,
      seoTitle,
      seoDescription,
      isActive,
    };

    try {
      const url = editingCat
        ? `/api/admin/categories/${editingCat.id || editingCat._id}`
        : "/api/admin/categories";
      const method = editingCat ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Cannot delete category");
        return;
      }
      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-xrock-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-xrock-black tracking-tight">
            Category Taxonomy Management
          </h1>
          <p className="text-xs sm:text-sm text-xrock-gray-600 font-sans mt-1">
            Organize dispatches and research into high-level cybersecurity domains.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-xrock-red text-white text-xs font-semibold hover:bg-xrock-red-dark transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid/Table */}
      <div className="bg-white border border-xrock-gray-100 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-xrock-gray-600">
            Loading categories from database...
          </div>
        ) : (
          <div className="divide-y divide-xrock-gray-100">
            {categories.map((cat) => (
              <div
                key={cat.id || cat.slug}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-xrock-gray-50/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-xrock-gray-50 border border-xrock-gray-100 flex items-center justify-center text-xrock-red shrink-0">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-xrock-black">{cat.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-xrock-gray-100 text-xrock-gray-600">
                        /{cat.slug}
                      </span>
                      {!cat.isActive && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-700">
                          Disabled
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-xrock-gray-600 max-w-xl font-sans">
                      {cat.description || "No description provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 rounded border border-xrock-gray-100 bg-white hover:bg-xrock-gray-50 text-xrock-black text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id || cat._id, cat.name)}
                    className="p-2 rounded border border-xrock-gray-100 bg-white hover:bg-red-50 text-xrock-red hover:border-red-200"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-xrock-gray-100 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-xrock-gray-100">
              <h3 className="text-base font-display font-bold text-xrock-black">
                {editingCat ? "Edit Category" : "Create New Category"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded text-xrock-gray-600 hover:text-xrock-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-mono font-bold uppercase text-[11px] text-xrock-black mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Threat Intelligence"
                  className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 focus:outline-none focus:border-xrock-red font-semibold text-xrock-black"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-[11px] text-xrock-black mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="threat-intelligence"
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
                  placeholder="Brief editorial summary of this category..."
                  className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 focus:outline-none focus:border-xrock-red"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-[11px] text-xrock-black mb-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 focus:outline-none focus:border-xrock-red font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cat-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-xrock-red"
                />
                <label htmlFor="cat-active" className="cursor-pointer font-medium text-xrock-black">
                  Active (Visible on public taxonomy and navigation menus)
                </label>
              </div>

              <div className="pt-4 border-t border-xrock-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-xrock-gray-300 text-xrock-black font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-xrock-red text-white font-semibold hover:bg-xrock-red-dark transition-colors"
                >
                  {editingCat ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
