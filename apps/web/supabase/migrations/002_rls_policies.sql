-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE designer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfp_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Users: can read own row, admins read all
CREATE POLICY "users_select" ON users FOR SELECT USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update" ON users FOR UPDATE USING (
  auth.uid() = id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Manufacturer profiles: public read, own write
CREATE POLICY "mfr_profiles_select" ON manufacturer_profiles FOR SELECT USING (true);
CREATE POLICY "mfr_profiles_insert" ON manufacturer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mfr_profiles_update" ON manufacturer_profiles FOR UPDATE USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Designer profiles: public read, own write
CREATE POLICY "dsg_profiles_select" ON designer_profiles FOR SELECT USING (true);
CREATE POLICY "dsg_profiles_insert" ON designer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "dsg_profiles_update" ON designer_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Audits: admin full access, manufacturer sees own
CREATE POLICY "audits_select" ON audits FOR SELECT USING (
  auth.uid() = manufacturer_id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "audits_insert" ON audits FOR INSERT WITH CHECK (auth.uid() = manufacturer_id);
CREATE POLICY "audits_update" ON audits FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Posts: public read, authenticated write
CREATE POLICY "posts_select" ON posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_update" ON posts FOR UPDATE USING (auth.uid() = author_id);

-- Post likes
CREATE POLICY "post_likes_select" ON post_likes FOR SELECT USING (true);
CREATE POLICY "post_likes_insert" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "post_likes_delete" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- RFP posts: public read, designer write own
CREATE POLICY "rfp_select" ON rfp_posts FOR SELECT USING (true);
CREATE POLICY "rfp_insert" ON rfp_posts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM designer_profiles WHERE id = designer_id AND user_id = auth.uid())
);
CREATE POLICY "rfp_update" ON rfp_posts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM designer_profiles WHERE id = designer_id AND user_id = auth.uid())
);

-- RFP responses: authenticated read, manufacturer write
CREATE POLICY "rfp_responses_select" ON rfp_responses FOR SELECT USING (
  auth.uid() IS NOT NULL
);
CREATE POLICY "rfp_responses_insert" ON rfp_responses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM manufacturer_profiles WHERE id = manufacturer_id AND user_id = auth.uid())
);

-- Conversations: participants only
CREATE POLICY "conv_select" ON conversations FOR SELECT USING (auth.uid() = ANY(participant_ids));
CREATE POLICY "conv_insert" ON conversations FOR INSERT WITH CHECK (auth.uid() = ANY(participant_ids));
CREATE POLICY "conv_update" ON conversations FOR UPDATE USING (auth.uid() = ANY(participant_ids));

-- Messages: conversation participants only
CREATE POLICY "msg_select" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND auth.uid() = ANY(participant_ids))
);
CREATE POLICY "msg_insert" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND auth.uid() = ANY(participant_ids))
);
CREATE POLICY "msg_update" ON messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND auth.uid() = ANY(participant_ids))
);

-- Follows: public read, own write
CREATE POLICY "follows_select" ON follows FOR SELECT USING (true);
CREATE POLICY "follows_insert" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete" ON follows FOR DELETE USING (auth.uid() = follower_id);
