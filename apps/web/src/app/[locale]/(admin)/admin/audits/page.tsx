import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AuditQueue } from "@/components/features/AuditQueue";

export default async function AdminAuditsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: userData } = await supabase
    .from("users").select("role").eq("id", user.id).single();

  if (userData?.role !== "admin") redirect(`/${locale}/world-wall`);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="text-xs tracking-widest-luxury uppercase text-gold mb-2">Admin</p>
        <h1 className="font-display text-headline font-medium text-cream">Audit Management</h1>
        <p className="text-ink-400 text-sm mt-1 font-light">
          Review and approve manufacturer applications
        </p>
      </div>
      <AuditQueue locale={locale} />
    </div>
  );
}
