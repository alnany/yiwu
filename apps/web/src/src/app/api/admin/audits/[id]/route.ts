import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (userData?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { result, notes, status: auditStatus } = body;

  const { data: auditData, error: auditError } = await supabase
    .from("audits")
    .update({ status: auditStatus, result, notes, auditor_id: user.id, completed_at: new Date().toISOString() })
    .eq("id", id)
    .select("manufacturer_id")
    .single();

  if (auditError) return NextResponse.json({ error: auditError.message }, { status: 500 });

  if (result === "pass" && auditData?.manufacturer_id) {
    await supabase
      .from("manufacturer_profiles")
      .update({ is_verified: true, verified_at: new Date().toISOString() })
      .eq("user_id", auditData.manufacturer_id);

    await supabase
      .from("users")
      .update({ status: "active" })
      .eq("id", auditData.manufacturer_id);
  }

  return NextResponse.json({ success: true });
}
