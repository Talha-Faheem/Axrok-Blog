"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Users, X, AlertCircle } from "lucide-react";

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [biography, setBiography] = useState("");
  const [avatar, setAvatar] = useState("");
  const [designation, setDesignation] = useState("");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [error, setError] = useState("");

  const fetchAuthors = () => {
    setLoading(true);
    fetch("/api/authors")
      .then((r) => r.json())
      .then((d) => {
        if (d.authors) setAuthors(d.authors);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const openCreateModal = () => {
    setEditingAuthor(null);
    setName("");
    setSlug("");
    setBiography("");
    setAvatar("");
    setDesignation("Security Researcher");
    setTwitter("");
    setGithub("");
    setLinkedin("");
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (a: any) => {
    setEditingAuthor(a);
    setName(a.name);
    setSlug(a.slug);
    setBiography(a.biography || "");
    setAvatar(a.avatar || "");
    setDesignation(a.designation || "");
    setTwitter(a.socialLinks?.twitter || "");
    setGithub(a.socialLinks?.github || "");
    setLinkedin(a.socialLinks?.linkedin || "");
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {
      name,
      slug: slug || undefined,
      biography,
      avatar,
      designation,
      socialLinks: { twitter, github, linkedin },
    };

    try {
      const url = editingAuthor
        ? `/api/admin/authors/${editingAuthor.id || editingAuthor._id}`
        : "/api/admin/authors";
      const method = editingAuthor ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save author");

      setModalOpen(false);
      fetchAuthors();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string, authorName: string) => {
    if (!confirm(`Delete researcher profile for "${authorName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/authors/${id}`, { method: "DELETE" });
      if (res.ok) fetchAuthors();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-xrock-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-xrock-black tracking-tight">
            Security Researchers & Authors
          </h1>
          <p className="text-xs sm:text-sm text-xrock-gray-600 font-sans mt-1">
            Maintain verified researcher profiles, cryptographic keys, and editorial credentials.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-xrock-red text-white text-xs font-semibold hover:bg-xrock-red-dark transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Researcher</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 p-8 text-center text-xs font-mono text-xrock-gray-600">
            Querying author collection...
          </div>
        ) : (
          authors.map((a) => (
            <div
              key={a.id || a.slug}
              className="p-5 rounded-xl border border-xrock-gray-100 bg-white shadow-xs flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border border-xrock-gray-100 bg-xrock-gray-100 shrink-0">
                {a.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.avatar} alt={a.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xrock-black">
                    {a.name[0]}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-xrock-black truncate">{a.name}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(a)}
                      className="p-1 rounded text-xrock-gray-600 hover:text-xrock-black"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id || a._id, a.name)}
                      className="p-1 rounded text-xrock-gray-600 hover:text-xrock-red"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-mono text-xrock-red font-semibold">{a.designation}</p>
                <p className="text-xs text-xrock-gray-600 mt-1 line-clamp-2">{a.biography}</p>
                <div className="mt-2 text-[10px] font-mono text-xrock-gray-600">
                  Slug: <span className="text-xrock-black">/authors/{a.slug}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-xrock-gray-100 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-xrock-gray-100">
              <h3 className="text-base font-display font-bold text-xrock-black">
                {editingAuthor ? "Edit Researcher Profile" : "Create Author Profile"}
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
                  <label className="block font-mono font-bold uppercase text-[11px] mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marcus Vance"
                    className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold uppercase text-[11px] mb-1">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="marcus-vance"
                    className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-[11px] mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Lead Offensive Security Researcher"
                  className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-[11px] mb-1">Avatar Photo URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-[11px] mb-1">Biography</label>
                <textarea
                  rows={3}
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  placeholder="Technical background, specialties, and research scope..."
                  className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-mono text-[10px] mb-1">Twitter / X</label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/..."
                    className="w-full px-2 py-1.5 rounded border border-xrock-gray-100 text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] mb-1">GitHub</label>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-2 py-1.5 rounded border border-xrock-gray-100 text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] mb-1">LinkedIn</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-2 py-1.5 rounded border border-xrock-gray-100 text-[11px]"
                  />
                </div>
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
                  {editingAuthor ? "Save Profile" : "Create Author"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
