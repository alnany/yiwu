import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Globe } from "lucide-react";

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

  const { data: rfps } = await supabase
    .from("rfp_posts")
    .select("*")
    .eq("designer_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const initial = profile.full_name.charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile card */}
      <div className="bg-ink-800 border border-ink-700/50 p-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-ink-700 flex items-center justify-center font-display text-xl font-medium text-gold flex-shrink-0">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> // eslint-disable-line
              : initial}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-xl font-medium text-cream mb-1">{profile.full_name}</h1>
            {profile.company && (
              <p className="text-xs text-ink-400 mb-2">{profile.company}</p>
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
          <a
            href={`/${locale}/messages?contact=${id}`}
            className="bg-gold text-ink-900 px-5 py-2.5 text-xs tracking-widest-luxury uppercase font-medium hover:bg-gold-light transition-colors duration-300 flex-shrink-0"
          >
            Send Message
          </a>
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

      {/* Open Projects */}
      {rfps && rfps.length > 0 && (
        <div className="mt-px">
          <div className="bg-ink-800 border border-ink-700/50 px-8 py-6">
            <h2 className="font-display text-base font-medium text-cream mb-6">Open Projects</h2>
            <div className="space-y-px">
              {rfps.map((rfp: any) => (
                <a
                  key={rfp.id}
                  href={`/${locale}/invitation-hall`}
                  className="block bg-ink-900 border border-ink-700/50 hover:border-gold/30 transition-colors duration-300 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-cream text-sm">{rfp.title}</h3>
                      <p className="text-xs text-ink-400 mt-1 line-clamp-2 font-light">
                        {rfp.description}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 flex-shrink-0 border ${
                      rfp.status === "open"
                        ? "border-green-900 text-green-500"
                        : "border-ink-600 text-ink-500"
                    }`}>
                      {rfp.status}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
