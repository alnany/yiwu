"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  locale: string;
  userRole?: string | null;
}

export function Navbar({ locale, userRole }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}/world-wall`,      label: "世界墙" },
    { href: `/${locale}/discover`,        label: "发现" },
    { href: `/${locale}/invitation-hall`, label: "邀请大厅" },
    { href: `/${locale}/messages`,        label: "消息" },
  ];

  if (userRole === "admin") {
    navLinks.push({ href: `/${locale}/admin/audits`, label: "管理" });
  }

  return (
    <nav className="bg-ink-900/95 backdrop-blur-md border-b border-ink-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
        {/* Brand */}
        <Link href={`/${locale}`} className="font-display text-lg font-medium text-cream tracking-wide">
          易物{" "}
          <span className="text-gold text-xs font-sans font-light tracking-widest-luxury ml-1">
            YI WU
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link text-xs tracking-wide-luxury uppercase transition-colors duration-300 ${
                pathname.startsWith(link.href)
                  ? "text-gold active"
                  : "text-ink-300 hover:text-cream"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Language switcher */}
          <select
            className="text-xs border border-ink-600 bg-transparent text-ink-300 px-2 py-1.5 rounded-none focus:outline-none focus:border-gold cursor-pointer"
            value={locale}
            onChange={(e) => {
              const newLocale = e.target.value;
              const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
              window.location.href = newPath;
            }}
          >
            <option value="zh" className="bg-ink-900">中文</option>
            <option value="en" className="bg-ink-900">EN</option>
            <option value="es" className="bg-ink-900">ES</option>
            <option value="it" className="bg-ink-900">IT</option>
          </select>

          <Link
            href={`/${locale}/profile`}
            className="text-xs tracking-wide-luxury uppercase bg-gold text-ink-900 px-5 py-2 font-medium hover:bg-gold-light transition-colors duration-300"
          >
            主页
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-ink-700/50 bg-ink-900 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-wide-luxury uppercase text-ink-300 hover:text-gold transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
