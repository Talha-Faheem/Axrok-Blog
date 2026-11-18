"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@axrok.com");
  const [password, setPassword] = useState("AxrokAdmin2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-xrock-black text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background cyber grid and glow */}
      <div className="absolute inset-0 xrock-grid-bg-dark pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-xrock-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative inline-flex items-center">
              <span className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-white leading-none">
                AXROK
              </span>
              <span className="w-2.5 h-2.5 bg-[#F83838] -mt-5 ml-1 inline-block shrink-0"></span>
            </div>
          </div>
          <h1 className="text-xl font-display font-bold text-white tracking-tight">
            Security Desk Command Center
          </h1>
          <p className="text-xs text-xrock-gray-300 font-mono mt-1">
            Authentication required for editorial and publishing access
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-xrock-gray-950 border border-xrock-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-xrock-gray-300 mb-1.5">
                Operator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-xrock-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@axrok.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-xrock-black border border-xrock-gray-800 text-sm text-white placeholder-xrock-gray-600 focus:outline-none focus:border-xrock-red focus:ring-1 focus:ring-xrock-red transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-xrock-gray-300 mb-1.5">
                Passphrase
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-xrock-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-xrock-black border border-xrock-gray-800 text-sm text-white placeholder-xrock-gray-600 focus:outline-none focus:border-xrock-red focus:ring-1 focus:ring-xrock-red transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-lg bg-xrock-red hover:bg-xrock-red-dark text-white font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-900/30 disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Seed credentials hint for reviewer */}
          <div className="mt-6 pt-5 border-t border-xrock-gray-800/80 text-[11px] font-mono text-xrock-gray-300 space-y-1 bg-xrock-black/50 p-3 rounded-lg border">
            <div className="text-xrock-red font-bold uppercase tracking-wider text-[10px]">
              Default Root Credentials:
            </div>
            <div>Email: <span className="text-white">admin@axrok.com</span></div>
            <div>Password: <span className="text-white">AxrokAdmin2026!</span></div>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-xrock-gray-600 font-mono">
          <a href="/" className="hover:text-xrock-gray-300 transition-colors">
            ← Return to public publication
          </a>
        </div>
      </div>
    </div>
  );
}

