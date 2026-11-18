"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  Eye,
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (categoryFilter) params.set("category", categoryFilter);
    params.set("page", page.toString());
    params.set("limit", "15");

    fetch(`/api/admin/posts?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) {
          setPosts(data.posts);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/categories?all=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [search, statusFilter, categoryFilter, page]);

  const handleTogglePublish = async (post: any) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/posts/${post.id}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: newStatus === "published" }),
      });
      if (res.ok) fetchPosts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (res.ok) fetchPosts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDuplicate = async (post: any) => {
    try {
      const duplicateData = {
        ...post,
        title: `${post.title} (Copy)`,
        slug: `${post.slug}-copy-${Date.now().toString().slice(-4)}`,
        status: "draft",
        isFeatured: false,
        isTrending: false,
      };
      delete duplicateData.id;
      delete duplicateData._id;

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicateData),
      });
      if (res.ok) fetchPosts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-xrock-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-xrock-black tracking-tight">
            Article Management
          </h1>
          <p className="text-xs sm:text-sm text-xrock-gray-600 font-sans mt-1">
            Author, edit, schedule, and publish technical security dispatches and labs.
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-xrock-red text-white text-xs font-semibold hover:bg-xrock-red-dark transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-xrock-gray-100 bg-white shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-xrock-gray-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or excerpt..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-xrock-gray-100 text-xs text-xrock-black placeholder-xrock-gray-600 focus:outline-none focus:border-xrock-red"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-xrock-gray-100 text-xs font-semibold text-xrock-black bg-white focus:outline-none focus:border-xrock-red"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-xrock-gray-100 text-xs font-semibold text-xrock-black bg-white focus:outline-none focus:border-xrock-red"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white border border-xrock-gray-100 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-xrock-gray-600">
            Querying MongoDB article collection...
          </div>
        ) : posts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-xrock-gray-50 border-b border-xrock-gray-100 text-[11px] font-mono font-bold uppercase tracking-wider text-xrock-gray-600">
                  <th className="py-3 px-4">Title & Excerpt</th>
                  <th className="py-3 px-4">Taxonomy</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-xrock-gray-100 font-sans">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-xrock-gray-50/60 transition-colors">
                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-md">
                      <Link
                        href={`/admin/blogs/${post.id}/edit`}
                        className="font-bold text-xrock-black hover:text-xrock-red transition-colors line-clamp-1 text-sm"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-xrock-gray-600 line-clamp-1 mt-0.5">
                        {post.excerpt || "No excerpt provided"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {post.isFeatured && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-50 text-red-700 border border-red-200">
                            Featured Hero
                          </span>
                        )}
                        {post.isTrending && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            Trending
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-xrock-gray-600">
                          {post.readingTime} min read
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded bg-xrock-gray-100 text-xrock-black font-semibold text-[11px]">
                        {post.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        title="Click to toggle publish/draft"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase font-mono transition-all ${
                          post.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : post.status === "scheduled"
                            ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                            : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            post.status === "published"
                              ? "bg-emerald-600"
                              : post.status === "scheduled"
                              ? "bg-blue-600"
                              : "bg-amber-600"
                          }`}
                        />
                        <span>{post.status}</span>
                      </button>
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-xrock-black font-medium">
                      {post.author}
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-xrock-gray-600 font-mono">
                      {post.publishedAt ? (
                        <div>Pub: {new Date(post.publishedAt).toLocaleDateString()}</div>
                      ) : (
                        <div>Created: {new Date(post.createdAt).toLocaleDateString()}</div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {post.status === "published" && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 rounded text-xrock-gray-600 hover:text-xrock-black hover:bg-xrock-gray-100"
                            title="Preview Public Article"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/blogs/${post.id}/edit`}
                          className="p-1.5 rounded text-xrock-gray-600 hover:text-xrock-black hover:bg-xrock-gray-100"
                          title="Edit Article"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(post)}
                          className="p-1.5 rounded text-xrock-gray-600 hover:text-xrock-black hover:bg-xrock-gray-100"
                          title="Duplicate Article"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-1.5 rounded text-xrock-gray-600 hover:text-xrock-red hover:bg-red-50"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-xrock-gray-600 font-mono space-y-2">
            <div>No articles match your active filter criteria.</div>
            <Link href="/admin/blogs/new" className="text-xrock-red font-bold hover:underline block">
              + Author a new article
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-xrock-gray-100 flex items-center justify-between text-xs">
            <span className="text-xrock-gray-600">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 rounded border border-xrock-gray-100 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 rounded border border-xrock-gray-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
