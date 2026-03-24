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

  if (loading) return <div className="text-center py-12 text-gray-500">Loading projects...</div>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Post a Project
        </button>
      </div>

      {showForm && <PostRfpForm locale={locale} onClose={() => { setShowForm(false); fetchRfps(); }} />}

      {rfps.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-lg">No open projects yet. Be the first to post!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-5">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-base leading-tight">{rfp.title}</h3>
        <span className="ml-2 flex-shrink-0 text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">Open</span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{rfp.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {rfp.product_categories?.map((c) => (
          <span key={c} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{c}</span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400">
        {rfp.budget_range && (
          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{rfp.budget_range}</span>
        )}
        {rfp.timeline && (
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{rfp.timeline}</span>
        )}
        {rfp.target_region && (
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{rfp.target_region}</span>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          by <span className="font-medium">{designer?.full_name || "Designer"}</span>
          {designer?.company && <span className="text-gray-400"> · {designer.company}</span>}
        </div>
        <a
          href={`/${locale}/invitation-hall/${rfp.id}`}
          className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline"
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Post a Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: "title", label: "Project Title", placeholder: "e.g. Luxury Hotel Lobby Furniture" },
            { key: "description", label: "Description", placeholder: "Describe your project requirements..." },
            { key: "product_categories", label: "Product Categories", placeholder: "furniture, marble, lighting (comma separated)" },
            { key: "budget_range", label: "Budget Range", placeholder: "e.g. $50,000 – $100,000" },
            { key: "timeline", label: "Timeline", placeholder: "e.g. 3 months" },
            { key: "target_region", label: "Your Region", placeholder: "e.g. North America" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              {key === "description" ? (
                <textarea
                  value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                  placeholder={placeholder} rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
                />
              ) : (
                <input
                  value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={key === "title"}
                  placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
              {submitting ? "Posting..." : "Post Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
