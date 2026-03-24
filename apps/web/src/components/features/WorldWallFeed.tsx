"use client";
import { useEffect, useState } from "react";
import { Post } from "@/types";
import { PostCard } from "./PostCard";

interface Props { locale: string; }

export function WorldWallFeed({ locale }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch(`/api/posts?limit=20`);
      const data = await res.json();
      setPosts(data.posts || []);
      setCursor(data.next_cursor || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (!cursor) return;
    const res = await fetch(`/api/posts?limit=20&cursor=${cursor}`);
    const data = await res.json();
    setPosts((prev) => [...prev, ...(data.posts || [])]);
    setCursor(data.next_cursor || null);
  }

  if (loading) {
    return (
      <div className="text-center py-16 text-ink-500 text-xs tracking-wide-luxury uppercase">
        Loading posts...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 border border-ink-800">
        <p className="font-display text-lg text-ink-500">No posts yet.</p>
        <p className="text-xs text-ink-600 mt-1">Be the first to share with the community.</p>
      </div>
    );
  }

  return (
    <div className="space-y-px">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} locale={locale} onUpdate={fetchPosts} />
      ))}
      {cursor && (
        <button
          onClick={loadMore}
          className="w-full py-4 text-xs tracking-wide-luxury uppercase text-gold border border-gold/30 hover:bg-gold/10 transition-colors duration-300"
        >
          Load more
        </button>
      )}
    </div>
  );
}
