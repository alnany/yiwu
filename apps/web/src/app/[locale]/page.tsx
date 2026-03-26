import { Link } from "@/i18n/navigation";

// ── Product showcase data ──────────────────────────────────────
const showcaseItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85&auto=format",
    category: "家具",
    title: "雕塑感休闲椅",
    maker: "Studio Forma Milano",
    type: "manufacturer" as const,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&q=85&auto=format",
    category: "陶瓷",
    title: "哑光石器系列",
    maker: "Studio Haze × 景德镇工坊",
    type: "collab" as const,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=85&auto=format",
    category: "灯具",
    title: "编织藤制吊灯",
    maker: "Atelier Lumière",
    type: "manufacturer" as const,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85&auto=format",
    category: "纺织品",
    title: "亚麻真丝毯",
    maker: "Maison Dore × 苏州丝织坊",
    type: "collab" as const,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=85&auto=format",
    category: "餐具",
    title: "黑曜石餐具套装",
    maker: "Maison Kato",
    type: "manufacturer" as const,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=800&q=85&auto=format",
    category: "配饰",
    title: "大理石黄铜花器",
    maker: "Form & Matter Studio",
    type: "collab" as const,
  },
];

const stats = [
  { value: "1,200+", label: "认证厂商" },
  { value: "48",     label: "采购来源国家" },
  { value: "94%",    label: "审核通过率" },
  { value: "4",      label: "支持语言" },
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
              { href: "/discover",         label: "发现" },
              { href: "/world-wall",        label: "世界墙" },
              { href: "/invitation-hall",   label: "邀请大厅" },
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
              登录
            </Link>
            <Link
              href="/register"
              className="text-xs tracking-wide-luxury uppercase bg-gold text-ink-900 px-5 py-2.5 hover:bg-gold-light transition-colors duration-300"
            >
              申请加入
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
            全球认证厂商 B2B 平台
          </p>

          {/* Main headline */}
          <h1 className="font-display text-display-lg lg:text-display-xl font-medium text-cream mb-6 leading-none">
            工艺与创意<br />
            <em className="text-gold not-italic">在此相遇</em>
          </h1>

          {/* Sub */}
          <p className="text-base lg:text-lg text-ink-200 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            易物连接全球顶级设计师与认证厂商——<br className="hidden md:block" />
            无中间商，无代理，直达本源。
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 bg-gold text-ink-900 px-10 py-4 text-xs tracking-widest-luxury uppercase font-medium hover:bg-gold-light transition-all duration-300"
            >
              开始采购
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
            <Link
              href="/world-wall"
              className="inline-flex items-center gap-3 border border-ink-400 text-cream px-10 py-4 text-xs tracking-widest-luxury uppercase font-light hover:border-gold hover:text-gold transition-all duration-300"
            >
              探索精选
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
            <p className="text-xs tracking-widest-luxury uppercase text-gold mb-4">精选作品</p>
            <h2 className="font-display text-display font-medium text-cream mb-4">
              设计师与厂商，<br />
              <em className="text-ink-300 not-italic">共创未来</em>
            </h2>
            <p className="text-ink-300 font-light max-w-lg mx-auto text-sm leading-relaxed">
              从雕塑家具到精密陶瓷——探索当有远见的设计师遇上认证工厂后，所诞生的非凡作品。
            </p>
          </div>

          {/* Showcase grid — each item links to World Wall */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-700/30">
            {showcaseItems.map((item) => (
              <Link
                key={item.id}
                href="/world-wall"
                className="showcase-card group relative overflow-hidden bg-ink-800 cursor-pointer hover-lift block"
              >
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
                    {item.type === "collab" ? "合作" : "厂商"}
                  </span>
                </div>

                {/* Card content */}
                <div className="p-6 border-t border-ink-700/50">
                  <h3 className="font-display text-lg font-medium text-cream mb-1 group-hover:text-gold transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs text-ink-400 tracking-wide">{item.maker}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-14">
            <Link
              href="/discover"
              className="inline-flex items-center gap-3 border border-gold/50 text-gold px-10 py-4 text-xs tracking-widest-luxury uppercase hover:bg-gold hover:text-ink-900 transition-all duration-300"
            >
              查看完整系列
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Platform Value ── */}
      <section className="py-28 px-6 lg:px-12 bg-cream-dark text-ink-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest-luxury uppercase text-gold-dark mb-4">为何选择易物</p>
            <h2 className="font-display text-display font-medium text-ink-900">
              基于信任而生的平台
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                num: "01",
                title: "现场核验",
                body: "易物上的每一家厂商均经过严格的工厂实地审核。无贸易商，无代理，直接触达生产源头。",
              },
              {
                num: "02",
                title: "社交化发现",
                body: "浏览世界墙，关注厂商，深入了解他们的作品——在发起合作前充分调研。像创意人一样研究，像专业人士一样采购。",
              },
              {
                num: "03",
                title: "无障碍沟通",
                body: "内置中英西意四语实时翻译。您的创意构想，他们的精湛工艺——语言不再是壁垒。",
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
            <p className="text-xs tracking-widest-luxury uppercase text-gold mb-3">面向厂商</p>
            <h3 className="font-display text-headline font-medium text-cream mb-4 leading-tight">
              触达全球<br />最优秀的设计师
            </h3>
            <p className="text-ink-200 text-sm font-light mb-8 max-w-sm leading-relaxed">
              获得认证，建立品牌主页，收到来自全球48个国家设计师和建筑师的优质合作邀请。
            </p>
            <Link
              href="/register?role=manufacturer"
              className="inline-flex items-center gap-3 bg-gold text-ink-900 px-8 py-3 text-xs tracking-widest-luxury uppercase font-medium hover:bg-gold-light transition-colors duration-300"
            >
              申请成为厂商
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
            <p className="text-xs tracking-widest-luxury uppercase text-gold mb-3">面向设计师</p>
            <h3 className="font-display text-headline font-medium text-cream mb-4 leading-tight">
              自信采购，<br />品质无妥协
            </h3>
            <p className="text-ink-200 text-sm font-light mb-8 max-w-sm leading-relaxed">
              在邀请大厅发布采购需求，审阅认证厂商的回应，与匹配您品质标准的工厂携手合作。
            </p>
            <Link
              href="/register?role=designer"
              className="inline-flex items-center gap-3 border border-gold text-gold px-8 py-3 text-xs tracking-widest-luxury uppercase font-light hover:bg-gold hover:text-ink-900 transition-all duration-300"
            >
              以设计师身份加入
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
                连接全球顶级设计师与全球认证厂商。
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-12 text-xs">
              <div>
                <p class="text-ink-500 uppercase tracking-wide-luxury mb-4">平台</p>
                <div className="flex flex-col gap-3">
                  <Link href="/discover"       className="text-ink-300 hover:text-gold transition-colors">发现</Link>
                  <Link href="/world-wall"      className="text-ink-300 hover:text-gold transition-colors">世界墙</Link>
                  <Link href="/invitation-hall" className="text-ink-300 hover:text-gold transition-colors">邀请大厅</Link>
                </div>
              </div>
              <div>
                <p className="text-ink-500 uppercase tracking-wide-luxury mb-4">语言</p>
                <div className="flex flex-col gap-3">
                  <Link href="/" locale="zh" className="text-ink-300 hover:text-gold transition-colors">中文</Link>
                  <Link href="/" locale="en" className="text-ink-300 hover:text-gold transition-colors">English</Link>
                  <Link href="/" locale="es" className="text-ink-300 hover:text-gold transition-colors">Español</Link>
                  <Link href="/" locale="it" className="text-ink-300 hover:text-gold transition-colors">Italiano</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-ink-800 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-ink-600 text-xs">
              © 2026 易物. 保留所有权利。
            </p>
            <p className="text-ink-600 text-xs tracking-wide-luxury">
              为世界顶级创作者而生
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
