"use client";

import { useState, useEffect } from "react";
import { Mail, Download, Search, Trash2, UserX, CheckCircle, Clock } from "lucide-react";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchSubscribers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);

    fetch(`/api/admin/newsletter?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.subscribers) setSubscribers(d.subscribers);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubscribers();
  }, [search, statusFilter]);

  const handleUnsubscribe = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/newsletter/${id}`, { method: "PATCH" });
      if (res.ok) fetchSubscribers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Delete subscriber record for "${email}"?`)) return;
    try {
      const res = await fetch(`/api/admin/newsletter/${id}`, { method: "DELETE" });
      if (res.ok) fetchSubscribers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-xrock-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-xrock-black tracking-tight">
            Newsletter & Intelligence Subscribers
          </h1>
          <p className="text-xs sm:text-sm text-xrock-gray-600 font-sans mt-1">
            Audience records for weekly CVE briefings, reverse-engineering disclosures, and lab dispatches.
          </p>
        </div>

        <a
          href="/api/admin/newsletter?format=csv"
          download="axrok-subscribers.csv"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-xrock-gray-100 bg-white hover:bg-xrock-gray-50 text-xrock-black text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-xrock-red" />
          <span>Export Subscriber CSV</span>
        </a>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl border border-xrock-gray-100 bg-white shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-xrock-gray-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-xrock-gray-100 text-xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-xrock-gray-100 text-xs font-semibold text-xrock-black bg-white"
        >
          <option value="">All Statuses</option>
          <option value="active">Active Subscribers</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white border border-xrock-gray-100 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-xrock-gray-600">
            Querying subscriber database...
          </div>
        ) : subscribers.length > 0 ? (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-xrock-gray-50 border-b border-xrock-gray-100 text-[11px] font-mono font-bold uppercase text-xrock-gray-600">
                <th className="py-3 px-4">Subscriber Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Subscribed At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-xrock-gray-100">
              {subscribers.map((s) => (
                <tr key={s.id || s._id} className="hover:bg-xrock-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-xrock-black">
                    {s.email}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        s.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-xrock-gray-100 text-xrock-gray-600 border border-xrock-gray-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          s.status === "active" ? "bg-emerald-600" : "bg-xrock-gray-400"
                        }`}
                      />
                      <span>{s.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xrock-gray-600">
                    {new Date(s.subscribedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {s.status === "active" && (
                        <button
                          onClick={() => handleUnsubscribe(s.id || s._id)}
                          className="p-1.5 rounded border border-xrock-gray-100 hover:bg-xrock-gray-50 text-xrock-gray-600 text-[11px] font-semibold"
                          title="Unsubscribe user"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(s.id || s._id, s.email)}
                        className="p-1.5 rounded border border-xrock-gray-100 hover:bg-red-50 text-xrock-red"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-xs font-mono text-xrock-gray-600">
            No subscribers match the current filter.
          </div>
        )}
      </div>
    </div>
  );
}
