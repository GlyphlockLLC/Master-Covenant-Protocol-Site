/**
 * GlyphLock Master Covenant Difference Section
 * Shows comparison between traditional AI and GlyphLock's covenant-based approach
 */

import React from "react";
import {
  AlertTriangle,
  ShieldCheck,
  FileText,
  Fingerprint,
  Layers,
  Link2,
  Network,
  BadgeCheck,
} from "lucide-react";

export default function GlyphLockDifferenceSection() {
  return (
    <section className="w-full bg-slate-950/60 border-t border-slate-800/70">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300 mb-4">
            <BadgeCheck className="h-3 w-3" />
            Master Covenant Engine
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-50 mb-4">
            What Makes GlyphLock Different?
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Not "slightly better detection." GlyphLock runs a{" "}
            <span className="font-semibold text-emerald-300">
              71-clause legal framework
            </span>{" "}
            over every decision, binding AI output to identity, evidence, and
            accountability.
          </p>
        </div>

        {/* Comparison grid */}
        <div className="grid gap-6 md:grid-cols-2 mb-14">
          {/* Traditional column */}
          <div className="rounded-3xl border border-red-500/20 bg-slate-950/70 shadow-[0_24px_70px_rgba(0,0,0,0.75)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-gradient-to-r from-slate-950 to-slate-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                  Traditional AI Stack
                </span>
              </div>
              <span className="rounded-full bg-red-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300">
                No Covenant
              </span>
            </div>

            <div className="space-y-3 px-6 py-6">
              {[
                {
                  step: "1",
                  title: "Input received",
                  desc: "Raw text, logs, or evidence enter a black-box model.",
                },
                {
                  step: "2",
                  title: "Statistical pattern guess",
                  desc: "Model predicts the most likely looking answer.",
                },
                {
                  step: "3",
                  title: "Single, unverified output",
                  desc: "No second opinion, no cross-check, no validation.",
                },
                {
                  step: "4",
                  title: "Output disappears",
                  desc: "No durable trail that can stand up to legal review.",
                },
              ].map((row) => (
                <div
                  key={row.step}
                  className="flex items-start gap-3 rounded-2xl bg-slate-900/80 px-4 py-3 border border-slate-800/80"
                >
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 bg-slate-950 text-xs font-semibold text-slate-200">
                    {row.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">
                      {row.title}
                    </p>
                    <p className="text-xs text-slate-400">{row.desc}</p>
                  </div>
                </div>
              ))}

              <div className="mt-4 space-y-1.5 text-xs text-red-300">
                <p className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-red-400" />
                  No legal framework or contractual binding
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-red-400" />
                  Limited explainability and no clause-level trace
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-red-400" />
                  No cryptographic attribution or audit-ready trail
                </p>
              </div>
            </div>
          </div>

          {/* GlyphLock column */}
          <div className="relative rounded-3xl border border-emerald-400/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 shadow-[0_24px_80px_rgba(16,185,129,0.45)] overflow-hidden">
            {/* glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.4),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.35),_transparent_55%)] opacity-70" />

            <div className="relative flex items-center justify-between px-6 py-4 border-b border-emerald-400/40 bg-slate-950/80 backdrop-blur">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
                  GlyphLock Master Covenant Stack
                </span>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                Exclusive
              </span>
            </div>

            <div className="relative px-6 py-6 space-y-3">
              {[
                {
                  step: "1",
                  title: "Input received",
                  desc: "Evidence, transcripts, logs, or prompts enter the covenant pipeline.",
                },
                {
                  step: "2",
                  title: "Semantic + statistical analysis",
                  desc: "Models analyze both patterns and meaning, not just token probability.",
                },
                {
                  step: "3a",
                  title: "Legal compliance check",
                  desc: "Output is checked against the 71-clause Master Covenant.",
                  icon: <FileText className="h-3.5 w-3.5 text-emerald-300" />,
                },
                {
                  step: "3b",
                  title: "Identity & covenant verification",
                  desc: "Bindings ensure the answer cannot be impersonated, spoofed, or detached from origin.",
                  icon: <Fingerprint className="h-3.5 w-3.5 text-emerald-300" />,
                },
                {
                  step: "3c",
                  title: "Multi-agent cross-validation",
                  desc: "Alfred, Claude, Gemini, Copilot, Perplexity, and Cursor cross-check each other.",
                  icon: <Network className="h-3.5 w-3.5 text-emerald-300" />,
                },
                {
                  step: "4",
                  title: "Dual-layer output",
                  desc: "Human-readable answer plus machine-readable audit payload.",
                  icon: <Layers className="h-3.5 w-3.5 text-emerald-300" />,
                },
                {
                  step: "5",
                  title: "Cryptographic chain signature",
                  desc: "Every answer carries a verifiable chain-of-custody and covenant signature.",
                  icon: <Link2 className="h-3.5 w-3.5 text-emerald-300" />,
                },
              ].map((row) => (
                <div
                  key={row.step}
                  className="flex items-start gap-3 rounded-2xl border border-emerald-400/40 bg-slate-950/80 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400 bg-slate-950 text-xs font-semibold text-emerald-200">
                    {row.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-emerald-50">
                        {row.title}
                      </p>
                      {row.icon && <span>{row.icon}</span>}
                    </div>
                    <p className="text-xs text-emerald-100/80">{row.desc}</p>
                  </div>
                </div>
              ))}

              <div className="mt-4 space-y-1.5 text-xs text-emerald-200">
                <p className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-emerald-300" />
                  71-clause legal framework and patent-pending methodology
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-emerald-300" />
                  Identity-bound, cryptographically signed outputs
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-emerald-300" />
                  Full audit trail engineered for courtroom and regulatory use
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom feature cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <FileText className="h-5 w-5 text-emerald-300" />,
              title: "Contractual Binding",
              body: "Every AI output is bound to explicit standards instead of being a best-effort guess.",
            },
            {
              icon: <Fingerprint className="h-5 w-5 text-sky-300" />,
              title: "Identity-Bound Outputs",
              body: "Cryptographic fingerprints tie responses to origin, context, and covenant state.",
            },
            {
              icon: <Network className="h-5 w-5 text-violet-300" />,
              title: "Multi-Agent Cross-Validation",
              body: "Alfred, Claude, Gemini, Copilot, Perplexity, and Cursor verify each other in chain.",
            },
            {
              icon: <ShieldCheck className="h-5 w-5 text-emerald-300" />,
              title: "Federal-Grade Audit Trail",
              body: "Designed for NIST evaluation, regulators, and enterprise risk teams out of the box.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-700/70 bg-slate-950/80 px-4 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.6)]"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/80">
                  {card.icon}
                </div>
                <p className="text-sm font-semibold text-slate-50">
                  {card.title}
                </p>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}