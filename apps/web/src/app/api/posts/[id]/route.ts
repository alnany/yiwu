import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:users!author_id (
        id, role,
        manufacturer_profiles (company_name, is_verified, tags, description, country, avatar_url),
        designer_profiles (full_name, company, country, specialties, avatar_url)
      )
    `)
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  const enriched = {
    ...data,
    author_role: data.author?.role,
    author: data.author?.manufacturer_profiles?.[0] || data.author?.designer_profiles?.[0],
    author_id: data.author?.id,
  };

  return NextResponse.json(enriched);
}
