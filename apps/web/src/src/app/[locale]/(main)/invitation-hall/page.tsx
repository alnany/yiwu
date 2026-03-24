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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invitation Hall</h1>
          <p className="text-gray-500 text-sm mt-1">Post project needs or find manufacturing opportunities</p>
        </div>
      </div>
      <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading...</div>}>
        <InvitationHallContent locale={locale} />
      </Suspense>
    </div>
  );
}
