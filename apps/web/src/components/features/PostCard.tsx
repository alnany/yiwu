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
}

interface Props {
  post: Post;
  locale: string;
  onUpdate: () => void;
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
  const authorName = author?.company_name || author?.full_name || "Anonymous";
  const isManufacturer = post.author_role === "manufacturer";
  const isVerified = isManufacturer && author?.is_verified;
  const profileHref = `/${locale}/${isManufacturer ? "manufacturers" : "designers"}/${post.author_id}`;
  const initial = authorName.charAt(0).toUpperCase();
  const timeAgo = new Date(post.created_at).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
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
        author_name: "You",
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
          <Link href={profileHref}>
            <div className="w-9 h-9 bg-ink-700 border border-ink-600 flex items-center justify-center text-gold font-display font-medium text-sm flex-shrink-0 hover:border-gold/50 transition-colors duration-200">
              {initial}
            </div>
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
          <Link
            href={`/${locale}/messages?contact=${post.author_id}`}
            className="text-xs border border-ink-600 text-ink-400 hover:border-gold/40 hover:text-gold px-3 py-1.5 transition-all duration-200"
          >
            Message
          </Link>
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
          {/* Existing comments */}
          {comments.length > 0 && (
            <div className="px-6 py-4 space-y-4">
              {comments.map((c) => (
                <CommentRow key={c.id} comment={c} locale={locale} />
              ))}
            </div>
          )}
          {commentsLoaded && comments.length === 0 && (
            <p className="px-6 py-4 text-xs text-ink-600 font-light">
              No comments yet. Be the first.
            </p>
          )}

          {/* Comment form */}
          <form onSubmit={submitComment} className="flex gap-px px-6 pb-5 pt-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
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
  const initial = comment.author_name.charAt(0).toUpperCase();
  const profileHref = `/${locale}/${comment.author_role === "manufacturer" ? "manufacturers" : "designers"}/${comment.author_id}`;
  const timeAgo = new Date(comment.created_at).toLocaleDateString("en-GB", {
    day: "numeric", month: "short",
  });

  return (
    <div className="flex gap-3">
      <Link href={profileHref} className="flex-shrink-0">
        <div className="w-7 h-7 bg-ink-700 border border-ink-600/50 flex items-center justify-center text-gold/70 font-display font-medium text-xs hover:border-gold/40 transition-colors duration-200">
          {initial}
        </div>
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
