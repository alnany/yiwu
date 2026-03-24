-- Post comments
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 1000),
  parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS post_comments_post_idx ON post_comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS post_comments_author_idx ON post_comments(author_id);

-- Increment / decrement comment count helpers
CREATE OR REPLACE FUNCTION increment_comment_count(p_post_id UUID)
RETURNS VOID AS $$
  UPDATE posts SET comment_count = comment_count + 1 WHERE id = p_post_id;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_comment_count(p_post_id UUID)
RETURNS VOID AS $$
  UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = p_post_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_read_all" ON post_comments
  FOR SELECT USING (true);

CREATE POLICY "comments_insert_auth" ON post_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "comments_delete_own" ON post_comments
  FOR DELETE USING (auth.uid() = author_id);
