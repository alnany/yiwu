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
      <div className="flex gap-px mb-8 bg-ink-700/30">
        {(["pending", "completed", "all"] as const).map((f) => (
          <button
            key={f} onClick={() => setFilter(f)}
            className={`flex-1 py-2.5 text-xs tracking-wide-luxury uppercase transition-colors duration-200 ${
              filter === f
                ? "bg-gold text-ink-900 font-medium"
                : "bg-ink-800 text-ink-400 hover:text-ink-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-ink-500 text-xs tracking-wide-luxury uppercase">
          Loading audits...
        </div>
      ) : audits.length === 0 ? (
        <div className="text-center py-20 border border-ink-800">
          <CheckCircle className="w-8 h-8 mx-auto mb-3 text-ink-600" />
          <p className="text-ink-500 text-sm">No {filter} audits</p>
        </div>
      ) : (
        <div className="space-y-px">
          {audits.map((audit) => (
            <AuditRow
              key={audit.id} audit={audit} locale={locale} onUpdate={updateAudit}
              expanded={expandedId === audit.id}
              onToggle={() => setExpandedId(expandedId === audit.id ? null : audit.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AuditRow({
  audit, locale, onUpdate, expanded, onToggle,
}: {
  audit: Audit; locale: string;
  onUpdate: (id: string, r: "pass" | "fail", n: string) => void;
  expanded: boolean; onToggle: () => void;
}) {
  const [notes, setNotes] = useState(audit.notes || "");
  const manufacturer = audit.manufacturer as any;
  const initial = (manufacturer?.company_name || "M").charAt(0).toUpperCase();

  return (
    <div className="bg-ink-800 border border-ink-700/50 overflow-hidden">
      {/* Row header */}
      <div
        className="p-5 flex items-center gap-4 cursor-pointer hover:bg-ink-700/30 transition-colors duration-200"
        onClick={onToggle}
      >
        <div className="w-10 h-10 bg-ink-700 flex items-center justify-center text-gold font-display font-medium text-sm flex-shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-cream text-sm">
            {manufacturer?.company_name || audit.manufacturer_id}
          </p>
          <p className="text-xs text-ink-500 mt-0.5">
            {manufacturer?.country}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AuditStatusBadge status={audit.status} result={audit.result} />
          <ChevronDown
            className={`w-4 h-4 text-ink-500 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-ink-700/50 pt-5">
          {manufacturer?.description && (
            <p className="text-sm text-ink-300 mb-4 font-light leading-relaxed">
              {manufacturer.description}
            </p>
          )}
          {(manufacturer?.tags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {manufacturer.tags.map((t: string) => (
                <span key={t} className="text-xs border border-ink-600 text-ink-400 px-2 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-xs tracking-wide-luxury uppercase text-ink-500 mb-2">
              Audit Notes
            </label>
            <textarea
              value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-ink-900 border border-ink-600 text-cream text-sm px-4 py-3 focus:outline-none focus:border-gold resize-none placeholder-ink-600"
              rows={2} placeholder="Add audit notes..."
            />
          </div>

          {audit.status !== "completed" && (
            <div className="flex gap-px">
              <button
                onClick={() => onUpdate(audit.id, "fail", notes)}
                className="flex items-center gap-2 px-5 py-2.5 border border-red-900 text-red-500 text-xs font-medium hover:bg-red-950/30 transition-colors duration-200"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>
              <button
                onClick={() => onUpdate(audit.id, "pass", notes)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gold text-ink-900 text-xs font-medium hover:bg-gold-light transition-colors duration-200"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Approve & Verify
              </button>
              <a
                href={`/${locale}/manufacturers/${audit.manufacturer_id}`}
                className="flex items-center gap-2 px-5 py-2.5 border border-ink-600 text-ink-400 text-xs hover:text-cream hover:border-ink-400 transition-colors duration-200 ml-auto"
              >
                <Eye className="w-3.5 h-3.5" />
                View Profile
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AuditStatusBadge({ status, result }: { status: string; result?: string }) {
  if (status === "completed" && result === "pass") {
    return (
      <span className="flex items-center gap-1 text-xs border border-green-900 text-green-500 px-2 py-0.5">
        <CheckCircle className="w-3 h-3" />Approved
      </span>
    );
  }
  if (status === "completed" && result === "fail") {
    return (
      <span className="flex items-center gap-1 text-xs border border-red-900 text-red-500 px-2 py-0.5">
        <XCircle className="w-3 h-3" />Rejected
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs border border-gold/40 text-gold/80 px-2 py-0.5">
      <Clock className="w-3 h-3" />Pending
    </span>
  );
}
