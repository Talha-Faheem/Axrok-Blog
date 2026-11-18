"use client";

import { useState, useEffect } from "react";
import { Upload, Copy, Check, Trash2, Image as ImageIcon, Search, ExternalLink } from "lucide-react";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchMedia = () => {
    setLoading(true);
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d) => {
        if (d.media) setMediaList(d.media);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("altText", file.name);

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        fetchMedia();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete image "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (res.ok) fetchMedia();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMedia = mediaList.filter(
    (m) =>
      m.filename?.toLowerCase().includes(search.toLowerCase()) ||
      m.altText?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-xrock-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-xrock-black tracking-tight">
            Media & Asset Library
          </h1>
          <p className="text-xs sm:text-sm text-xrock-gray-600 font-sans mt-1">
            Store and retrieve optimized editorial diagrams, memory schematics, and article artwork.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-xrock-red text-white text-xs font-semibold hover:bg-xrock-red-dark transition-colors shadow-sm cursor-pointer self-start sm:self-auto">
          <Upload className="w-4 h-4" />
          <span>{uploading ? "Uploading..." : "Upload Image"}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Search */}
      <div className="p-4 rounded-xl border border-xrock-gray-100 bg-white shadow-xs">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-xrock-gray-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search media by filename or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-xrock-gray-100 text-xs"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-xrock-gray-600">
          Loading assets from storage...
        </div>
      ) : filteredMedia.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((m) => (
            <div
              key={m.id || m._id}
              className="group bg-white border border-xrock-gray-100 rounded-xl overflow-hidden shadow-xs hover:border-xrock-gray-300 transition-all flex flex-col justify-between"
            >
              <div className="aspect-video relative bg-xrock-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.url}
                  alt={m.altText || m.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              <div className="p-3 space-y-2">
                <p className="text-xs font-semibold text-xrock-black truncate" title={m.filename}>
                  {m.filename}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-xrock-gray-600">
                  <span>{m.format?.toUpperCase() || "IMG"}</span>
                  <span>{Math.round(m.size / 1024)} KB</span>
                </div>

                <div className="pt-2 border-t border-xrock-gray-100 flex items-center justify-between gap-1">
                  <button
                    onClick={() => handleCopy(m.url, m.id || m._id)}
                    className="flex-1 py-1 px-2 rounded bg-xrock-gray-50 hover:bg-xrock-gray-100 text-[11px] font-semibold text-xrock-black flex items-center justify-center gap-1 transition-colors"
                  >
                    {copiedId === (m.id || m._id) ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-xrock-gray-600" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id || m._id, m.filename)}
                    className="p-1.5 rounded hover:bg-red-50 text-xrock-gray-600 hover:text-xrock-red"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-xs font-mono text-xrock-gray-600 bg-white rounded-xl border border-xrock-gray-100">
          No media found. Click "Upload Image" to add graphics to the media library.
        </div>
      )}
    </div>
  );
}
