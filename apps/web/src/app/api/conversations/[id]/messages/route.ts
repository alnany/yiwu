import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("messages").select("*").eq("conversation_id", id).order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await supabase.from("messages").update({ is_read: true }).eq("conversation_id", id).neq("sender_id", user.id);
  return NextResponse.json({ messages: data });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { content, media_urls = [] } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });
  const { data, error } = await supabase.from("messages").insert({ conversation_id: id, sender_id: user.id, content, media_urls, is_read: false }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", id);
  return NextResponse.json(data, { status: 201 });
}
