"use client";
import { Post } from "@/types";
import { Heart, MessageCircle, Share2, BadgeCheck } from "lucide-react";
import { useState } from "react";

interface Props {
  post: Post;
  locale: string;
  onUpdate: () => void;
}

export function PostCard({ post, locale, onUpdate }: Props) {
  const [liked, setLiked] = useState(post.is_liked || false);
  const [likeCount, setLikeCount] = useState(post.like_count);

  const author = post.author as any;
  const authorName = author?.company_name || author?.full_name || "Anonymous";
  const isManufacturer = post.author_role === "manufacturer";
  const isVerified = isManufacturer && author?.is_verified;
  const profileHref = `/${locale}/${isManufacturer ? "manufacturers" : "designers"}/${post.author_id}`;
  const initial = authorName.charAt(0).toUpperCase();

  async function handleLike() {
    const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    if (res.ok) {
      setLiked(!liked);
      setLikeCount((c) => (liked ? c - 1 : c + 1));
    }
  }

  const timeAgo = new Date(post.created_at).toLocaleDateString();

  return (
    <div className="bg-ink-800 border border-ink-700/50 hover:border-ink-600/50 transition-colors duration-300 p-6">
      {/* Author */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-ink-700 border border-ink-600 flex items-center justify-center text-gold font-display font-medium text-sm flex-shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <a href={profileHref} className="text-sm font-medium text-cream hover:text-gold transition-colors duration-200">
              {authorName}
            </a>
            {isVerified && <BadgeCheck className="w-3.5 h-3.5 text-gold" />}
          </div>
          <p className="text-xs text-ink-500">{timeAgo}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-ink-200 text-sm leading-relaxed mb-4 font-light">{post.content}</p>

      {/* Media */}
      {post.media_urls && post.media_urls.length > 0 && (
        <div className="grid grid-cols-2 gap-px mb-4">
          {post.media_urls.slice(0, 4).map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={url} alt="" className="w-full h-44 object-cover" />
          ))}
        </div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs border border-ink-600 text-ink-400 px-2 py-0.5 hover:border-gold/40 hover:text-gold transition-colors duration-200 cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-5 pt-4 border-t border-ink-700/50">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
            liked ? "text-red-400" : "text-ink-500 hover:text-red-400"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
          <span>{likeCount}</span>
        </button>
        <button className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-gold transition-colors duration-200">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{post.comment_count}</span>
        </button>
        <button className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-gold transition-colors duration-200 ml-auto">
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
