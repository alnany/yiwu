import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BadgeCheck, Settings, LogOut } from "lucide-react";

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
  const name = isManufacturer ? (profile as any)?.company_name : (profile as any)?.full_name;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
            {name?.charAt(0) || user.email?.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{name || user.email}</h1>
              {isManufacturer && (profile as any)?.is_verified && (
                <BadgeCheck className="w-6 h-6 text-blue-500" />
              )}
            </div>
            <p className="text-gray-500 capitalize">{userData?.role}</p>
            <p className="text-sm text-gray-400 mt-1">{user.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <a href={`/${locale}/${isManufacturer ? "manufacturers" : "designers"}/${user.id}`}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
            <span className="font-medium text-gray-700">View my public profile</span>
            <span className="text-gray-400">→</span>
          </a>
          {userData?.role === "admin" && (
            <a href={`/${locale}/admin/audits`}
              className="flex items-center justify-between p-4 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition">
              <span className="font-medium text-blue-700">Audit Management</span>
              <span className="text-blue-400">→</span>
            </a>
          )}
          <form action={`/api/auth/signout`} method="POST">
            <button type="submit"
              className="w-full flex items-center justify-between p-4 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition">
              <span className="font-medium flex items-center gap-2"><LogOut className="w-4 h-4" />Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
