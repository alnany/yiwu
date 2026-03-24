import { Suspense } from "react";
import { WorldWallFeed } from "@/components/features/WorldWallFeed";
import { CreatePostBox } from "@/components/features/CreatePostBox";

export default async function WorldWallPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-xs tracking-widest-luxury uppercase text-gold mb-2">社区</p>
        <h1 className="font-display text-headline font-medium text-cream">世界墙</h1>
        <p className="text-ink-400 text-sm mt-1 font-light">
          发现认证厂商与设计师的最新动态
        </p>
      </div>
      <CreatePostBox locale={locale} />
      <Suspense
        fallback={
          <div className="text-center py-12 text-ink-500 text-sm tracking-wide">
            加载中...
          </div>
        }
      >
        <WorldWallFeed locale={locale} />
      </Suspense>
    </div>
  );
}
