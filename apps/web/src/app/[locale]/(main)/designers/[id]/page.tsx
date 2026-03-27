import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Globe, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

export default async function DesignerPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("designer_profiles")
    .select("*")
    .eq("user_id", id)
    .single();

  if (!profile) notFound();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", id)
    .order("created_at", { ascending: false })
    .limit(12);

  const initial = profile.full_name.charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile card */}
      <div className="bg-ink-800 border border-ink-700/50 p-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-ink-700 border border-ink-600 flex items-center justify-center font-display text-xl font-medium text-gold flex-shrink-0 overflow-hidden">
            {profile.avatar_url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              : initial}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-xl font-medium text-cream mb-1">{profile.full_name}</h1>
            {profile.company && (
              <p className="text-xs text-ink-400 mb-2 uppercase tracking-wide">{profile.company}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-ink-500 flex-wrap">
              {profile.country && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{profile.country}
                </span>
              )}
              {profile.portfolio_url && (
                <a
                  href={profile.portfolio_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-gold/60 hover:text-gold transition-colors"
                >
                  <Globe className="w-3 h-3" />Portfolio
                </a>
              )}
            </div>
          </div>
          <span className="text-xs border border-ink-600 text-ink-400 px-3 py-1 flex-shrink-0">
            Interior Designer
          </span>
        </div>

        {(profile.specialties?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-6">
            {profile.specialties.map((s: string) => (
              <span key={s} className="border border-ink-600 text-ink-400 text-xs px-2.5 py-1">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Posts grid */}
      <div className="mt-px">
        <div className="bg-ink-800 border border-ink-700/50 px-8 py-6">
          <h2 className="font-display text-base font-medium text-cream mb-6">
            Work
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
