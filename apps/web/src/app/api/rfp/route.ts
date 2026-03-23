import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") || "open";
  const { data, error } = await supabase.from("rfp_posts")
    .select(`*, designer:designer_profiles!designer_id(full_name, company, avatar_url, country)`)
    .eq("status", status).order("created_at", { ascending: false }).limit(20);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rfps: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, description, product_categories = [], budget_range, timeline, target_region } = await req.json();
  if (!title?.trim() || !description?.trim()) return NextResponse.json({ error: "Title and description required" }, { status: 400 });
  const { data: profile } = await supabase.from("designer_profiles").select("id").eq("user_id", user.id).single();
  if (!profile) return NextResponse.json({ error: "Designer profile required" }, { status: 403 });
  const { data, error } = await supabase.from("rfp_posts").insert({ designer_id: profile.id, title, description, product_categories, budget_range, timeline, target_region }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
