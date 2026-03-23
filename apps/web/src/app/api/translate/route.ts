import { NextRequest, NextResponse } from "next/server";

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const LOCALE_TO_DEEPL: Record<string, string> = { en: "EN", zh: "ZH", es: "ES", it: "IT" };

export async function POST(req: NextRequest) {
  const { text, target } = await req.json();
  if (!text?.trim()) return NextResponse.json({ translated: text });
  const targetLang = LOCALE_TO_DEEPL[target] || "EN";
  if (!DEEPL_API_KEY) return NextResponse.json({ translated: `[${target.toUpperCase()}] ${text}` });
  try {
    const res = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}` },
      body: JSON.stringify({ text: [text], target_lang: targetLang }),
    });
    const data = await res.json();
    return NextResponse.json({ translated: data.translations?.[0]?.text || text });
  } catch { return NextResponse.json({ translated: text }); }
}
