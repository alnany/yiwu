import { Navbar } from "@/components/layout/Navbar";

export default async function MainLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar locale={locale} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
