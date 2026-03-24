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
        user_id: userId, company_name: name, country, tags: [], is_verified: false,
      });
      await supabase.from("audits").insert({ manufacturer_id: userId, status: "pending" });
    } else {
      await supabase.from("designer_profiles").insert({
        user_id: userId, full_name: name, country, specialties: [],
      });
    }

    router.push(`/${locale}/world-wall`);
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-ink-800 border border-ink-700/50 p-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-medium text-cream tracking-wide mb-1">
            易物 <span className="text-gold text-sm font-sans font-light tracking-widest-luxury">YI WU</span>
          </h1>
          <p className="text-ink-400 text-xs tracking-wide-luxury uppercase mt-2">Create your account</p>
          <div className="w-8 h-px bg-gold/50 mx-auto mt-4" />
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-px bg-ink-700/50 mb-8">
          {(["manufacturer", "designer"] as const).map((r) => (
            <button
              key={r} onClick={() => setRole(r)}
              className={`py-3 text-xs tracking-wide-luxury uppercase transition-colors duration-200 ${
                role === r
                  ? "bg-gold text-ink-900 font-medium"
                  : "bg-ink-800 text-ink-400 hover:text-ink-200"
              }`}
            >
              {r === "manufacturer" ? "Manufacturer" : "Designer / Buyer"}
            </button>
          ))}
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="border border-red-900/50 bg-red-950/30 text-red-400 text-xs p-3">
              {error}
            </div>
          )}

          {/* Input helper */}
          {[
            {
              label: role === "manufacturer" ? "Company Name" : "Full Name",
              value: name, onChange: setName, required: true,
              placeholder: role === "manufacturer" ? "Guangzhou Furniture Co." : "Jane Smith",
            },
            {
              label: "Country", value: country, onChange: setCountry, required: true,
              placeholder: role === "manufacturer" ? "China" : "United States",
            },
            {
              label: "Email", value: email, onChange: setEmail, required: true,
              placeholder: "you@example.com", type: "email",
            },
            {
              label: "Password", value: password, onChange: setPassword, required: true,
              placeholder: "At least 8 characters", type: "password", minLength: 8,
            },
          ].map(({ label, value, onChange, required, placeholder, type = "text", minLength }) => (
            <div key={label}>
              <label className="block text-xs tracking-wide-luxury uppercase text-ink-400 mb-2">{label}</label>
              <input
                type={type} value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                minLength={minLength}
                placeholder={placeholder}
                className="w-full bg-ink-900 border border-ink-600 text-cream text-sm px-4 py-3 focus:outline-none focus:border-gold placeholder-ink-600 rounded-none"
              />
            </div>
          ))}

          {role === "manufacturer" && (
            <div className="border border-gold/20 bg-gold/5 p-3 text-xs text-ink-300 leading-relaxed">
              After registering, our team will schedule an on-site factory audit.
              You'll receive a verified badge once approved.
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-gold text-ink-900 py-3.5 text-xs tracking-widest-luxury uppercase font-medium hover:bg-gold-light disabled:opacity-50 transition-colors duration-300 mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-ink-500 mt-8">
          Already have an account?{" "}
          <Link href={`/${locale}/login`} className="text-gold hover:text-gold-light transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
