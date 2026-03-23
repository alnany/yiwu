import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "manufacturer";
  if (!q.trim()) return NextResponse.json({ results: [] });
  let results: any[] = [];
  if (type === "manufacturer") {
    const { data } = await supabase.from("manufacturer_profiles").select("*, user:users!user_id(id)")
      .or(`company_name.ilike.%${q}%,description.ilike.%${q}%`).eq("is_verified", true).limit(20);
    results = data || [];
  } else if (type === "rfp") {
    const { data } = await supabase.from("rfp_posts").select("*, designer:designer_profiles!designer_id(full_name, company)")
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`).eq("status", "open").limit(20);
    results = data || [];
  } else if (type === "post") {
    const { data } = await supabase.from("posts").select("*").ilike("content", `%${q}%`)
      .order("created_at", { ascending: false }).limit(20);
    results = data || [];
  }
  return NextResponse.json({ results, type, query: q });
}
