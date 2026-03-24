"use client";
import { useState, useEffect, use } from "react";
import { Search, BadgeCheck } from "lucide-react";
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
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`);
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Discover</h1>
        <p className="text-gray-500 text-sm">Search manufacturers, projects, and posts</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search manufacturers, projects, posts..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
          Search
        </button>
      </form>

      {/* Type filter */}
      <div className="flex gap-2 mb-6">
        {(["manufacturer", "rfp", "post"] as const).map((t) => (
          <button
            key={t} onClick={() => setType(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              type === t ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
            }`}
          >
            {t === "manufacturer" ? "🏭 Manufacturers" : t === "rfp" ? "📋 Projects" : "📝 Posts"}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading && <div className="text-center py-12 text-gray-500">Searching...</div>}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No results for &quot;{query}&quot;</p>
          <p className="text-sm mt-1">Try different keywords or category</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-3">
          {results.map((r: any) => (
            <SearchResult key={r.id} result={r} type={type} locale={locale} />
          ))}
        </div>
      )}

      {!searched && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg">Search for verified manufacturers, open projects, and more</p>
        </div>
      )}
    </div>
  );
}

function SearchResult({ result, type, locale }: { result: any; type: string; locale: string }) {
  if (type === "manufacturer") {
    return (
      <Link href={`/${locale}/manufacturers/${result.user?.id || result.user_id}`} className="block">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600 flex-shrink-0">
            {result.company_name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">{result.company_name}</p>
              {result.is_verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
            </div>
            <p className="text-sm text-gray-500 truncate">{result.country}</p>
            {(result.tags?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {result.tags.slice(0, 3).map((t: string) => (
                  <span key={t} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{t}</span>
                ))}
              </div>
            )}
          </div>
          {result.is_verified && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium flex-shrink-0">Verified</span>
          )}
        </div>
      </Link>
    );
  }

  if (type === "rfp") {
    return (
      <Link href={`/${locale}/invitation-hall`} className="block">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-4">
          <div className="flex items-start justify-between">
            <p className="font-semibold text-gray-900">{result.title}</p>
            <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">{result.status}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{result.description}</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <p className="text-sm text-gray-700">{result.content}</p>
      <p className="text-xs text-gray-400 mt-2">{new Date(result.created_at).toLocaleDateString()}</p>
    </div>
  );
}
