import { Navbar } from "@/components/layout/Navbar";

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar locale={locale} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        {children}
      </main>
    </div>
  );
}
