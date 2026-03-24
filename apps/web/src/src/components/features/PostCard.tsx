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

  async function handleLike() {
    const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    if (res.ok) {
      setLiked(!liked);
      setLikeCount((c) => (liked ? c - 1 : c + 1));
    }
  }

  const timeAgo = new Date(post.created_at).toLocaleDateString();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-5">
      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
          {authorName.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-1">
            <a href={profileHref} className="font-semibold text-gray-900 hover:text-blue-600 text-sm">
              {authorName}
            </a>
            {isVerified && (
              <BadgeCheck className="w-4 h-4 text-blue-500" />
            )}
          </div>
          <p className="text-xs text-gray-400">{timeAgo}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

      {/* Media */}
      {post.media_urls && post.media_urls.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {post.media_urls.slice(0, 4).map((url, i) => (
            <img key={i} src={url} alt="" className="rounded-lg w-full h-40 object-cover" />
          ))}
        </div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition ${
            liked ? "text-red-500" : "text-gray-500 hover:text-red-400"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          <span>{likeCount}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 transition">
          <MessageCircle className="w-4 h-4" />
          <span>{post.comment_count}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 transition ml-auto">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
