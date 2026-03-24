import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BadgeCheck, Globe, MapPin, Tag } from "lucide-react";

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
    .limit(6);

  const { data: audits } = await supabase
    .from("audits")
    .select("status, result, completed_at")
    .eq("manufacturer_id", id)
    .order("created_at", { ascending: false })
    .limit(1);

  const audit = audits?.[0];
  const initial = profile.company_name.charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover */}
      <div className="h-40 bg-ink-800 border border-ink-700/50 overflow-hidden relative">
        {profile.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.cover_url} alt="" className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
      </div>

      {/* Profile card */}
      <div className="bg-ink-800 border border-t-0 border-ink-700/50 px-8 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5 -mt-8 relative z-10">
          {/* Avatar */}
          <div className="w-16 h-16 bg-ink-700 border-2 border-ink-800 flex items-center justify-center font-display text-xl font-medium text-gold flex-shrink-0">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> // eslint-disable-line
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
              {!profile.is_verified && audit?.status === "pending" && (
                <span className="border border-gold/20 text-gold/60 text-xs px-2 py-0.5">
                  Pending Verification
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

          <a
            href={`/${locale}/messages?contact=${id}`}
            className="bg-gold text-ink-900 px-5 py-2.5 text-xs tracking-widest-luxury uppercase font-medium hover:bg-gold-light transition-colors duration-300 flex-shrink-0 mt-3 sm:mt-4"
          >
            Send Message
          </a>
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

      {/* Posts */}
      <div className="mt-px">
        <div className="bg-ink-800 border border-ink-700/50 px-8 py-6">
          <h2 className="font-display text-base font-medium text-cream mb-6">Recent Posts</h2>
          {posts && posts.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-px bg-ink-700/30">
              {posts.map((post: any) => (
                <div key={post.id} className="bg-ink-800 p-5">
                  <p className="text-sm text-ink-300 line-clamp-3 font-light leading-relaxed">
                    {post.content}
                  </p>
                  {post.media_urls?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.media_urls[0]} alt=""
                      className="mt-3 w-full h-40 object-cover"
                    />
                  )}
                  <p className="text-xs text-ink-600 mt-3">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-600 font-light">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
