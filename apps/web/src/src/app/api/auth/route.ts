import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });

  const { data: profile } = await supabase
    .from("users")
    .select("*, manufacturer_profiles(*), designer_profiles(*)")
    .eq("id", user.id)
    .single();

  return NextResponse.json({ user: { ...user, profile } });
}
