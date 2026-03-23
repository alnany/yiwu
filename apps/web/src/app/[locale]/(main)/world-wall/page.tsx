import { Suspense } from "react";
import { WorldWallFeed } from "@/components/features/WorldWallFeed";
import { CreatePostBox } from "@/components/features/CreatePostBox";

export default async function WorldWallPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">World Wall</h1>
        <p className="text-gray-500 text-sm mt-1">Discover the latest from verified manufacturers and designers</p>
      </div>
      <CreatePostBox locale={locale} />
      <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading feed...</div>}>
        <WorldWallFeed locale={locale} />
      </Suspense>
    </div>
  );
}
