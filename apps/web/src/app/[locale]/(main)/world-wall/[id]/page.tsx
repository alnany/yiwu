"use client";
import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, 私信Circle, BadgeCheck, Send, 分享2 } from "lucide-react";
import { Post } from "@/types";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  author_name: string;
  author_role: string;
  is_verified: boolean;
}

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    async function load() {
      const [postRes, commentRes] = await Promise.all([
        fetch(`/api/posts/${id}`),
        fetch(`/api/posts/${id}/comments`),
      ]);
      if (postRes.ok) {
        const p = await postRes.json();
        setPost(p);
        setLiked(p.is_liked || false);
        setLikeCount(p.like_count || 0);
        setCommentCount(p.comment_count || 0);
      }
      if (commentRes.ok) {
        const c = await commentRes.json();
        setComments(c.comments || []);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleLike() {
    const res = await fetch(`/api/posts/${id}/like`, { method: "POST" });
    if (res.ok) {
      setLiked(!liked);
      setLikeCount((c) => (liked ? c - 1 : c + 1));
    }
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setPosting(true);
    const res = await fetch(`/api/posts/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText.trim() }),
    });
    if (res.ok) {
      const c = await res.json();
      setComments((prev) => [
        ...prev,
        { id: c.id, content: c.content, created_at: c.created_at, author_id: c.author_id, author_name: "You", author_role: "user", is_verified: false },
      ]);
      setCommentCount((n) => n + 1);
      setCommentText("");
    }
    setPosting(false);
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto pt-16 text-center text-ink-500 text-sm">
        加载中...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto pt-16 text-center">
        <p className="text-ink-400 text-sm mb-4">帖子不存在。</p>
        <Link href={`/${locale}/world-wall`} className="text-gold text-xs hover:underline">
          ← Back to 世界墙
        </Link>
      </div>
    );
  }

  const author = post.author as any;
  const authorName = author?.company_name || author?.full_name || "Anonymous";
  const isManufacturer = post.author_role === "manufacturer";
  const isVerified = isManufacturer && author?.is_verified;
  const profileHref = `/${locale}/${isManufacturer ? "manufacturers" : "designers"}/${post.author_id}`;
  const initial = authorName.charAt(0).toUpperCase();
  const dateStr = new Date(post.created_at).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link
        href={`/${locale}/world-wall`}
        className="inline-flex items-center gap-2 text-xs text-ink-500 hover:text-gold transition-colors duration-200 mb-8 tracking-wide-luxury uppercase"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        世界墙
      </Link>

      {/* Post card */}
      <div className="bg-ink-800 border border-ink-700/50 mb-px">
        <div className="p-7">
          {/* Author */}
          <div className="flex items-center gap-4 mb-6">
            <Link href={profileHref}>
              <div className="w-11 h-11 bg-ink-700 border border-ink-600 flex items-center justify-center text-gold font-display font-medium text-base flex-shrink-0 hover:border-gold/50 transition-colors duration-200">
                {initial}
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Link href={profileHref} className="font-medium text-cream hover:text-gold transition-colors duration-200">
                  {authorName}
                </Link>
                {isVerified && <BadgeCheck className="w-4 h-4 text-gold" />}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-ink-500">{dateStr}</p>
                {author?.country && (
                  <>
                    <span className="text-ink-700">·</span>
                    <p className="text-xs text-ink-500">{author.country}</p>
                  </>
                )}
              </div>
            </div>
            <Link
              href={`/${locale}/messages?contact=${post.author_id}`}
              className="text-xs border border-ink-600 text-ink-400 hover:border-gold/40 hover:text-gold px-4 py-2 transition-all duration-200 tracking-wide"
            >
              私信
            </Link>
          </div>

          {/* Content */}
          <p className="text-ink-100 leading-relaxed mb-5 font-light text-[15px]">{post.content}</p>

          {/* Media */}
          {post.media_urls && post.media_urls.length > 0 && (
            <div className="grid grid-cols-2 gap-px mb-5">
              {post.media_urls.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt="" className="w-full h-56 object-cover" />
              ))}
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs border border-ink-600 text-ink-400 px-2 py-0.5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 pt-5 border-t border-ink-700/50">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                liked ? "text-red-400" : "text-ink-500 hover:text-red-400"
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
              <span>{likeCount} {likeCount === 1 ? "赞" : "赞"}</span>
            </button>
            <span className="flex items-center gap-2 text-sm text-ink-500">
              <私信Circle className="w-4 h-4" />
              <span>{commentCount} {commentCount === 1 ? "评论" : "评论"}</span>
            </span>
            <button className="flex items-center gap-2 text-sm text-ink-500 hover:text-gold transition-colors duration-200 ml-auto">
              <分享2 className="w-4 h-4" />
              <span className="text-xs">分享</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-ink-800 border border-ink-700/50 border-t-0">
        {comments.length > 0 ? (
          <div className="px-7 py-6 space-y-6">
            {comments.map((c) => (
              <CommentItem key={c.id} comment={c} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="px-7 py-8 text-center text-ink-600 text-sm font-light">
            暂无评论，抢先留言吧。
          </div>
        )}

        {/* Comment form */}
        <div className="px-7 pb-7 pt-2 border-t border-ink-700/50">
          <form onSubmit={submitComment} className="flex gap-px mt-4">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="发表评论..."
              maxLength={1000}
              className="flex-1 bg-ink-900 border border-ink-600 border-r-0 text-cream text-sm px-5 py-3 focus:outline-none focus:border-gold placeholder-ink-600"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || posting}
              className="bg-gold text-ink-900 px-5 hover:bg-gold-light disabled:opacity-40 transition-colors duration-300 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function CommentItem({ comment, locale }: { comment: Comment; locale: string }) {
  const initial = comment.author_name.charAt(0).toUpperCase();
  const profileHref = comment.author_role === "manufacturer" || comment.author_role === "designer"
    ? `/${locale}/${comment.author_role === "manufacturer" ? "manufacturers" : "designers"}/${comment.author_id}`
    : "#";
  const timeStr = new Date(comment.created_at).toLocaleDateString("en-GB", {
    day: "numeric", month: "short",
  });

  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-ink-700 border border-ink-600/50 flex items-center justify-center text-gold/70 font-display font-medium text-xs">
          {initial}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <Link
            href={profileHref}
            className="text-sm font-medium text-ink-100 hover:text-gold transition-colors duration-200"
          >
            {comment.author_name}
          </Link>
          {comment.is_verified && <BadgeCheck className="w-3.5 h-3.5 text-gold" />}
          <span className="text-ink-600 text-xs">{timeStr}</span>
        </div>
        <p className="text-sm text-ink-300 leading-relaxed font-light">{comment.content}</p>
      </div>
    </div>
  );
}
