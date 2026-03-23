"use client";
import { useState } from "react";
import { Send, Image } from "lucide-react";

interface Props { locale: string; }

export function CreatePostBox({ locale }: Props) {
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [tags, setTags] = useState("");

  async function handlePost() {
    if (!content.trim()) return;
    setPosting(true);
    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, tags: tags.split(",").map((t) => t.trim()).filter(Boolean), lang: locale }),
      });
      setContent(""); setTags("");
      window.location.reload();
    } catch (e) { console.error(e); } finally { setPosting(false); }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
      <textarea value={content} onChange={(e) => setContent(e.target.value)}
        placeholder="Share something with the community..."
        className="w-full resize-none text-sm text-gray-800 placeholder-gray-400 outline-none min-h-[80px]" rows={3} />
      <div className="mt-2 mb-3">
        <input value={tags} onChange={(e) => setTags(e.target.value)}
          placeholder="Tags: furniture, ceramic, luxury (comma separated)"
          className="w-full text-xs text-gray-500 placeholder-gray-400 outline-none border border-gray-100 rounded px-2 py-1.5" />
      </div>
      <div className="flex items-center justify-between">
        <button className="text-gray-400 hover:text-blue-500 transition"><Image className="w-5 h-5" /></button>
        <button onClick={handlePost} disabled={!content.trim() || posting}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
          <Send className="w-4 h-4" />{posting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
