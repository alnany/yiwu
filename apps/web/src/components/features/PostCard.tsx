"use client";
import { Post } from "@/types";
import { Heart, MessageCircle, Share2, BadgeCheck, Send, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useCallback } from "react";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  author_name: string;
  author_role: string;
  is_verified: boolean;
  avatar_url?: string;
}

interface Props {
  post: Post;
  locale: string;
  onUpdate: () => void;
}

// Mapping of removed Unsplash photos to working replacements
const PHOTO_FALLBACKS: Record<string, string> = {
  "photo-1573408301185-9519f94815b6": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&q=85&auto=format",
  "photo-1584178639036-613ba18a8c13": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85&auto=format",
  "photo-1556909114-44e3e9399a2f": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85&auto=format",
  "photo-1513506003901-1e6a35eb30e2": "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=900&q=85&auto=format",
};

function resolveMediaUrl(url: string): string {
  for (const [broken, replacement] of Object.entries(PHOTO_FALLBACKS)) {
    if (url.includes(broken)) return replacement;
  }
  return url;
}

function Avatar({ src, name, size = "sm" }: { src?: string; name: string; size?: "sm" | "md" }) {
  const [imgError, setImgError] = useState(false);
  const initial = name.charAt(0).toUpperCase();
  const dim = size === "md" ? "w-9 h-9" : "w-7 h-7";
  const textSize = size === "md" ? "text-sm" : "text-xs";

  if (src && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        className={`${dim} rounded-full object-cover border border-ink-600 hover:border-gold/50 transition-colors duration-200`}
      />
    );
  }
  return (
    <div className={`${dim} bg-ink-700 border border-ink-600 flex items-center justify-center text-gold font-display font-medium ${textSize} flex-shrink-0 hover:border-gold/50 transition-colors duration-200`}>
      {initial}
    </div>
  );
}

export function PostCard({ post, locale, onUpdate }: Props) {
  const [liked, setLiked] = useState(post.is_liked || false);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comment_count);

  const author = post.author as any;
  const authorName = author?.company_name || author?.full_name || "匿名";
  const isManufacturer = post.author_role === "manufacturer";
  const isVerified = isManufacturer && author?.is_verified;
  const profileHref = `/${locale}/${isManufacturer ? "manufacturers" : "designers"}/${post.author_id}`;
  const postHref = `/${locale}/world-wall/${post.id}`;
  const timeAgo = new Date(post.created_at).toLocaleDateString("zh-CN", {
    month: "short", day: "numeric",
  });

  async function handleLike() {
    const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    if (res.ok) {
      setLiked(!liked);
      setLikeCount((c) => (liked ? c - 1 : c + 1));
    }
  }

  const loadComments = useCallback(async () => {
    if (commentsLoaded) return;
    const res = await fetch(`/api/posts/${post.id}/comments`);
    const data = await res.json();
    setComments(data.comments || []);
    setCommentsLoaded(true);
  }, [commentsLoaded, post.id]);

  async function toggleComments() {
    if (!showComments) await loadComments();
    setShowComments((v) => !v);
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setPosting(true);
    const res = await fetch(`/api/posts/${post.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText.trim() }),
    });
    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => [...prev, {
        id: newComment.id,
        content: newComment.content,
        created_at: newComment.created_at,
        author_id: newComment.author_id,
        author_name: "你",
        author_role: "user",
        is_verified: false,
      }]);
      setCommentCount((c) => c + 1);
      setCommentText("");
    }
    setPosting(false);
  }

  return (
    <div className="bg-ink-800 border border-ink-700/50 hover:border-ink-600/50 transition-colors duration-300">
      {/* Post body */}
      <div className="p-6">
        {/* Author */}
        <div className="flex items-center gap-3 mb-5">
          <Link href={profileHref} className="flex-shrink-0">
            <Avatar src={author?.avatar_url} name={authorName} size="md" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <Link
                href={profileHref}
                className="text-sm font-medium text-cream hover:text-gold transition-colors duration-200"
              >
                {authorName}
              </Link>
              {isVerified && <BadgeCheck className="w-3.5 h-3.5 text-gold" />}
            </div>
            <p className="text-xs text-ink-500">{timeAgo}</p>
          </div>
        </div>

        {/* Content — click to open full post */}
        <Link href={postHref} className="block group">
          <p className="text-ink-200 text-sm leading-relaxed mb-4 font-light group-hover:text-cream transition-colors duration-200">{post.content}</p>

          {/* Media */}
          {post.media_urls && post.media_urls.length > 0 && (
            <div className={`gap-px mb-4 ${post.media_urls.length === 1 ? "block" : "grid grid-cols-2"}`}>
              {post.media_urls.slice(0, 4).map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={resolveMediaUrl(url)}
                  alt=""
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                  className={`w-full object-cover ${
                    post.media_urls.length === 1 ? "h-72" : "h-44"
                  }`}
                />
              ))}
            </div>
          )}
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs border border-ink-600 text-ink-400 px-2 py-0.5 hover:border-gold/40 hover:text-gold transition-colors duration-200 cursor-pointer"
              >
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
          <button
            onClick={toggleComments}
            className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
              showComments ? "text-gold" : "text-ink-500 hover:text-gold"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{commentCount}</span>
            {showComments
              ? <ChevronUp className="w-3 h-3" />
              : <ChevronDown className="w-3 h-3" />}
          </button>
          <button className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-gold transition-colors duration-200 ml-auto">
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Comments panel */}
      {showComments && (
        <div className="border-t border-ink-700/50 bg-ink-900/40">
          {comments.length > 0 && (
            <div className="px-6 py-4 space-y-4">
              {comments.map((c) => (
                <CommentRow key={c.id} comment={c} locale={locale} />
              ))}
            </div>
          )}
          {commentsLoaded && comments.length === 0 && (
            <p className="px-6 py-4 text-xs text-ink-600 font-light">
              暂无评论，抢先留言吧。
            </p>
          )}

          {/* Comment form */}
          <form onSubmit={submitComment} className="flex gap-px px-6 pb-5 pt-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="发表评论..."
              maxLength={1000}
              className="flex-1 bg-ink-800 border border-ink-600 border-r-0 text-cream text-xs px-4 py-2.5 focus:outline-none focus:border-gold placeholder-ink-600"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || posting}
              className="bg-gold text-ink-900 px-4 hover:bg-gold-light disabled:opacity-40 transition-colors duration-300 flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function CommentRow({ comment, locale }: { comment: Comment; locale: string }) {
  const profileHref = `/${locale}/${comment.author_role === "manufacturer" ? "manufacturers" : "designers"}/${comment.author_id}`;
  const timeAgo = new Date(comment.created_at).toLocaleDateString("zh-CN", {
    month: "short", day: "numeric",
  });

  return (
    <div className="flex gap-3">
      <Link href={profileHref} className="flex-shrink-0">
        <Avatar src={comment.avatar_url} name={comment.author_name} size="sm" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <Link
            href={profileHref}
            className="text-xs font-medium text-ink-200 hover:text-gold transition-colors duration-200"
          >
            {comment.author_name}
          </Link>
          {comment.is_verified && <BadgeCheck className="w-3 h-3 text-gold" />}
          <span className="text-ink-600 text-xs">{timeAgo}</span>
        </div>
        <p className="text-xs text-ink-300 leading-relaxed font-light">{comment.content}</p>
      </div>
    </div>
  );
}
