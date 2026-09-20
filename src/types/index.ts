export type UserRole = 'subscriber' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  password?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export type CauseCategory = 'health' | 'education' | 'environment' | 'poverty' | 'veterans' | 'other';

export interface CharityEvent {
  title: string;
  date: string;
  location: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string;
  logo_url: string;
  website: string;
  cause_category: CauseCategory;
  is_featured: boolean;
  ytd_contribution: number;
  target_goal: number;
  lives_supported: number;
  upcoming_events: CharityEvent[];
  created_at: string;
  updated_at: string;
}

export type PlanType = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'renewing' | 'lapsed' | 'canceled';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  charity_id: string;
  charity_contribution_percentage: number; // 10 to 50
  subscribed_at: string;
  renewal_date: string;
  canceled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface GolfScore {
  id: string;
  user_id: string;
  score: number; // 1 - 45 Stableford
  score_date: string; // YYYY-MM-DD
  course_name?: string;
  created_at: string;
  updated_at: string;
}

export type DrawType = 'random' | 'algorithmic';
export type DrawStatus = 'scheduled' | 'published' | 'completed';

export interface Draw {
  id: string;
  draw_date: string;
  draw_type: DrawType;
  status: DrawStatus;
  pool_5_match: number;
  pool_4_match: number;
  pool_3_match: number;
  total_pool: number;
  rollover_amount: number;
  active_subscriber_count: number;
  drawn_numbers?: number[] | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DrawResult {
  id: string;
  draw_id: string;
  match_type: 3 | 4 | 5;
  drawn_numbers: number[];
  winner_count: number;
  prize_per_winner: number;
  tier_pool: number;
  created_at: string;
}

export type WinnerStatus = 'pending' | 'verified' | 'paid' | 'rejected';

export interface Winner {
  id: string;
  draw_id: string;
  user_id: string;
  match_type: 3 | 4 | 5;
  amount_won: number;
  proof_url?: string;
  status: WinnerStatus;
  payout_date?: string | null;
  verification_notes?: string;
  user_name?: string;
  user_email?: string;
  created_at: string;
  updated_at: string;
}

export interface CharityContribution {
  id: string;
  user_id: string;
  charity_id: string;
  subscription_id?: string;
  amount: number;
  contribution_date: string;
  created_at: string;
}

export interface SimulationResults {
  draw_type: DrawType;
  drawn_numbers: number[];
  total_subscribers: number;
  total_eligible_subscribers: number;
  total_pool: number;
  rollover_amount: number;
  tier_5_winners: { user_id: string; user_name: string; matched_numbers: number[] }[];
  tier_4_winners: { user_id: string; user_name: string; matched_numbers: number[] }[];
  tier_3_winners: { user_id: string; user_name: string; matched_numbers: number[] }[];
  pool_5_match: number;
  pool_4_match: number;
  pool_3_match: number;
  prize_per_tier_5: number;
  prize_per_tier_4: number;
  prize_per_tier_3: number;
  next_rollover: number;
}
