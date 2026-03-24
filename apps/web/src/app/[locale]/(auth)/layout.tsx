export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center p-4">
      {/* Subtle vertical gold line decoration */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden lg:block" />
      {children}
    </div>
  );
}
