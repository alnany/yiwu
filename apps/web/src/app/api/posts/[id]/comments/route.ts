import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("post_comments")
    .select(`
      id, content, created_at, parent_id,
      author:users!author_id (
        id, role,
        manufacturer_profiles (company_name, is_verified, avatar_url),
        designer_profiles (full_name, avatar_url)
      )
    `)
    .eq("post_id", id)
    .is("parent_id", null)
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const enriched = (data || []).map((c: any) => ({
    ...c,
    author_role: c.author?.role,
    author_name:
      c.author?.manufacturer_profiles?.[0]?.company_name ||
      c.author?.designer_profiles?.[0]?.full_name ||
      "用户",
    author_id: c.author?.id,
    is_verified: c.author?.manufacturer_profiles?.[0]?.is_verified || false,
    avatar_url:
      c.author?.manufacturer_profiles?.[0]?.avatar_url ||
      c.author?.designer_profiles?.[0]?.avatar_url ||
      null,
  }));

  return NextResponse.json({ comments: enriched });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, parent_id } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });
  if (content.length > 1000) return NextResponse.json({ error: "Comment too long" }, { status: 400 });

  const { data, error } = await supabase
    .from("post_comments")
    .insert({ post_id: id, author_id: user.id, content: content.trim(), parent_id: parent_id || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.rpc("increment_comment_count", { p_post_id: id });

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;
  const { comment_id } = await req.json();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("post_comments")
    .delete()
    .eq("id", comment_id)
    .eq("author_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.rpc("decrement_comment_count", { p_post_id: postId });
  return NextResponse.json({ ok: true });
}
