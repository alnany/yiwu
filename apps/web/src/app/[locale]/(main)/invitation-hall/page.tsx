import { Suspense } from "react";
import { InvitationHallContent } from "@/components/features/InvitationHallContent";

export default async function InvitationHallPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div>
      <div className="mb-10">
        <p className="text-xs tracking-widest-luxury uppercase text-gold mb-2">Sourcing</p>
        <h1 className="font-display text-headline font-medium text-cream">Invitation Hall</h1>
        <p className="text-ink-400 text-sm mt-1 font-light">
          Post project needs or find manufacturing opportunities
        </p>
      </div>
      <Suspense
        fallback={
          <div className="text-center py-12 text-ink-500 text-sm tracking-wide">
            Loading...
          </div>
        }
      >
        <InvitationHallContent locale={locale} />
      </Suspense>
    </div>
  );
}
