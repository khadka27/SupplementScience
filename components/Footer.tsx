"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FlaskConical,
  ShieldCheck,
  Scale,
  Microscope,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Twitter,
  Youtube,
  Instagram,
  Lock,
} from "lucide-react";

const TRUST_PILLARS = [
  {
    icon: FlaskConical,
    title: "1,420+ Human Clinical RCTs",
    desc: "Double-blind, placebo-controlled human trial evidence only.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Sponsor Funding",
    desc: "No affiliate links, no brand sponsorships, no kickbacks.",
  },
  {
    icon: Microscope,
    title: "Independent Scientific Review",
    desc: "Rigorous pharmacology, bioavailability, and interaction audits.",
  },
  {
    icon: Lock,
    title: "Whistleblower Protection",
    desc: "Confidential triage for reporting tainted or spiked batches.",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Subscription failed. Please try again.");
      }

      setStatus("success");
      setMessage(data.message || "Thank you for subscribing! Check your inbox.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Could not complete subscription.");
    }
  };

  return (
    <footer className="bg-[#0B1411] text-stone-300 border-t border-emerald-950/80 transition-colors selection:bg-emerald-500 selection:text-white">
      
      {/* ── TOP CREDIBILITY MARQUEE / TRUST RIBBON ────────────────── */}
      <div className="border-b border-white/5 bg-black/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {TRUST_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div key={i} className="flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 group-hover:border-emerald-600 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white tracking-tight">
                      {pillar.title}
                    </h4>
                    <p className="text-[11px] text-stone-400 leading-snug mt-0.5">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER NAVIGATION & NEWSLETTER ───────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 items-start text-left">
          
          {/* Col 1 (4 Cols): Brand Identity & Independence Charter */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              href="/"
              className="inline-flex items-center group"
              aria-label="SupplementDecoded — Home"
            >
              <Image
                src="/logo.png"
                alt="SupplementDecoded"
                width={200}
                height={40}
                className="h-9 w-auto object-contain invert opacity-95 group-hover:opacity-100 transition-opacity"
              />
            </Link>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-sans max-w-sm">
              The human-trial monograph database for dietary supplements. We extract therapeutic dosage
              thresholds, bioavailability kinetics, and heavy metal screens with zero manufacturer funding,
              zero affiliate links, and zero pay-to-play reviews.
            </p>

            {/* Social & Direct Channels */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow SupplementDecoded on X / Twitter"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/60 hover:bg-emerald-950/40 text-stone-400 hover:text-emerald-300 flex items-center justify-center transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SupplementDecoded on YouTube"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/60 hover:bg-emerald-950/40 text-stone-400 hover:text-emerald-300 flex items-center justify-center transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SupplementDecoded on Instagram"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/60 hover:bg-emerald-950/40 text-stone-400 hover:text-emerald-300 flex items-center justify-center transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>1,420+ RCTs Live-Synced · 2026 Standards</span>
              </span>
            </div>
          </div>

          {/* Col 2 (2 Cols): Evidence Library */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Evidence Library
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/ingredients"
                  className="text-stone-400 hover:text-emerald-300 transition-colors block py-0.5"
                >
                  Clinical Monographs
                </Link>
              </li>
              <li>
                <Link
                  href="/safety-measures"
                  className="text-stone-400 hover:text-emerald-300 transition-colors block py-0.5"
                >
                  Safety & Toxic Limits
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-stone-400 hover:text-emerald-300 transition-colors block py-0.5"
                >
                  Evaluation Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/category"
                  className="text-stone-400 hover:text-emerald-300 transition-colors block py-0.5"
                >
                  Scam Watch Registry
                </Link>
              </li>
              <li>
                <Link
                  href="/ingredients"
                  className="text-stone-400 hover:text-emerald-300 transition-colors block py-0.5"
                >
                  All 384 Compounds
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 (2 Cols): Standards & Governance */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Methodology
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/editorial-policy"
                  className="text-stone-400 hover:text-emerald-300 transition-colors block py-0.5"
                >
                  Editorial Charter
                </Link>
              </li>
              <li>
                <Link
                  href="/fact-checking"
                  className="text-stone-400 hover:text-emerald-300 transition-colors block py-0.5"
                >
                  Fact-Checking Process
                </Link>
              </li>
              <li>
                <Link
                  href="/medical-expert-review"
                  className="text-stone-400 hover:text-emerald-300 transition-colors block py-0.5"
                >
                  Editorial Review Board
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-stone-400 hover:text-emerald-300 transition-colors block py-0.5"
                >
                  5-Tier Evidence Scale
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-stone-400 hover:text-emerald-300 transition-colors block py-0.5"
                >
                  Whistleblower Intake
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 (4 Cols): The Evidence Digest Newsletter */}
          <div className="lg:col-span-4 space-y-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                The Evidence Digest
              </h4>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                Bi-Weekly
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Direct syntheses of newly published human RCTs, bioavailability breakthroughs, and FDA
              supplement warnings. Strictly zero promotional marketing.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.org"
                  className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  aria-label="Email address for clinical newsletter"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full h-11 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B1411] font-bold text-xs tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe to Evidence Digest</span>
                    <ArrowRight className="w-3.5 h-3.5 font-bold" />
                  </>
                )}
              </button>
            </form>

            {status === "success" && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{message}</span>
              </div>
            )}

            {status === "error" && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-700/60 flex items-center gap-2 text-xs text-red-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{message}</span>
              </div>
            )}

            <p className="text-[10px] text-stone-500 font-mono">
              100% privacy protected. No affiliate tracking. One-click unsubscribe anytime.
            </p>
          </div>

        </div>
      </div>

      {/* ── REGULATORY & CLINICAL SAFETY NOTICE ───────────────────── */}
      <div className="border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-[11px] leading-relaxed text-stone-500 space-y-2 text-left">
            <p>
              <strong className="text-stone-400 font-bold block mb-1">
                FDA & Clinical Toxicology Regulatory Disclosure:
              </strong>
              Content on SupplementDecoded is synthesized from peer-reviewed human clinical trials, published
              pharmacology dossiers, and regulatory filings for educational purposes only. Statements made on
              this platform have not been evaluated by the U.S. Food and Drug Administration (FDA) or the
              European Food Safety Authority (EFSA). Dietary supplements are not intended to diagnose, treat,
              cure, or prevent any medical condition or disease.
            </p>
            <p>
              SupplementDecoded does not sell dietary supplements, receive affiliate commissions, or accept
              manufacturer sponsorships. For individual clinical guidance, prescription drug contraindications,
              or specialized dosing, consult a licensed healthcare practitioner or clinical toxicologist.
            </p>
          </div>
        </div>
      </div>

      {/* ── BOTTOM LEGAL COPYRIGHT BAR ────────────────────────────── */}
      <div className="border-t border-white/5 bg-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 text-center sm:text-left">
            
            <p>
              © {currentYear} SupplementDecoded. All rights reserved. Zero commercial bias.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-stone-400 text-xs">
              <Link href="/about" className="hover:text-emerald-300 transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-emerald-300 transition-colors">
                Contact & Whistleblower
              </Link>
              <Link href="/medical-disclaimer" className="hover:text-emerald-300 transition-colors">
                Medical Disclaimer
              </Link>
              <Link href="/privacy" className="hover:text-emerald-300 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-emerald-300 transition-colors">
                Terms
              </Link>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}
