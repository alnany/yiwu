import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Globe } from "lucide-react";

export default async function DesignerPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase.from("designer_profiles").select("*").eq("user_id", id).single();
  if (!profile) notFound();
  const { data: rfps } = await supabase.from("rfp_posts").select("*").eq("designer_id", profile.id).order("created_at", { ascending: false }).limit(5);
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-3xl font-bold text-purple-600">
            {profile.full_name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
            {profile.company && <p className="text-gray-500">{profile.company}</p>}
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              {profile.country && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.country}</span>}
              {profile.portfolio_url && <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline"><Globe className="w-3.5 h-3.5" />Portfolio</a>}
            </div>
          </div>
          <a href={`/${locale}/messages?contact=${id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">Send Message</a>
        </div>
        {profile.specialties?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {profile.specialties.map((s: string) => <span key={s} className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-full font-medium">{s}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}
