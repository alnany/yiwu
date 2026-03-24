"use client";
import { useState, use } from "react";
import { 搜索, BadgeCheck } from "lucide-react";
import Link from "next/link";

export default function DiscoverPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"manufacturer" | "rfp" | "post">("manufacturer");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, set搜索ed] = useState(false);

  async function handle搜索(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    set搜索ed(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`);
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs tracking-widest-luxury uppercase text-gold mb-2">搜索</p>
        <h1 className="font-display text-headline font-medium text-cream">发现</h1>
        <p className="text-ink-400 text-sm mt-1 font-light">
          搜索 manufacturers, projects, and posts
        </p>
      </div>

      {/* 搜索 bar */}
      <form onSubmit={handle搜索} className="flex gap-0 mb-6">
        <div className="flex-1 relative">
          <搜索 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索 manufacturers, projects, posts..."
            className="w-full pl-11 pr-4 py-3.5 bg-ink-800 border border-ink-600 border-r-0 text-cream text-sm focus:outline-none focus:border-gold placeholder-ink-600"
          />
        </div>
        <button
          type="submit"
          className="bg-gold text-ink-900 px-6 text-xs tracking-widest-luxury uppercase font-medium hover:bg-gold-light transition-colors duration-300"
        >
          搜索
        </button>
      </form>

      {/* Type filter */}
      <div className="flex gap-px mb-10 bg-ink-700/30">
        {(["manufacturer", "rfp", "post"] as const).map((t) => (
          <button
            key={t} onClick={() => setType(t)}
            className={`flex-1 py-2.5 text-xs tracking-wide-luxury uppercase transition-colors duration-200 ${
              type === t
                ? "bg-gold text-ink-900 font-medium"
                : "bg-ink-800 text-ink-400 hover:text-ink-200"
            }`}
          >
            {t === "manufacturer" ? "厂商" : t === "rfp" ? "项目" : "帖子"}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading && (
        <div className="text-center py-12 text-ink-400 text-sm tracking-wide">
          搜索ing...
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16 text-ink-500 border border-ink-700/50">
          <搜索 className="w-10 h-10 mx-auto mb-4 opacity-20" />
          <p className="text-sm">暂无结果： &quot;{query}&quot;</p>
          <p className="text-xs mt-1 text-ink-600">请尝试不同关键词</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-px">
          {results.map((r: any) => (
            <搜索Result key={r.id} result={r} type={type} locale={locale} />
          ))}
        </div>
      )}

      {!searched && (
        <div className="text-center py-20 border border-ink-800 text-ink-600">
          <p className="font-display text-lg text-ink-500">
            搜索 for verified manufacturers,<br />开放项目及更多
          </p>
        </div>
      )}
    </div>
  );
}

function 搜索Result({ result, type, locale }: { result: any; type: string; locale: string }) {
  if (type === "manufacturer") {
    return (
      <Link href={`/${locale}/manufacturers/${result.user?.id || result.user_id}`} className="block">
        <div className="bg-ink-800 border border-ink-700/50 hover:border-gold/30 transition-colors duration-300 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-ink-700 flex items-center justify-center text-gold font-display font-medium text-lg flex-shrink-0">
            {result.company_name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-cream text-sm">{result.company_name}</p>
              {result.is_verified && <BadgeCheck className="w-4 h-4 text-gold" />}
            </div>
            <p className="text-xs text-ink-400 mt-0.5">{result.country}</p>
            {(result.tags?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {result.tags.slice(0, 3).map((t: string) => (
                  <span key={t} className="text-xs border border-ink-600 text-ink-400 px-2 py-0.5">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          {result.is_verified && (
            <span className="text-xs border border-gold/40 text-gold px-3 py-1 flex-shrink-0 tracking-wide">
              Verified
            </span>
          )}
        </div>
      </Link>
    );
  }

  if (type === "rfp") {
    return (
      <Link href={`/${locale}/invitation-hall`} className="block">
        <div className="bg-ink-800 border border-ink-700/50 hover:border-gold/30 transition-colors duration-300 p-5">
          <div className="flex items-start justify-between">
            <p className="font-medium text-cream text-sm">{result.title}</p>
            <span className="text-xs border border-green-900 text-green-500 px-2 py-0.5 ml-2 flex-shrink-0">
              {result.status}
            </span>
          </div>
          <p className="text-xs text-ink-400 mt-2 line-clamp-2 font-light">{result.description}</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-ink-800 border border-ink-700/50 p-5">
      <p className="text-sm text-ink-200 font-light">{result.content}</p>
      <p className="text-xs text-ink-600 mt-2">{new Date(result.created_at).toLocaleDateString()}</p>
    </div>
  );
}
