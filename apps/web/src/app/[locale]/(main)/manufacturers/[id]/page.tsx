import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BadgeCheck, Globe, MapPin, Tag, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

export default async function ManufacturerPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("manufacturer_profiles")
    .select("*, user:users!user_id(id, role, status)")
    .eq("user_id", id)
    .single();

  if (!profile) notFound();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", id)
    .order("created_at", { ascending: false })
    .limit(12);

  const initial = profile.company_name.charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover */}
      <div className="h-44 bg-ink-800 border border-ink-700/50 overflow-hidden relative">
        {profile.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.cover_url} alt="" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink-700 to-ink-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
      </div>

      {/* Profile card */}
      <div className="bg-ink-800 border border-t-0 border-ink-700/50 px-8 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5 -mt-8 relative z-10">
          {/* Avatar */}
          <div className="w-16 h-16 bg-ink-700 border-2 border-ink-800 flex items-center justify-center font-display text-xl font-medium text-gold flex-shrink-0 overflow-hidden">
            {profile.avatar_url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={profile.avatar_url} alt={profile.company_name} className="w-full h-full object-cover" />
              : initial}
          </div>

          <div className="flex-1 pt-2 sm:pt-3">
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="font-display text-xl font-medium text-cream">{profile.company_name}</h1>
              {profile.is_verified && (
                <span className="flex items-center gap-1 border border-gold/40 text-gold text-xs px-2 py-0.5">
                  <BadgeCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-ink-500 flex-wrap">
              {profile.country && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {profile.city ? `${profile.city}, ` : ""}{profile.country}
                </span>
              )}
              {profile.website && (
                <a
                  href={profile.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-gold/60 hover:text-gold transition-colors"
                >
                  <Globe className="w-3 h-3" />{profile.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>

          <span className="text-xs border border-ink-600 text-ink-400 px-3 py-1 flex-shrink-0 mt-3 sm:mt-4">
            Manufacturer
          </span>
        </div>

        {profile.description && (
          <p className="mt-6 text-ink-300 text-sm leading-relaxed font-light max-w-2xl">
            {profile.description}
          </p>
        )}

        {(profile.tags?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-5">
            {profile.tags.map((tag: string) => (
              <span key={tag} className="flex items-center gap-1 border border-ink-600 text-ink-400 text-xs px-2.5 py-1">
                <Tag className="w-2.5 h-2.5" />{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Products / Posts grid */}
      <div className="mt-px">
        <div className="bg-ink-800 border border-ink-700/50 px-8 py-6">
          <h2 className="font-display text-base font-medium text-cream mb-6">
            Products &amp; Updates
            {posts && posts.length > 0 && (
              <span className="text-ink-500 font-normal text-sm ml-2">({posts.length})</span>
            )}
          </h2>

          {posts && posts.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-px bg-ink-700/20">
              {posts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/${locale}/world-wall/${post.id}`}
                  className="block bg-ink-800 group"
                >
                  {post.media_urls?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.media_urls[0]}
                      alt=""
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      className="w-full h-52 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <p className="text-sm text-ink-300 line-clamp-2 font-light leading-relaxed group-hover:text-cream transition-colors duration-200">
                      {post.content}
                    </p>
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.slice(0, 3).map((t: string) => (
                          <span key={t} className="text-xs text-ink-600">#{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-ink-600">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />{post.like_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />{post.comment_count}
                      </span>
                      <span className="ml-auto">{new Date(post.created_at).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-600 font-light py-8 text-center">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
