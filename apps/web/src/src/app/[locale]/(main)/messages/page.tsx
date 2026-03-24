import { ChatInterface } from "@/components/features/ChatInterface";

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ChatInterface locale={locale} />;
}
