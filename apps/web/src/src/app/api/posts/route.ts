import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = req.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "20");
  const cursor = searchParams.get("cursor");

  let query = supabase
    .from("posts")
    .select(`
      *,
      author:users!author_id (
        id, role,
        manufacturer_profiles (company_name, is_verified, tags, avatar_url),
        designer_profiles (full_name, company, avatar_url)
      )
    `)
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const hasMore = data.length > limit;
  const posts = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore ? posts[posts.length - 1].created_at : null;

  const enriched = posts.map((p: any) => ({
    ...p,
    author_role: p.author?.role,
    author: p.author?.manufacturer_profiles?.[0] || p.author?.designer_profiles?.[0],
  }));

  return NextResponse.json({ posts: enriched, next_cursor: nextCursor });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { content, media_urls = [], tags = [], lang = "en" } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ author_id: user.id, content, media_urls, tags, lang })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
