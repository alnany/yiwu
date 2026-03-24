"use client";
import { useState, useEffect } from "react";
import { RfpPost } from "@/types";
import { MapPin, Clock, DollarSign, ChevronRight, Plus, X } from "lucide-react";

interface Props { locale: string; }

export function InvitationHallContent({ locale }: Props) {
  const [rfps, setRfps] = useState<RfpPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchRfps(); }, []);

  async function fetchRfps() {
    const res = await fetch("/api/rfp?status=open");
    const data = await res.json();
    setRfps(data.rfps || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="text-center py-16 text-ink-500 text-xs tracking-wide-luxury uppercase">
        Loading projects...
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gold text-ink-900 px-5 py-2.5 text-xs tracking-widest-luxury uppercase font-medium hover:bg-gold-light transition-colors duration-300"
        >
          <Plus className="w-3.5 h-3.5" />
          Post a Project
        </button>
      </div>

      {showForm && (
        <PostRfpForm locale={locale} onClose={() => { setShowForm(false); fetchRfps(); }} />
      )}

      {rfps.length === 0 ? (
        <div className="text-center py-20 border border-ink-800">
          <p className="font-display text-lg text-ink-500">No open projects yet.</p>
          <p className="text-xs text-ink-600 mt-1">Be the first to post a project brief.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-px bg-ink-700/30">
          {rfps.map((rfp) => (
            <RfpCard key={rfp.id} rfp={rfp} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}

function RfpCard({ rfp, locale }: { rfp: RfpPost; locale: string }) {
  const designer = rfp.designer as any;
  return (
    <div className="bg-ink-800 hover:border-gold/20 transition-all duration-300 p-6 group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-cream text-sm leading-tight">{rfp.title}</h3>
        <span className="ml-2 flex-shrink-0 text-xs border border-green-900 text-green-500 px-2 py-0.5">
          Open
        </span>
      </div>
      <p className="text-xs text-ink-400 line-clamp-2 mb-4 leading-relaxed font-light">
        {rfp.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {rfp.product_categories?.map((c) => (
          <span key={c} className="text-xs border border-ink-600 text-ink-400 px-2 py-0.5">
            {c}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-ink-600">
        {rfp.budget_range && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />{rfp.budget_range}
          </span>
        )}
        {rfp.timeline && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />{rfp.timeline}
          </span>
        )}
        {rfp.target_region && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />{rfp.target_region}
          </span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-ink-700/50 flex items-center justify-between">
        <div className="text-xs text-ink-500 font-light">
          by <span className="text-ink-300">{designer?.full_name || "Designer"}</span>
        </div>
        <a
          href={`/${locale}/invitation-hall/${rfp.id}`}
          className="flex items-center gap-1 text-xs text-gold hover:text-gold-light transition-colors duration-200"
        >
          View & Respond <ChevronRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

function PostRfpForm({ locale, onClose }: { locale: string; onClose: () => void }) {
  const [form, setForm] = useState({
    title: "", description: "", product_categories: "",
    budget_range: "", timeline: "", target_region: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/rfp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        product_categories: form.product_categories.split(",").map((c) => c.trim()).filter(Boolean),
      }),
    });
    if (res.ok) {
      onClose();
    } else {
      const d = await res.json();
      setError(d.error || "Failed to post project");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-ink-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-ink-800 border border-ink-700/50 p-8 w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-lg font-medium text-cream">Post a Project</h2>
            <div className="w-6 h-px bg-gold/50 mt-2" />
          </div>
          <button onClick={onClose} className="text-ink-500 hover:text-cream transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="border border-red-900/50 bg-red-950/30 text-red-400 text-xs p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: "title",               label: "Project Title",       placeholder: "e.g. Luxury Hotel Lobby Furniture" },
            { key: "description",         label: "Description",          placeholder: "Describe your project requirements..." },
            { key: "product_categories",  label: "Product Categories",   placeholder: "furniture, marble, lighting (comma separated)" },
            { key: "budget_range",        label: "Budget Range",         placeholder: "e.g. $50,000 – $100,000" },
            { key: "timeline",            label: "Timeline",             placeholder: "e.g. 3 months" },
            { key: "target_region",       label: "Your Region",          placeholder: "e.g. North America" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs tracking-wide-luxury uppercase text-ink-400 mb-2">{label}</label>
              {key === "description" ? (
                <textarea
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required placeholder={placeholder} rows={3}
                  className="w-full bg-ink-900 border border-ink-600 text-cream text-sm px-4 py-3 focus:outline-none focus:border-gold placeholder-ink-600 resize-none"
                />
              ) : (
                <input
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={key === "title"}
                  placeholder={placeholder}
                  className="w-full bg-ink-900 border border-ink-600 text-cream text-sm px-4 py-3 focus:outline-none focus:border-gold placeholder-ink-600"
                />
              )}
            </div>
          ))}

          <div className="flex gap-px pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 border border-ink-600 py-3 text-xs tracking-wide-luxury uppercase text-ink-400 hover:text-ink-200 hover:border-ink-400 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={submitting}
              className="flex-1 bg-gold text-ink-900 py-3 text-xs tracking-widest-luxury uppercase font-medium hover:bg-gold-light disabled:opacity-50 transition-colors duration-300"
            >
              {submitting ? "Posting..." : "Post Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
