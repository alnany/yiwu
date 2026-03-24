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
        body: JSON.stringify({
          content,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          lang: locale,
        }),
      });
      setContent("");
      setTags("");
      window.location.reload();
    } catch (e) {
      console.error(e);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="bg-ink-800 border border-ink-700/50 p-5 mb-px">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share something with the community..."
        className="w-full resize-none bg-transparent text-sm text-ink-200 placeholder-ink-600 outline-none min-h-[80px] font-light leading-relaxed"
        rows={3}
      />
      <div className="mt-3 mb-4">
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags: furniture, ceramic, luxury (comma separated)"
          className="w-full text-xs bg-ink-900 border border-ink-700 text-ink-300 placeholder-ink-600 px-3 py-2 focus:outline-none focus:border-gold/50"
        />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-ink-700/50">
        <button className="text-ink-600 hover:text-gold transition-colors duration-200">
          <Image className="w-4 h-4" />
        </button>
        <button
          onClick={handlePost}
          disabled={!content.trim() || posting}
          className="flex items-center gap-2 bg-gold text-ink-900 text-xs tracking-wide-luxury uppercase px-5 py-2.5 font-medium hover:bg-gold-light disabled:opacity-40 transition-colors duration-300"
        >
          <Send className="w-3.5 h-3.5" />
          {posting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
