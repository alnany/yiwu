import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BadgeCheck, LogOut } from "lucide-react";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/login`);

  const { data: userData } = await supabase
    .from("users")
    .select("*, manufacturer_profiles(*), designer_profiles(*)")
    .eq("id", user.id)
    .single();

  const profile = userData?.manufacturer_profiles?.[0] || userData?.designer_profiles?.[0];
  const isManufacturer = userData?.role === "manufacturer";
  const name = isManufacturer
    ? (profile as any)?.company_name
    : (profile as any)?.full_name;
  const initial = (name || user.email || "?").charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Profile card */}
      <div className="bg-ink-800 border border-ink-700/50">
        {/* Header bar */}
        <div className="h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <div className="p-8">
          {/* Identity */}
          <div className="flex items-start gap-6 mb-10">
            <div className="w-16 h-16 bg-ink-700 border border-ink-600 flex items-center justify-center font-display text-2xl font-medium text-gold flex-shrink-0">
              {initial}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-xl font-medium text-cream">
                  {name || user.email}
                </h1>
                {isManufacturer && (profile as any)?.is_verified && (
                  <BadgeCheck className="w-5 h-5 text-gold" />
                )}
              </div>
              <p className="text-xs tracking-wide-luxury uppercase text-gold/70 mb-1">
                {userData?.role}
              </p>
              <p className="text-xs text-ink-500">{user.email}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-px">
            <a
              href={`/${locale}/${isManufacturer ? "manufacturers" : "designers"}/${user.id}`}
              className="flex items-center justify-between p-4 border border-ink-700/50 hover:border-gold/30 hover:bg-ink-700/30 transition-all duration-300 group"
            >
              <span className="text-sm text-ink-200 font-light">View public profile</span>
              <span className="text-gold/50 group-hover:text-gold transition-colors duration-300">→</span>
            </a>

            {userData?.role === "admin" && (
              <a
                href={`/${locale}/admin/audits`}
                className="flex items-center justify-between p-4 border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors duration-300 group"
              >
                <span className="text-sm text-gold font-light">Audit Management</span>
                <span className="text-gold/50 group-hover:text-gold transition-colors duration-300">→</span>
              </a>
            )}

            <form action={`/api/auth/signout`} method="POST">
              <button
                type="submit"
                className="w-full flex items-center justify-between p-4 border border-ink-700/50 hover:border-red-900/50 text-ink-400 hover:text-red-400 transition-all duration-300"
              >
                <span className="text-sm font-light flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
