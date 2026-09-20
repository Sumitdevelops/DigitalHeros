-- ==========================================================
-- DIGITAL HEROES: SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- Platform: Golf Performance & Charity Draw Platform
-- ==========================================================

-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'subscriber', -- 'subscriber' or 'admin'
  avatar_url VARCHAR(512),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  auth_id UUID
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. CHARITIES TABLE
CREATE TABLE IF NOT EXISTS charities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(512),
  logo_url VARCHAR(512),
  website VARCHAR(255),
  cause_category VARCHAR(50) NOT NULL DEFAULT 'other', -- 'health', 'education', 'environment', 'veterans', 'poverty', 'other'
  is_featured BOOLEAN DEFAULT FALSE,
  ytd_contribution NUMERIC(12, 2) DEFAULT 0.00,
  target_goal NUMERIC(12, 2) DEFAULT 100000.00,
  lives_supported INT DEFAULT 0,
  upcoming_events JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_charities_is_featured ON charities(is_featured);
CREATE INDEX IF NOT EXISTS idx_charities_cause_category ON charities(cause_category);

-- 3. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_type VARCHAR(20) NOT NULL, -- 'monthly' or 'yearly'
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'renewing', 'lapsed', 'canceled'
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  charity_id UUID NOT NULL REFERENCES charities(id),
  charity_contribution_percentage INT DEFAULT 10 CHECK (charity_contribution_percentage >= 10 AND charity_contribution_percentage <= 50),
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  renewal_date TIMESTAMP WITH TIME ZONE NOT NULL,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_renewal_date ON subscriptions(renewal_date);

-- 4. GOLF SCORES TABLE (Rolling 5, Stableford 1-45, No duplicate dates)
CREATE TABLE IF NOT EXISTS golf_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score >= 1 AND score <= 45),
  score_date DATE NOT NULL,
  course_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Only one score per date per user
  UNIQUE(user_id, score_date)
);

CREATE INDEX IF NOT EXISTS idx_golf_scores_user_id ON golf_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_golf_scores_score_date ON golf_scores(score_date DESC);

-- 5. DRAWS TABLE
CREATE TABLE IF NOT EXISTS draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_date DATE NOT NULL UNIQUE,
  draw_type VARCHAR(20) NOT NULL DEFAULT 'random', -- 'random' or 'algorithmic'
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'published', 'completed'
  pool_5_match NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  pool_4_match NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  pool_3_match NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total_pool NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  rollover_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  active_subscriber_count INT NOT NULL DEFAULT 0,
  drawn_numbers INT[] DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_draws_draw_date ON draws(draw_date DESC);
CREATE INDEX IF NOT EXISTS idx_draws_status ON draws(status);

-- 6. DRAW RESULTS TABLE
CREATE TABLE IF NOT EXISTS draw_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
  match_type INT NOT NULL CHECK (match_type IN (3, 4, 5)),
  drawn_numbers INT[] NOT NULL,
  winner_count INT NOT NULL DEFAULT 0,
  prize_per_winner NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  tier_pool NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_draw_results_draw_id ON draw_results(draw_id);
CREATE INDEX IF NOT EXISTS idx_draw_results_match_type ON draw_results(match_type);

-- 7. WINNERS TABLE
CREATE TABLE IF NOT EXISTS winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_type INT NOT NULL CHECK (match_type IN (3, 4, 5)),
  amount_won NUMERIC(12, 2) NOT NULL,
  proof_url VARCHAR(512),
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'paid', 'rejected'
  payout_date TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_winners_user_id ON winners(user_id);
CREATE INDEX IF NOT EXISTS idx_winners_draw_id ON winners(draw_id);
CREATE INDEX IF NOT EXISTS idx_winners_status ON winners(status);

-- 8. CHARITY CONTRIBUTIONS TABLE (Audit Trail)
CREATE TABLE IF NOT EXISTS charity_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  charity_id UUID NOT NULL REFERENCES charities(id),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL,
  contribution_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_charity_contributions_user_id ON charity_contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_charity_contributions_charity_id ON charity_contributions(charity_id);
CREATE INDEX IF NOT EXISTS idx_charity_contributions_contribution_date ON charity_contributions(contribution_date DESC);

-- ==========================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see and edit their own record" ON users
  FOR ALL USING (auth.uid() = id OR auth.role() = 'service_role');

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');
CREATE POLICY "Users insert/update own subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() = user_id OR auth.role() = 'service_role');

ALTER TABLE golf_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own scores" ON golf_scores
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');
CREATE POLICY "Users manage own scores" ON golf_scores
  FOR ALL USING (auth.uid() = user_id OR auth.role() = 'service_role');

ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own winnings" ON winners
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');
CREATE POLICY "Users update own winning proof" ON winners
  FOR UPDATE USING (auth.uid() = user_id OR auth.role() = 'service_role');

ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Charities are publicly readable" ON charities
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage charities" ON charities
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Draws are publicly readable" ON draws
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage draws" ON draws
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE draw_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Draw results are publicly readable" ON draw_results
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage draw results" ON draw_results
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE charity_contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own charity contributions" ON charity_contributions
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');
