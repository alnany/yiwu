"use client";
import { useState, useEffect } from "react";
import { Audit } from "@/types";
import { CheckCircle, XCircle, Clock, Eye, ChevronDown } from "lucide-react";

interface Props { locale: string; }

export function AuditQueue({ locale }: Props) {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [filter, setFilter] = useState<"pending" | "completed" | "all">("pending");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { fetchAudits(); }, [filter]);

  async function fetchAudits() {
    setLoading(true);
    const res = await fetch(`/api/admin/audits?status=${filter}`);
    const data = await res.json();
    setAudits(data.audits || []);
    setLoading(false);
  }

  async function updateAudit(id: string, result: "pass" | "fail", notes: string) {
    await fetch(`/api/admin/audits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result, notes, status: "completed" }),
    });
    fetchAudits();
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["pending", "completed", "all"] as const).map((f) => (
          <button
            key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading audits...</div>
      ) : audits.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
          <p>No {filter} audits</p>
        </div>
      ) : (
        <div className="space-y-3">
          {audits.map((audit) => (
            <AuditRow key={audit.id} audit={audit} locale={locale} onUpdate={updateAudit} expanded={expandedId === audit.id} onToggle={() => setExpandedId(expandedId === audit.id ? null : audit.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function AuditRow({ audit, locale, onUpdate, expanded, onToggle }: {
  audit: Audit; locale: string; onUpdate: (id: string, r: "pass"|"fail", n: string) => void; expanded: boolean; onToggle: () => void;
}) {
  const [notes, setNotes] = useState(audit.notes || "");
  const manufacturer = audit.manufacturer as any;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={onToggle}>
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
          {manufacturer?.company_name?.charAt(0) || "M"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{manufacturer?.company_name || audit.manufacturer_id}</p>
          <p className="text-xs text-gray-400">{manufacturer?.country} · Applied {new Date(audit.id).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <AuditStatusBadge status={audit.status} result={audit.result} />
          <ChevronDown className={`w-4 h-4 text-gray-400 transition ${expanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-4">
          {manufacturer?.description && (
            <p className="text-sm text-gray-600 mb-4">{manufacturer.description}</p>
          )}
          {(manufacturer?.tags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {manufacturer.tags.map((t: string) => (
                <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
              rows={2} placeholder="Add audit notes..."
            />
          </div>
          {audit.status !== "completed" && (
            <div className="flex gap-3">
              <button
                onClick={() => onUpdate(audit.id, "fail", notes)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={() => onUpdate(audit.id, "pass", notes)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
              >
                <CheckCircle className="w-4 h-4" /> Approve & Verify
              </button>
              <a
                href={`/${locale}/manufacturers/${audit.manufacturer_id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition ml-auto"
              >
                <Eye className="w-4 h-4" /> View Profile
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AuditStatusBadge({ status, result }: { status: string; result?: string }) {
  if (status === "completed" && result === "pass") return <span className="flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium"><CheckCircle className="w-3 h-3" />Approved</span>;
  if (status === "completed" && result === "fail") return <span className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium"><XCircle className="w-3 h-3" />Rejected</span>;
  return <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full font-medium"><Clock className="w-3 h-3" />Pending</span>;
}
