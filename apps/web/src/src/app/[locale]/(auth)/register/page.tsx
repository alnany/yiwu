"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const { locale } = useParams<{ locale: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultRole = searchParams.get("role") || "designer";

  const [role, setRole] = useState<"manufacturer" | "designer">(defaultRole as any);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError || !data.user) {
      setError(signUpError?.message || "Registration failed");
      setLoading(false);
      return;
    }

    const userId = data.user.id;
    await supabase.from("users").insert({ id: userId, email, role });

    if (role === "manufacturer") {
      await supabase.from("manufacturer_profiles").insert({
        user_id: userId, company_name: name, country, tags: [], is_verified: false
      });
      await supabase.from("audits").insert({
        manufacturer_id: userId, status: "pending"
      });
    } else {
      await supabase.from("designer_profiles").insert({
        user_id: userId, full_name: name, country, specialties: []
      });
    }

    router.push(`/${locale}/world-wall`);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-1">易物 YiWu</h1>
        <p className="text-gray-500 text-sm">Create your account</p>
      </div>

      {/* Role selector */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
        {(["manufacturer", "designer"] as const).map((r) => (
          <button
            key={r} onClick={() => setRole(r)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              role === r ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {r === "manufacturer" ? "🏭 Manufacturer" : "🎨 Designer / Buyer"}
          </button>
        ))}
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {role === "manufacturer" ? "Company Name" : "Full Name"}
          </label>
          <input
            value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            placeholder={role === "manufacturer" ? "Guangzhou Furniture Co." : "Jane Smith"}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <input
            value={country} onChange={(e) => setCountry(e.target.value)} required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            placeholder={role === "manufacturer" ? "China" : "United States"}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            placeholder="At least 8 characters"
          />
        </div>

        {role === "manufacturer" && (
          <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
            📋 After registering, our team will schedule an on-site audit of your facility. You&apos;ll receive a verified badge once approved.
          </div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <Link href={`/${locale}/login`} className="text-blue-600 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
