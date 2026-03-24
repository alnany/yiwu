"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(`/${locale}/world-wall`);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-ink-800 border border-ink-700/50 p-10">
        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-medium text-cream tracking-wide mb-1">
            易物 <span className="text-gold text-sm font-sans font-light tracking-widest-luxury">YI WU</span>
          </h1>
          <p className="text-ink-400 text-xs tracking-wide-luxury uppercase mt-2">欢迎回来</p>
          <div className="w-8 h-px bg-gold/50 mx-auto mt-4" />
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="border border-red-900/50 bg-red-950/30 text-red-400 text-xs p-3">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs tracking-wide-luxury uppercase text-ink-400 mb-2">邮箱</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full bg-ink-900 border border-ink-600 text-cream text-sm px-4 py-3 focus:outline-none focus:border-gold placeholder-ink-600 rounded-none"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wide-luxury uppercase text-ink-400 mb-2">密码</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full bg-ink-900 border border-ink-600 text-cream text-sm px-4 py-3 focus:outline-none focus:border-gold placeholder-ink-600 rounded-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-gold text-ink-900 py-3.5 text-xs tracking-widest-luxury uppercase font-medium hover:bg-gold-light disabled:opacity-50 transition-colors duration-300 mt-2"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        <p className="text-center text-xs text-ink-500 mt-8">
          还没有账号？{" "}
          <Link href={`/${locale}/register`} className="text-gold hover:text-gold-light transition-colors">
            申请加入
          </Link>
        </p>
      </div>
    </div>
  );
}
