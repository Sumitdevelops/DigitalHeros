-- ==========================================================
-- DIGITAL HEROES: SUPABASE SEED DATA
-- ==========================================================

-- 1. SEED CHARITIES
INSERT INTO charities (id, name, description, image_url, logo_url, website, cause_category, is_featured, ytd_contribution, target_goal, lives_supported, upcoming_events)
VALUES
(
  'c1111111-1111-1111-1111-111111111111',
  'Junior Golf Foundation',
  'Providing full sets of high-grade junior golf clubs, PGA coaching, and tournament access to underrepresented youth worldwide.',
  'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=200&q=80',
  'https://juniorgolffoundation.org',
  'education',
  TRUE,
  48500.00,
  100000.00,
  1420,
  '[{"title": "Youth Summer Invitational", "date": "2026-04-12", "location": "Pinehurst No. 2"}, {"title": "Junior Master Clinic", "date": "2026-05-18", "location": "Torrey Pines"}]'::jsonb
),
(
  'c2222222-2222-2222-2222-222222222222',
  'PGA HOPE Veterans Golf',
  'Empowering wounded military veterans and first responders through adaptive golf therapy, camaraderie, and mental health rehabilitation.',
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=200&q=80',
  'https://pgahope.org',
  'veterans',
  TRUE,
  62400.00,
  120000.00,
  890,
  '[{"title": "Veterans Scramble Cup", "date": "2026-04-25", "location": "Congressional CC"}, {"title": "Adaptive Fitting Day", "date": "2026-06-05", "location": "Inverness Club"}]'::jsonb
),
(
  'c3333333-3333-3333-3333-333333333333',
  'Urban Youth Greens Initiative',
  'Subsidizing $5 public course green fees and supplying free range balls so kids in urban neighborhoods can learn the game.',
  'https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=200&q=80',
  'https://urbanyouthgreens.org',
  'poverty',
  TRUE,
  34150.00,
  80000.00,
  2150,
  '[{"title": "City Greens Pro-Am", "date": "2026-05-02", "location": "Bethpage Black"}]'::jsonb
),
(
  'c4444444-4444-4444-4444-444444444444',
  'Clean Fairways Eco Alliance',
  'Restoring wetland habitats and natural water reservoirs on and around public golf links, eliminating synthetic pesticide runoff.',
  'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80',
  'https://cleanfairways.org',
  'environment',
  FALSE,
  29800.00,
  60000.00,
  560,
  '[{"title": "Earth Day Eco-Scramble", "date": "2026-04-22", "location": "Chambers Bay"}]'::jsonb
),
(
  'c5555555-5555-5555-5555-555555555555',
  'Children Heart Hospital Foundation',
  'Funding life-saving cardiac surgeries and pediatric cardiac research for families in financial distress.',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=200&q=80',
  'https://childrenshearthospital.org',
  'health',
  FALSE,
  55200.00,
  150000.00,
  310,
  '[{"title": "Hearts & Pars Gala", "date": "2026-05-30", "location": "Kiawah Island Ocean Course"}]'::jsonb
),
(
  'c6666666-6666-6666-6666-666666666666',
  'Caddie Scholarship Trust',
  'Providing full four-year college tuition scholarships to deserving young golf caddies with strong academic merit.',
  'https://images.unsplash.com/photo-1500932334442-8761ee4810a7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80',
  'https://caddiescholarships.org',
  'education',
  FALSE,
  41900.00,
  90000.00,
  740,
  '[{"title": "Scholars Cup", "date": "2026-06-15", "location": "Merion Golf Club"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED SAMPLE USERS
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES
(
  'a1111111-1111-1111-1111-111111111111',
  'player@digitalheroes.golf',
  '$2a$12$e8x8qVlV81l92.exampleHashSubscriber',
  'Alex Morgan',
  'subscriber'
),
(
  'a2222222-2222-2222-2222-222222222222',
  'admin@digitalheroes.golf',
  '$2a$12$e8x8qVlV81l92.exampleHashAdmin',
  'Sarah Jenkins',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- 3. SEED SUBSCRIPTIONS
INSERT INTO subscriptions (id, user_id, plan_type, status, stripe_customer_id, stripe_subscription_id, charity_id, charity_contribution_percentage, subscribed_at, renewal_date)
VALUES
(
  'b1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  'monthly',
  'active',
  'cus_sample_alex_123',
  'sub_sample_alex_123',
  'c1111111-1111-1111-1111-111111111111',
  20,
  NOW() - INTERVAL '45 days',
  NOW() + INTERVAL '15 days'
)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED GOLF SCORES (5 rolling Stableford scores 1-45)
INSERT INTO golf_scores (id, user_id, score, score_date, course_name)
VALUES
('e1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 38, CURRENT_DATE - INTERVAL '18 days', 'Pebble Beach Golf Links'),
('e2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 34, CURRENT_DATE - INTERVAL '14 days', 'Spyglass Hill'),
('e3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 41, CURRENT_DATE - INTERVAL '9 days', 'Cypress Point Club'),
('e4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', 36, CURRENT_DATE - INTERVAL '5 days', 'Spanish Bay Links'),
('e5555555-5555-5555-5555-555555555555', 'a1111111-1111-1111-1111-111111111111', 39, CURRENT_DATE - INTERVAL '1 day', 'Torrey Pines South')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED DRAWS (Historical + Upcoming)
INSERT INTO draws (id, draw_date, draw_type, status, pool_5_match, pool_4_match, pool_3_match, total_pool, rollover_amount, active_subscriber_count, drawn_numbers, published_at)
VALUES
(
  'd1111111-1111-1111-1111-111111111111',
  CURRENT_DATE - INTERVAL '30 days',
  'algorithmic',
  'completed',
  8400.00,
  7350.00,
  5250.00,
  21000.00,
  0.00,
  800,
  ARRAY[38, 34, 27, 41, 19],
  NOW() - INTERVAL '30 days'
),
(
  'd2222222-2222-2222-2222-222222222222',
  CURRENT_DATE + INTERVAL '10 days',
  'random',
  'scheduled',
  11200.00,
  9800.00,
  7000.00,
  28000.00,
  1500.00,
  1050,
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED DRAW RESULTS FOR COMPLETED DRAW
INSERT INTO draw_results (id, draw_id, match_type, drawn_numbers, winner_count, prize_per_winner, tier_pool)
VALUES
('da111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 5, ARRAY[38, 34, 27, 41, 19], 1, 8400.00, 8400.00),
('da222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 4, ARRAY[38, 34, 27, 41, 19], 5, 1470.00, 7350.00),
('da333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 3, ARRAY[38, 34, 27, 41, 19], 16, 328.12, 5250.00)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED WINNERS
INSERT INTO winners (id, draw_id, user_id, match_type, amount_won, proof_url, status, payout_date, verification_notes)
VALUES
(
  'f1111111-1111-1111-1111-111111111111',
  'd1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  3,
  328.12,
  'https://images.unsplash.com/photo-1593111774642-a1a8c9b31d05?auto=format&fit=crop&w=600&q=80',
  'verified',
  NOW() - INTERVAL '20 days',
  'Official club score sheet verified by admin.'
)
ON CONFLICT (id) DO NOTHING;

-- 8. SEED CHARITY CONTRIBUTIONS
INSERT INTO charity_contributions (id, user_id, charity_id, subscription_id, amount, contribution_date)
VALUES
('cc111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 5.80, CURRENT_DATE - INTERVAL '45 days'),
('cc222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 5.80, CURRENT_DATE - INTERVAL '15 days')
ON CONFLICT (id) DO NOTHING;
