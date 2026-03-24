import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("conversations")
    .select("*, messages(id, content, created_at, is_read, sender_id)")
    .contains("participant_ids", [user.id])
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const enriched = (data || []).map((c: any) => ({
    ...c,
    last_message: c.messages?.[c.messages.length - 1],
    unread_count: c.messages?.filter((m: any) => !m.is_read && m.sender_id !== user.id).length || 0,
  }));

  return NextResponse.json({ conversations: enriched });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { other_user_id } = await req.json();

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .contains("participant_ids", [user.id, other_user_id])
    .single();

  if (existing) return NextResponse.json(existing);

  const { data, error } = await supabase
    .from("conversations")
    .insert({ participant_ids: [user.id, other_user_id] })
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
