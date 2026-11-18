"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  Eye,
  FileCode,
  Image as ImageIcon,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle2,
  Plus,
  Trash2,
  RefreshCw,
  Upload,
  Code,
  Terminal,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
} from "lucide-react";

interface ArticleEditorProps {
  initialData?: any;
  isEditing?: boolean;
}

export function ArticleEditor({ initialData, isEditing = false }: ArticleEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || "");
  const [category, setCategory] = useState(initialData?.category || "threat-intelligence");
  const [tags, setTags] = useState<string[]>(initialData?.tags || ["zero-day"]);
  const [tagInput, setTagInput] = useState("");
  const [author, setAuthor] = useState(initialData?.author || "marcus-vance");
  const [status, setStatus] = useState(initialData?.status || "draft");
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [isTrending, setIsTrending] = useState(initialData?.isTrending || false);
  const [scheduledAt, setScheduledAt] = useState(
    initialData?.scheduledAt ? new Date(initialData.scheduledAt).toISOString().slice(0, 16) : ""
  );
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonicalUrl || "");
  const [sources, setSources] = useState<{ title: string; url: string }[]>(
    initialData?.sources || []
  );

  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [authorsList, setAuthorsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  useEffect(() => {
    fetch("/api/categories?all=true")
      .then((r) => r.json())
      .then((d) => {
        if (d.categories) setCategoriesList(d.categories);
      });
    fetch("/api/authors")
      .then((r) => r.json())
      .then((d) => {
        if (d.authors) setAuthorsList(d.authors);
      });
  }, []);

  const handleAutoSlug = () => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(generated);
  };

  const handleAddTag = () => {
    const clean = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleAddSource = () => {
    setSources([...sources, { title: "", url: "" }]);
  };

  const handleUpdateSource = (index: number, field: "title" | "url", val: string) => {
    const updated = [...sources];
    updated[index][field] = val;
    setSources(updated);
  };

  const handleRemoveSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("altText", title || "Article featured image");

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.media?.url) {
        setFeaturedImage(data.media.url);
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Content formatting toolbar helpers
  const insertContent = (before: string, after: string = "") => {
    const textarea = document.getElementById("article-content-textarea") as HTMLTextAreaElement;
    if (!textarea) {
      setContent((prev: string) => prev + before + after);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const replacement = before + (selected || "Text") + after;

    const newContent =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + replacement.length - after.length);
    }, 0);
  };

  const handleSave = async (targetStatus?: string) => {
    setError("");
    const finalStatus = targetStatus || status;

    if (!title.trim()) {
      setError("Article title is required");
      return;
    }
    if (!category) {
      setError("Please select a category");
      return;
    }
    if (!author) {
      setError("Please select an author");
      return;
    }

    setLoading(true);

    const payload = {
      title,
      slug: slug || undefined,
      excerpt,
      content,
      featuredImage: featuredImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      imageAlt: imageAlt || title,
      category,
      tags,
      author,
      status: finalStatus,
      isFeatured,
      isTrending,
      scheduledAt: finalStatus === "scheduled" && scheduledAt ? new Date(scheduledAt).toISOString() : null,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      canonicalUrl,
      sources: sources.filter((s) => s.title && s.url),
    };

    try {
      const url = isEditing ? `/api/admin/posts/${initialData.id}` : "/api/admin/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save article");
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-xrock-gray-100">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-2 rounded-lg border border-xrock-gray-100 hover:bg-xrock-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-xrock-black" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-xrock-black tracking-tight">
              {isEditing ? "Edit Technical Article" : "Author New Intelligence Article"}
            </h1>
            <p className="text-xs text-xrock-gray-600 font-mono">
              Fields support rich HTML formatting, code snippets, and custom callouts
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={loading}
            className="px-3.5 py-2 rounded-lg border border-xrock-gray-300 bg-white hover:bg-xrock-gray-50 text-xs font-semibold text-xrock-black transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-xrock-red hover:bg-xrock-red-dark text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? "Update & Publish" : "Publish Article"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor & Settings Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Area (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="bg-white border border-xrock-gray-100 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-xrock-black mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Inside the attack surface: the security risks teams overlook"
                className="w-full px-3.5 py-2.5 rounded-lg border border-xrock-gray-100 text-base font-display font-bold text-xrock-black placeholder-xrock-gray-600 focus:outline-none focus:border-xrock-red"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-black">
                  URL Slug
                </label>
                <button
                  type="button"
                  onClick={handleAutoSlug}
                  className="text-[11px] font-mono text-xrock-red hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generate from title</span>
                </button>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-2 rounded-l-lg border border-r-0 border-xrock-gray-100 bg-xrock-gray-50 text-xs font-mono text-xrock-gray-600">
                  /blog/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="inside-the-attack-surface-overlooked-risks"
                  className="w-full px-3 py-2 rounded-r-lg border border-xrock-gray-100 text-xs font-mono text-xrock-black focus:outline-none focus:border-xrock-red"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-xrock-black mb-1.5">
                Summary / Dek Excerpt
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Two to three sentence technical summary displayed in feeds and meta previews..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-xrock-gray-100 text-xs text-xrock-black placeholder-xrock-gray-600 focus:outline-none focus:border-xrock-red"
              />
            </div>
          </div>

          {/* Rich Content Editor */}
          <div className="bg-white border border-xrock-gray-100 rounded-xl overflow-hidden shadow-xs">
            {/* Tab Header & Formatting Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-xrock-gray-50 border-b border-xrock-gray-100">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("write")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    activeTab === "write"
                      ? "bg-white text-xrock-black shadow-xs border border-xrock-gray-100"
                      : "text-xrock-gray-600 hover:text-xrock-black"
                  }`}
                >
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === "preview"
                      ? "bg-white text-xrock-black shadow-xs border border-xrock-gray-100"
                      : "text-xrock-gray-600 hover:text-xrock-black"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Public Preview</span>
                </button>
              </div>

              {activeTab === "write" && (
                <div className="flex flex-wrap items-center gap-1 border-t sm:border-t-0 pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => insertContent("<h2>", "</h2>")}
                    className="p-1.5 rounded hover:bg-xrock-gray-200 text-xrock-black"
                    title="Heading 2"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertContent("<h3>", "</h3>")}
                    className="p-1.5 rounded hover:bg-xrock-gray-200 text-xrock-black"
                    title="Heading 3"
                  >
                    <Heading3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertContent("<strong>", "</strong>")}
                    className="p-1.5 rounded hover:bg-xrock-gray-200 text-xrock-black"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertContent("<em>", "</em>")}
                    className="p-1.5 rounded hover:bg-xrock-gray-200 text-xrock-black"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertContent("<ul>\n  <li>", "</li>\n</ul>")}
                    className="p-1.5 rounded hover:bg-xrock-gray-200 text-xrock-black"
                    title="Unordered List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertContent("<ol>\n  <li>", "</li>\n</ol>")}
                    className="p-1.5 rounded hover:bg-xrock-gray-200 text-xrock-black"
                    title="Ordered List"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertContent(
                        '<div class="xrock-terminal">\n  <pre><code># Shell Command Here\n$ ',
                        "</code></pre>\n</div>"
                      )
                    }
                    className="p-1.5 rounded hover:bg-xrock-gray-200 text-xrock-red"
                    title="Terminal Command Box"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertContent(
                        '<div class="xrock-callout xrock-callout-danger">\n  <strong>Security Alert:</strong> ',
                        "\n</div>"
                      )
                    }
                    className="p-1.5 rounded hover:bg-xrock-gray-200 text-red-600"
                    title="Danger Callout"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertContent(
                        '<div class="xrock-callout xrock-callout-warning">\n  <strong>Caution:</strong> ',
                        "\n</div>"
                      )
                    }
                    className="p-1.5 rounded hover:bg-xrock-gray-200 text-amber-600"
                    title="Warning Callout"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Editor Body */}
            {activeTab === "write" ? (
              <textarea
                id="article-content-textarea"
                rows={20}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write article body in HTML or structured text (e.g. <h2>Introduction</h2><p>Article body...</p>)..."
                className="w-full p-5 font-mono text-xs text-xrock-black leading-relaxed focus:outline-none"
              />
            ) : (
              <div className="p-8 bg-white min-h-[400px]">
                <div
                  className="prose prose-sm max-w-none text-xrock-black"
                  dangerouslySetInnerHTML={{ __html: content || "<p>Nothing to preview yet.</p>" }}
                />
              </div>
            )}
          </div>

          {/* Source References */}
          <div className="bg-white border border-xrock-gray-100 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-black">
                  Verified Source References & CVE Links
                </h3>
                <p className="text-[11px] text-xrock-gray-600">
                  Peer-reviewed advisories, vendor bulletins, and official research papers
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSource}
                className="text-xs font-semibold text-xrock-red hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Source</span>
              </button>
            </div>

            {sources.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Source Title (e.g. NIST NVD Entry)"
                  value={s.title}
                  onChange={(e) => handleUpdateSource(idx, "title", e.target.value)}
                  className="w-1/2 px-3 py-1.5 rounded border border-xrock-gray-100 text-xs"
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={s.url}
                  onChange={(e) => handleUpdateSource(idx, "url", e.target.value)}
                  className="w-1/2 px-3 py-1.5 rounded border border-xrock-gray-100 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSource(idx)}
                  className="p-1.5 text-xrock-gray-600 hover:text-xrock-red"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Settings (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing Controls */}
          <div className="bg-white border border-xrock-gray-100 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-black pb-2 border-b border-xrock-gray-100">
              Publication Status
            </h3>

            <div>
              <label className="block text-xs font-mono text-xrock-gray-600 mb-1">State</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 text-xs font-semibold text-xrock-black bg-white focus:outline-none focus:border-xrock-red"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Live to public)</option>
                <option value="scheduled">Scheduled (Timed disclosure)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {status === "scheduled" && (
              <div>
                <label className="block text-xs font-mono text-xrock-gray-600 mb-1">
                  Scheduled Release Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 text-xs font-mono text-xrock-black focus:outline-none focus:border-xrock-red"
                />
              </div>
            )}

            <div className="pt-2 border-t border-xrock-gray-100 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-xrock-black">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-xrock-red focus:ring-xrock-red"
                />
                <span>Pin as Hero / Featured Article</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-xrock-black">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="rounded text-xrock-red focus:ring-xrock-red"
                />
                <span>Display in Trending Dispatches</span>
              </label>
            </div>
          </div>

          {/* Taxonomy & Attribution */}
          <div className="bg-white border border-xrock-gray-100 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-black pb-2 border-b border-xrock-gray-100">
              Taxonomy & Attribution
            </h3>

            {/* Category */}
            <div>
              <label className="block text-xs font-mono text-xrock-gray-600 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 text-xs font-semibold text-xrock-black bg-white focus:outline-none focus:border-xrock-red"
              >
                {categoriesList.map((c) => (
                  <option key={c.id || c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-mono text-xrock-gray-600 mb-1">Author *</label>
              <select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-xrock-gray-100 text-xs font-semibold text-xrock-black bg-white focus:outline-none focus:border-xrock-red"
              >
                {authorsList.map((a) => (
                  <option key={a.id || a.slug} value={a.slug}>
                    {a.name} ({a.designation})
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-mono text-xrock-gray-600 mb-1">Tags</label>
              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  placeholder="e.g. cve-2024-38077"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  className="w-full px-2.5 py-1.5 rounded border border-xrock-gray-100 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 rounded bg-xrock-black text-white text-xs font-mono font-bold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-xrock-gray-100 text-[11px] font-mono text-xrock-black"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-xrock-gray-600 hover:text-xrock-red"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white border border-xrock-gray-100 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-black pb-2 border-b border-xrock-gray-100">
              Featured Image
            </h3>

            <div>
              <label className="block text-xs font-mono text-xrock-gray-600 mb-1">Image URL</label>
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-1.5 rounded border border-xrock-gray-100 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-xrock-gray-600 mb-1">
                Upload New Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-xrock-gray-100 file:text-xrock-black hover:file:bg-xrock-gray-200"
              />
              {uploadingImage && <span className="text-[11px] text-xrock-red mt-1 block">Uploading...</span>}
            </div>

            {featuredImage && (
              <div className="mt-2 rounded-lg overflow-hidden border border-xrock-gray-100 aspect-video relative bg-xrock-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* SEO Metadata */}
          <div className="bg-white border border-xrock-gray-100 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-black pb-2 border-b border-xrock-gray-100">
              Search Engine Optimization
            </h3>

            <div>
              <label className="block text-[11px] font-mono text-xrock-gray-600 mb-1">SEO Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title}
                className="w-full px-3 py-1.5 rounded border border-xrock-gray-100 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-xrock-gray-600 mb-1">SEO Description</label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder={excerpt}
                className="w-full px-3 py-1.5 rounded border border-xrock-gray-100 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
