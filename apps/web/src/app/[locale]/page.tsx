import { Link } from "@/i18n/navigation";

// ── Product showcase data ──────────────────────────────────────
// In production these will be fetched from /api/posts and /api/manufacturers
// For now using curated Unsplash images representing the Yi Wu product categories
const showcaseItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85&auto=format",
    category: "Furniture",
    title: "Sculptural Lounge Chair",
    maker: "Guangzhou Artform Studio",
    type: "manufacturer" as const,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&q=85&auto=format",
    category: "Ceramics",
    title: "Matte Stoneware Collection",
    maker: "Studio Haze × Jingdezhen Works",
    type: "collab" as const,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=85&auto=format",
    category: "Lighting",
    title: "Woven Rattan Pendant",
    maker: "Foshan Light Craft Co.",
    type: "manufacturer" as const,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85&auto=format",
    category: "Textiles",
    title: "Linen & Silk Throw",
    maker: "Maison Dore × Suzhou Silk Mill",
    type: "collab" as const,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=85&auto=format",
    category: "Tableware",
    title: "Obsidian Dinnerware Set",
    maker: "Tangshan Porcelain Works",
    type: "manufacturer" as const,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=800&q=85&auto=format",
    category: "Accessories",
    title: "Marble & Brass Vessel",
    maker: "Form & Matter Studio",
    type: "collab" as const,
  },
];

const stats = [
  { value: "1,200+", label: "Verified Manufacturers" },
  { value: "48",     label: "Countries Sourcing" },
  { value: "94%",    label: "Audit Pass Rate" },
  { value: "4",      label: "Languages" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ink-900 text-cream">
      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-ink-900/90 backdrop-blur-md border-b border-ink-700/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          <Link href="/" className="font-display text-xl font-medium text-cream tracking-wide">
            易物 <span className="text-gold text-sm font-sans font-light tracking-widest-luxury ml-1">YI WU</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "/en/discover",         label: "Discover" },
              { href: "/en/world-wall",        label: "World Wall" },
              { href: "/en/invitation-hall",   label: "Invitation Hall" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link text-xs tracking-wide-luxury uppercase text-ink-300 hover:text-cream transition-colors duration-300"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs tracking-wide-luxury uppercase text-ink-300 hover:text-cream transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-xs tracking-wide-luxury uppercase bg-gold text-ink-900 px-5 py-2.5 hover:bg-gold-light transition-colors duration-300"
            >
              Apply
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?w=1800&q=90&auto=format')`,
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-ink-900/75" />
        {/* Subtle gold gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-ink-900 to-transparent" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Eyebrow */}
          <p className="text-xs tracking-widest-luxury uppercase text-gold mb-8 font-light">
            The B2B Platform for Verified Chinese Manufacturing
          </p>

          {/* Main headline */}
          <h1 className="font-display text-display-lg lg:text-display-xl font-medium text-cream mb-6 leading-none">
            Where Craft<br />
            <em className="text-gold not-italic">Meets</em> Vision
          </h1>

          {/* Sub */}
          <p className="text-base lg:text-lg text-ink-200 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            Yi Wu connects the world's best designers and architects
            directly with China's verified manufacturers — no agents,
            no middlemen, no compromise.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 bg-gold text-ink-900 px-10 py-4 text-xs tracking-widest-luxury uppercase font-medium hover:bg-gold-light transition-all duration-300"
            >
              Start Sourcing
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
            <Link
              href="/world-wall"
              className="inline-flex items-center gap-3 border border-ink-400 text-cream px-10 py-4 text-xs tracking-widest-luxury uppercase font-light hover:border-gold hover:text-gold transition-all duration-300"
            >
              Explore Showcase
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold/60" />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-ink-800 border-y border-ink-700/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-medium text-gold mb-1">{s.value}</p>
              <p className="text-xs tracking-wide-luxury uppercase text-ink-300">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Product Showcase ── */}
      <section className="py-28 px-6 lg:px-12 bg-ink-900">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest-luxury uppercase text-gold mb-4">Curated Collection</p>
            <h2 className="font-display text-display font-medium text-cream mb-4">
              Designers &amp; Manufacturers,<br />
              <em className="text-ink-300 not-italic">Crafting the Future</em>
            </h2>
            <p className="text-ink-300 font-light max-w-lg mx-auto text-sm leading-relaxed">
              From sculptural furniture to precision ceramics — discover the work
              being made when visionary designers meet verified Chinese factories.
            </p>
          </div>

          {/* Showcase grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-700/30">
            {showcaseItems.map((item) => (
              <div key={item.id} className="showcase-card group relative overflow-hidden bg-ink-800 cursor-pointer hover-lift">
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-ink-900/40 group-hover:bg-ink-900/20 transition-colors duration-500" />
                  {/* Category badge */}
                  <span className="absolute top-4 left-4 text-xs tracking-widest-luxury uppercase text-gold bg-ink-900/70 px-3 py-1 backdrop-blur-sm">
                    {item.category}
                  </span>
                  {/* Type badge */}
                  <span className={`absolute top-4 right-4 text-xs tracking-wide uppercase px-3 py-1 ${
                    item.type === "collab"
                      ? "bg-gold/90 text-ink-900"
                      : "bg-ink-700/80 text-cream backdrop-blur-sm"
                  }`}>
                    {item.type === "collab" ? "Collab" : "Manufacturer"}
                  </span>
                </div>

                {/* Card content */}
                <div className="p-6 border-t border-ink-700/50">
                  <h3 className="font-display text-lg font-medium text-cream mb-1 group-hover:text-gold transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs text-ink-400 tracking-wide">{item.maker}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-14">
            <Link
              href="/discover"
              className="inline-flex items-center gap-3 border border-gold/50 text-gold px-10 py-4 text-xs tracking-widest-luxury uppercase hover:bg-gold hover:text-ink-900 transition-all duration-300"
            >
              View Full Collection
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Platform Value ── */}
      <section className="py-28 px-6 lg:px-12 bg-cream-dark text-ink-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest-luxury uppercase text-gold-dark mb-4">Why Yi Wu</p>
            <h2 className="font-display text-display font-medium text-ink-900">
              A Platform Built on Trust
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                num: "01",
                title: "On-Site Verified",
                body: "Every manufacturer on Yi Wu passes a rigorous factory audit. No traders. No agents. Direct access to the source.",
              },
              {
                num: "02",
                title: "Social-First Discovery",
                body: "Browse the World Wall, follow makers, study their work — before you ever send a message. Research like a creative, source like a professional.",
              },
              {
                num: "03",
                title: "Borderless Communication",
                body: "Built-in real-time translation across EN, ZH, ES, and IT. Your ideas, their craftsmanship — no language barrier.",
              },
            ].map((v) => (
              <div key={v.num} className="group">
                <div className="font-display text-5xl font-medium text-gold/30 group-hover:text-gold/60 transition-colors duration-500 mb-6">
                  {v.num}
                </div>
                <h3 className="font-display text-xl font-medium text-ink-900 mb-4">{v.title}</h3>
                <div className="w-8 h-px bg-gold-dark mb-4" />
                <p className="text-ink-500 font-light text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two-column CTA ── */}
      <section className="grid md:grid-cols-2 min-h-[520px]">
        {/* Manufacturer */}
        <div
          className="relative flex flex-col justify-end p-12 lg:p-16 overflow-hidden bg-cover bg-center group"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=85&auto=format')` }}
        >
          <div className="absolute inset-0 bg-ink-900/70 group-hover:bg-ink-900/60 transition-colors duration-500" />
          <div className="relative z-10">
            <p className="text-xs tracking-widest-luxury uppercase text-gold mb-3">For Manufacturers</p>
            <h3 className="font-display text-headline font-medium text-cream mb-4 leading-tight">
              Reach the world's<br />best designers
            </h3>
            <p className="text-ink-200 text-sm font-light mb-8 max-w-sm leading-relaxed">
              Get verified, build your brand profile, and receive qualified RFPs
              from designers and architects in 48+ countries.
            </p>
            <Link
              href="/register?role=manufacturer"
              className="inline-flex items-center gap-3 bg-gold text-ink-900 px-8 py-3 text-xs tracking-widest-luxury uppercase font-medium hover:bg-gold-light transition-colors duration-300"
            >
              Apply as Manufacturer
            </Link>
          </div>
        </div>

        {/* Designer */}
        <div
          className="relative flex flex-col justify-end p-12 lg:p-16 overflow-hidden bg-cover bg-center group"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=85&auto=format')` }}
        >
          <div className="absolute inset-0 bg-ink-900/75 group-hover:bg-ink-900/65 transition-colors duration-500" />
          <div className="relative z-10">
            <p className="text-xs tracking-widest-luxury uppercase text-gold mb-3">For Designers</p>
            <h3 className="font-display text-headline font-medium text-cream mb-4 leading-tight">
              Source with<br />confidence
            </h3>
            <p className="text-ink-200 text-sm font-light mb-8 max-w-sm leading-relaxed">
              Post your RFP to the Invitation Hall, review verified responses,
              and collaborate with factories that match your quality standard.
            </p>
            <Link
              href="/register?role=designer"
              className="inline-flex items-center gap-3 border border-gold text-gold px-8 py-3 text-xs tracking-widest-luxury uppercase font-light hover:bg-gold hover:text-ink-900 transition-all duration-300"
            >
              Join as Designer
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-ink-900 border-t border-ink-700/50 py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            {/* Brand */}
            <div className="max-w-xs">
              <p className="font-display text-2xl font-medium text-cream mb-2">
                易物 <span className="text-gold text-sm font-sans font-light tracking-widest-luxury">YI WU</span>
              </p>
              <p className="text-ink-400 text-xs leading-relaxed font-light">
                Connecting the world's finest designers with verified Chinese manufacturers.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-12 text-xs">
              <div>
                <p className="text-ink-500 uppercase tracking-wide-luxury mb-4">Platform</p>
                <div className="flex flex-col gap-3">
                  <Link href="/discover"       className="text-ink-300 hover:text-gold transition-colors">Discover</Link>
                  <Link href="/world-wall"      className="text-ink-300 hover:text-gold transition-colors">World Wall</Link>
                  <Link href="/invitation-hall" className="text-ink-300 hover:text-gold transition-colors">Invitation Hall</Link>
                </div>
              </div>
              <div>
                <p className="text-ink-500 uppercase tracking-wide-luxury mb-4">Language</p>
                <div className="flex flex-col gap-3">
                  <Link href="/" locale="en" className="text-ink-300 hover:text-gold transition-colors">English</Link>
                  <Link href="/" locale="zh" className="text-ink-300 hover:text-gold transition-colors">中文</Link>
                  <Link href="/" locale="es" className="text-ink-300 hover:text-gold transition-colors">Español</Link>
                  <Link href="/" locale="it" className="text-ink-300 hover:text-gold transition-colors">Italiano</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-ink-800 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-ink-600 text-xs">
              © 2026 Yi Wu. All rights reserved.
            </p>
            <p className="text-ink-600 text-xs tracking-wide-luxury">
              DESIGNED FOR THE WORLD'S BEST MAKERS
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
