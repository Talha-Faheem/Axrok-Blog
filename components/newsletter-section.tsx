"use client";

import { useActionState, useState } from "react";
import { Mail, CheckCircle, AlertCircle, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { subscribeToNewsletter, ActionState } from "@/app/actions/newsletter";
import { FadeIn } from "@/components/motion";

export function NewsletterSection() {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    subscribeToNewsletter,
    null
  );

  return (
    <section id="newsletter" className="py-14 sm:py-20 bg-white border-b border-xrock-gray-100">
      <div className="xrock-container">
        <FadeIn className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-br from-xrock-gray-50 via-white to-xrock-gray-50 border border-xrock-gray-300 p-8 sm:p-12 shadow-sm relative overflow-hidden">
          {/* Subtle red accent bar on top of card */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-xrock-red via-xrock-crimson to-xrock-red-dark" />

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-xrock-red/10 text-xrock-red text-xs font-mono font-bold tracking-wider uppercase">
              <Mail className="w-3.5 h-3.5" />
              Direct Intelligence Feed
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-xrock-black tracking-tight">
              Get Practical Security Insights in Your Inbox
            </h2>

            <p className="text-sm sm:text-base text-xrock-gray-600 font-sans leading-relaxed">
              No noise, zero marketing fluff. Weekly breakdowns of emerging CVEs, reverse-engineered malware samples, and defensive architectures delivered every Thursday.
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="mt-8 max-w-xl mx-auto">
            {/* Honeypot field for bot protection */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-xrock-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your work or research email..."
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-xrock-gray-300 rounded-control text-sm text-xrock-black placeholder-xrock-gray-600 focus:outline-none focus:border-xrock-red focus:ring-2 focus:ring-xrock-red/20 transition-all disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="xrock-button-primary shrink-0 py-3 px-6 text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {isPending ? (
                  <span>Securing Transmission...</span>
                ) : (
                  <>
                    <span>Subscribe Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Feedback Messages */}
            {state?.success && (
              <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{state.message}</span>
              </div>
            )}

            {state && !state.success && (
              <div className="mt-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-xrock-red shrink-0" />
                <span className="font-medium">{state.message}</span>
              </div>
            )}

            {/* Privacy note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-xrock-gray-600 text-center">
              <Lock className="w-3.5 h-3.5 text-xrock-gray-600" />
              <span>
                Zero tracking ads. Powered by Brevo API. One-click unsubscribe anytime.
              </span>
            </div>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}

