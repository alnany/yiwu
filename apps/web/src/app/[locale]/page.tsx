import { Link } from "@/i18n/navigation";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">易物</h1>
          <p className="text-xl mb-2 text-blue-100">Yi Wu</p>
          <p className="text-2xl font-light mb-8 text-blue-50">Connect with Verified Chinese Manufacturers</p>
          <p className="text-lg mb-10 text-blue-100 max-w-2xl mx-auto">
            The B2B social platform bridging verified Chinese manufacturers with overseas designers, architects, and retailers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">Get Started</Link>
            <Link href="/world-wall" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Explore World Wall</Link>
          </div>
        </div>
      </section>
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Yi Wu?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "✅", title: "Verified Manufacturers Only", desc: "Every manufacturer is on-site audited. No intermediaries." },
              { icon: "🌐", title: "Social-First Discovery", desc: "Browse the World Wall, follow manufacturers, discover products." },
              { icon: "💬", title: "Seamless Communication", desc: "Built-in chat with auto-translation (EN/ZH/ES/IT)." },
            ].map((f) => (
              <div key={f.title} className="text-center p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 text-gray-400 py-10 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xl font-bold text-white mb-2">易物 Yi Wu</p>
          <p className="mb-4">Connecting Chinese manufacturers with the world</p>
        </div>
      </footer>
    </main>
  );
}
