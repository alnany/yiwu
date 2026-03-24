import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: existing } = await supabase
    .from("post_likes")
    .select("id").eq("post_id", id).eq("user_id", user.id).single();

  if (existing) {
    await supabase.from("post_likes").delete().eq("post_id", id).eq("user_id", user.id);
    await supabase.from("posts").update({ like_count: supabase.rpc("posts_like_count_minus_1") }).eq("id", id);
  } else {
    await supabase.from("post_likes").insert({ post_id: id, user_id: user.id });
    await supabase.rpc("increment_post_likes", { post_id: id });
  }
  return NextResponse.json({ liked: !existing });
}
