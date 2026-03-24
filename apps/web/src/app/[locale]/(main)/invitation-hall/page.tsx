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
        <p className="text-xs tracking-widest-luxury uppercase text-gold mb-2">采购</p>
        <h1 className="font-display text-headline font-medium text-cream">邀请大厅</h1>
        <p className="text-ink-400 text-sm mt-1 font-light">
          发布项目需求或寻找合作机会
        </p>
      </div>
      <Suspense
        fallback={
          <div className="text-center py-12 text-ink-500 text-sm tracking-wide">
            加载中...
          </div>
        }
      >
        <InvitationHallContent locale={locale} />
      </Suspense>
    </div>
  );
}
