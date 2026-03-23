import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BadgeCheck, Globe, MapPin, Tag } from "lucide-react";

export default async function ManufacturerPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase.from("manufacturer_profiles").select("*, user:users!user_id(id, role, status)").eq("user_id", id).single();
  if (!profile) notFound();
  const { data: posts } = await supabase.from("posts").select("*").eq("author_id", id).order("created_at", { ascending: false }).limit(6);
  return (
    <div className="max-w-4xl mx-auto">
      <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl overflow-hidden">
        {profile.cover_url && <img src={profile.cover_url} alt="" className="w-full h-full object-cover" />}
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 -mt-8 mx-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="w-20 h-20 rounded-xl bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 border-4 border-white shadow -mt-14">
            {profile.company_name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{profile.company_name}</h1>
              {profile.is_verified && <span className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full"><BadgeCheck className="w-3.5 h-3.5" /> Verified</span>}
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 flex-wrap">
              {profile.country && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.country}</span>}
              {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline"><Globe className="w-3.5 h-3.5" />{profile.website.replace(/^https?:\/\//, "")}</a>}
            </div>
          </div>
          <a href={`/${locale}/messages?contact=${id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex-shrink-0">Send Message</a>
        </div>
        {profile.description && <p className="mt-4 text-gray-600 text-sm leading-relaxed">{profile.description}</p>}
        {profile.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.tags.map((tag: string) => <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full"><Tag className="w-3 h-3" />{tag}</span>)}
          </div>
        )}
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Posts</h2>
        {posts?.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {posts.map((post: any) => (
              <div key={post.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-gray-400">No posts yet.</p>}
      </div>
    </div>
  );
}
