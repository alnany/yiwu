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
    { href: `/${locale}/world-wall`, label: "World Wall" },
    { href: `/${locale}/discover`, label: "Discover" },
    { href: `/${locale}/invitation-hall`, label: "Invitation Hall" },
    { href: `/${locale}/messages`, label: "Messages" },
  ];

  if (userRole === "admin") {
    navLinks.push({ href: `/${locale}/admin/audits`, label: "Admin" });
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href={`/${locale}`} className="text-xl font-bold text-blue-600">
          易物 YiWu
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                pathname.startsWith(link.href)
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <select
            className="text-sm border border-gray-200 rounded px-2 py-1 text-gray-600"
            value={locale}
            onChange={(e) => {
              const newLocale = e.target.value;
              const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
              window.location.href = newPath;
            }}
          >
            <option value="en">EN</option>
            <option value="zh">中文</option>
            <option value="es">ES</option>
            <option value="it">IT</option>
          </select>

          <Link
            href={`/${locale}/profile`}
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
