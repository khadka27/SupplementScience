"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  FileText,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react";

type TopicType = "research" | "scam" | "press" | "general";

interface TicketData {
  ticketId: string;
  topic: string;
  estimatedReview: string;
}

const TOPIC_OPTIONS: { id: TopicType; label: string; badge: string; desc: string }[] = [
  {
    id: "research",
    label: "Clinical Correction",
    badge: "Editorial Review",
    desc: "Submit human RCT citations, dosage revisions, or pharmacokinetic corrections.",
  },
  {
    id: "scam",
    label: "Report a Scam / Fake COA",
    badge: "Confidential Triage",
    desc: "Report adulterated batches, undeclared pharmaceuticals, or fraudulent test certificates.",
  },
  {
    id: "press",
    label: "Press & Media",
    badge: "Journalist Desk",
    desc: "Expert commentary on FDA dietary supplement warnings, recalls, and clinical toxicology.",
  },
  {
    id: "general",
    label: "General Inquiry",
    badge: "Editorial Staff",
    desc: "Platform questions, methodology inquiries, or suggesting new ingredients to monograph.",
  },
];

export function ContactForm() {
  const [topic, setTopic] = useState<TopicType>("research");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [subject, setSubject] = useState("");
  const [evidenceLink, setEvidenceLink] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          name: isAnonymous ? "Anonymous Whistleblower" : name,
          email: isAnonymous ? "" : email,
          isAnonymous,
          subject,
          evidenceLink,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry. Please try again.");
      }

      setTicketData({
        ticketId: data.ticketId,
        topic: data.topic,
        estimatedReview: data.estimatedReview,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTicket = () => {
    if (ticketData?.ticketId) {
      navigator.clipboard.writeText(ticketData.ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setTicketData(null);
    setSubject("");
    setEvidenceLink("");
    setMessage("");
    setErrorMsg(null);
  };

  if (ticketData) {
    return (
      <div className="rounded-3xl p-8 sm:p-10 bg-white dark:bg-[#0D1217] border-2 border-emerald-500/40 dark:border-emerald-600/50 shadow-2xl shadow-emerald-950/10 text-left">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-6">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 mb-3 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>CONFIDENTIAL INTAKE CONFIRMED</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight mb-3">
          Triage Ticket Generated
        </h3>

        <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed mb-6 font-sans">
          Your inquiry has been safely routed to our independent research and editorial board.
          All whistleblower submissions are strictly compartmentalized and stripped of IP identifiers.
        </p>

        {/* Ticket Box */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold mb-0.5">
              REFERENCE TICKET ID
            </div>
            <div className="font-mono text-lg font-bold text-[#0E3B2F] dark:text-emerald-400 tracking-wide">
              {ticketData.ticketId}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyTicket}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:border-emerald-500 transition-colors shadow-2xs"
            aria-label="Copy ticket ID"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs border-y border-stone-200/80 dark:border-stone-800 py-4 mb-6">
          <div>
            <span className="text-stone-400 block font-mono uppercase text-[10px]">Estimated SLA</span>
            <span className="font-bold text-stone-800 dark:text-stone-200">{ticketData.estimatedReview}</span>
          </div>
          <div>
            <span className="text-stone-400 block font-mono uppercase text-[10px]">Assigned Unit</span>
            <span className="font-bold text-stone-800 dark:text-stone-200">
              {ticketData.topic === "scam" ? "Scam & Adulteration Triage" : "Clinical Monograph Editorial"}
            </span>
          </div>
        </div>

        <div className="text-xs text-stone-500 dark:text-stone-400 mb-8 leading-relaxed">
          <strong>Need to provide lab files?</strong> If you have raw third-party HPLC/ICP-MS lab test PDFs,
          Certificate of Analysis (COA) sheets, or product photos, please email them directly to{" "}
          <a
            href={`mailto:${ticketData.topic === "scam" ? "scamwatch" : "editorial"}@supplementdecoded.com?subject=Ticket ${ticketData.ticketId}`}
            className="font-bold text-[#0E3B2F] dark:text-emerald-400 hover:underline"
          >
            {ticketData.topic === "scam" ? "scamwatch" : "editorial"}@supplementdecoded.com
          </a>{" "}
          referencing your ticket ID in the subject line.
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="h-11 px-6 rounded-xl bg-[#0E3B2F] hover:bg-[#11483A] text-white font-bold text-xs tracking-wide transition-all shadow-md active:scale-95"
          >
            Submit Another Inquiry
          </button>
          <Link
            href="/ingredients"
            className="h-11 px-5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs tracking-wide transition-all flex items-center justify-center"
          >
            Browse Clinical Monographs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 shadow-xl shadow-stone-950/5 text-left transition-colors">
      
      {/* Form Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DIRECT EDITORIAL & WHISTLEBLOWER INTAKE</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          Submit an Editorial Inquiry
        </h2>
        <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
          Direct route to our clinical researchers, pharmacologists, and scam analysts.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-xs text-red-800 dark:text-red-300">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMsg}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Topic Selector */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-stone-700 dark:text-stone-300 mb-2">
            Inquiry Category <span className="text-emerald-600">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TOPIC_OPTIONS.map((opt) => {
              const active = topic === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTopic(opt.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all duration-200 ${
                    active
                      ? "bg-emerald-50/80 dark:bg-emerald-950/50 border-[#0E3B2F] dark:border-emerald-500 shadow-xs ring-2 ring-emerald-500/20"
                      : "bg-stone-50/60 dark:bg-stone-900/40 border-stone-200/90 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold ${
                        active ? "text-[#0E3B2F] dark:text-emerald-400" : "text-stone-900 dark:text-stone-100"
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        active
                          ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300"
                          : "bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                      }`}
                    >
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Anonymous Whistleblower Option */}
        <div className="p-3.5 rounded-2xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <input
              id="anonymous-toggle"
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded text-[#0E3B2F] focus:ring-emerald-500 border-stone-300 cursor-pointer"
            />
            <label htmlFor="anonymous-toggle" className="text-xs font-medium text-stone-700 dark:text-stone-300 cursor-pointer">
              <strong>Submit as Anonymous Whistleblower</strong>
              <span className="block text-[11px] text-stone-400">
                Recommended when disclosing internal corporate documents, spiked batches, or undisclosed fraud.
              </span>
            </label>
          </div>
        </div>

        {/* 3. Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              Your Name {isAnonymous ? "(Optional)" : <span className="text-emerald-600">*</span>}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isAnonymous}
              placeholder={isAnonymous ? "Anonymous Whistleblower" : "e.g., Jane Smith"}
              className="w-full h-11 px-3.5 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#0E3B2F] dark:focus:border-emerald-500 disabled:opacity-50 disabled:bg-stone-100 dark:disabled:bg-stone-800"
              required={!isAnonymous}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              Email Address {isAnonymous ? "(Optional)" : <span className="text-emerald-600">*</span>}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isAnonymous}
              placeholder={isAnonymous ? "Kept confidential" : "name@institution.org"}
              className="w-full h-11 px-3.5 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#0E3B2F] dark:focus:border-emerald-500 disabled:opacity-50 disabled:bg-stone-100 dark:disabled:bg-stone-800"
              required={!isAnonymous}
            />
          </div>
        </div>

        {/* 4. Subject / Target Supplement */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-stone-700 dark:text-stone-300 mb-1.5">
            Subject or Target Supplement / Ingredient <span className="text-emerald-600">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Ashwagandha KSM-66 Dosage Correction / Brand XYZ Spiked SARMs"
            className="w-full h-11 px-3.5 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#0E3B2F] dark:focus:border-emerald-500"
            required
          />
        </div>

        {/* 5. Evidence Link or PubMed ID */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-stone-700 dark:text-stone-300 mb-1.5">
            PubMed ID, DOI, or Certificate of Analysis URL <span className="text-stone-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={evidenceLink}
            onChange={(e) => setEvidenceLink(e.target.value)}
            placeholder="e.g., PMID: 32021735 or https://doi.org/10.1001/..."
            className="w-full h-11 px-3.5 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#0E3B2F] dark:focus:border-emerald-500"
          />
        </div>

        {/* 6. Message Body */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-stone-700 dark:text-stone-300 mb-1.5">
            Clinical Summary or Detailed Report <span className="text-emerald-600">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Detail the human trial evidence, specific claim discrepancy, adulterant lab findings, or editorial question..."
            className="w-full p-3.5 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#0E3B2F] dark:focus:border-emerald-500 resize-y leading-relaxed"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto min-w-[200px] h-12 px-8 rounded-xl bg-[#0E3B2F] hover:bg-[#124b3b] text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-emerald-950/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Routing to Triage...</span>
              </>
            ) : (
              <>
                <span>Transmit Secure Inquiry</span>
                <Send className="w-4 h-4 text-emerald-300" />
              </>
            )}
          </button>
          <p className="text-[11px] text-stone-400 mt-2 font-mono">
            Zero advertising solicitation. We never sell contact information or accept sponsor pay-for-coverage.
          </p>
        </div>
      </form>
    </div>
  );
}
