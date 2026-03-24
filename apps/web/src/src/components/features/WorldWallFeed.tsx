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

  if (loading) return <div className="text-center py-12 text-gray-500">Loading posts...</div>;

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-5xl mb-4">🌍</div>
        <p className="text-lg">No posts yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} locale={locale} onUpdate={fetchPosts} />
      ))}
      {cursor && (
        <button
          onClick={loadMore}
          className="w-full py-3 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
        >
          Load more
        </button>
      )}
    </div>
  );
}
