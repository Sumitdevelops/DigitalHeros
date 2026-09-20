import {
  User,
  Charity,
  Subscription,
  GolfScore,
  Draw,
  DrawResult,
  Winner,
  CharityContribution,
  DrawType,
  SimulationResults,
} from "@/types";
import { simulateDraw, UserRoundProfile } from "./draw-engine";

export const INITIAL_CHARITIES: Charity[] = [
  {
    id: "c1111111-1111-1111-1111-111111111111",
    name: "Junior Golf Foundation",
    description: "Providing full sets of high-grade junior golf clubs, PGA coaching, and tournament access to underrepresented youth worldwide.",
    image_url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1200&q=80",
    logo_url: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=200&q=80",
    website: "https://juniorgolffoundation.org",
    cause_category: "education",
    is_featured: true,
    ytd_contribution: 48500,
    target_goal: 100000,
    lives_supported: 1420,
    upcoming_events: [
      { title: "Youth Summer Invitational", date: "2026-04-12", location: "Pinehurst No. 2" },
      { title: "Junior Master Clinic", date: "2026-05-18", location: "Torrey Pines" }
    ],
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "c2222222-2222-2222-2222-222222222222",
    name: "PGA HOPE Veterans Golf",
    description: "Empowering wounded military veterans and first responders through adaptive golf therapy, camaraderie, and mental health rehabilitation.",
    image_url: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1200&q=80",
    logo_url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=200&q=80",
    website: "https://pgahope.org",
    cause_category: "veterans",
    is_featured: true,
    ytd_contribution: 62400,
    target_goal: 120000,
    lives_supported: 890,
    upcoming_events: [
      { title: "Veterans Scramble Cup", date: "2026-04-25", location: "Congressional CC" },
      { title: "Adaptive Fitting Day", date: "2026-06-05", location: "Inverness Club" }
    ],
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "c3333333-3333-3333-3333-333333333333",
    name: "Urban Youth Greens Initiative",
    description: "Subsidizing $5 public course green fees and supplying free range balls so kids in urban neighborhoods can learn the game.",
    image_url: "https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=1200&q=80",
    logo_url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=200&q=80",
    website: "https://urbanyouthgreens.org",
    cause_category: "poverty",
    is_featured: true,
    ytd_contribution: 34150,
    target_goal: 80000,
    lives_supported: 2150,
    upcoming_events: [
      { title: "City Greens Pro-Am", date: "2026-05-02", location: "Bethpage Black" }
    ],
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "c4444444-4444-4444-4444-444444444444",
    name: "Clean Fairways Eco Alliance",
    description: "Restoring wetland habitats and natural water reservoirs on and around public golf links, eliminating synthetic pesticide runoff.",
    image_url: "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=1200&q=80",
    logo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80",
    website: "https://cleanfairways.org",
    cause_category: "environment",
    is_featured: false,
    ytd_contribution: 29800,
    target_goal: 60000,
    lives_supported: 560,
    upcoming_events: [
      { title: "Earth Day Eco-Scramble", date: "2026-04-22", location: "Chambers Bay" }
    ],
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "c5555555-5555-5555-5555-555555555555",
    name: "Children Heart Hospital Foundation",
    description: "Funding life-saving pediatric heart surgeries and cardiac research for families with financial hardships.",
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    logo_url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=200&q=80",
    website: "https://childrenshearthospital.org",
    cause_category: "health",
    is_featured: false,
    ytd_contribution: 55200,
    target_goal: 150000,
    lives_supported: 310,
    upcoming_events: [
      { title: "Hearts & Pars Gala", date: "2026-05-30", location: "Kiawah Island Ocean Course" }
    ],
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "c6666666-6666-6666-6666-666666666666",
    name: "Caddie Scholarship Trust",
    description: "Providing full four-year university tuition scholarships to deserving youth golf caddies with exemplary academic merit.",
    image_url: "https://images.unsplash.com/photo-1500932334442-8761ee4810a7?auto=format&fit=crop&w=1200&q=80",
    logo_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80",
    website: "https://caddiescholarships.org",
    cause_category: "education",
    is_featured: false,
    ytd_contribution: 41900,
    target_goal: 90000,
    lives_supported: 740,
    upcoming_events: [
      { title: "Scholars Cup", date: "2026-06-15", location: "Merion Golf Club" }
    ],
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: "a1111111-1111-1111-1111-111111111111",
    email: "player@digitalheroes.golf",
    full_name: "Alex Morgan",
    role: "subscriber",
    password: "HeroGolf2026!",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    created_at: "2026-01-10T10:00:00Z",
    updated_at: "2026-01-10T10:00:00Z"
  },
  {
    id: "a2222222-2222-2222-2222-222222222222",
    email: "admin@digitalheroes.golf",
    full_name: "Sarah Jenkins",
    role: "admin",
    password: "HeroGolf2026!",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    created_at: "2025-11-01T10:00:00Z",
    updated_at: "2025-11-01T10:00:00Z"
  },
  {
    id: "a3333333-3333-3333-3333-333333333333",
    email: "marcus.vance@example.com",
    full_name: "Marcus Vance",
    role: "subscriber",
    password: "HeroGolf2026!",
    created_at: "2026-02-01T14:30:00Z",
    updated_at: "2026-02-01T14:30:00Z"
  },
  {
    id: "a4444444-4444-4444-4444-444444444444",
    email: "elena.rostova@example.com",
    full_name: "Elena Rostova",
    role: "subscriber",
    password: "HeroGolf2026!",
    created_at: "2026-02-14T09:15:00Z",
    updated_at: "2026-02-14T09:15:00Z"
  },
  {
    id: "a5555555-5555-5555-5555-555555555555",
    email: "david.choi@example.com",
    full_name: "David Choi",
    role: "subscriber",
    password: "HeroGolf2026!",
    created_at: "2026-02-20T11:00:00Z",
    updated_at: "2026-02-20T11:00:00Z"
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "s1111111-1111-1111-1111-111111111111",
    user_id: "a1111111-1111-1111-1111-111111111111",
    plan_type: "monthly",
    status: "active",
    stripe_customer_id: "cus_sample_alex_123",
    stripe_subscription_id: "sub_sample_alex_123",
    charity_id: "c1111111-1111-1111-1111-111111111111",
    charity_contribution_percentage: 20,
    subscribed_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    renewal_date: new Date(Date.now() + 15 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "s3333333-3333-3333-3333-333333333333",
    user_id: "a3333333-3333-3333-3333-333333333333",
    plan_type: "yearly",
    status: "active",
    stripe_customer_id: "cus_sample_marcus_333",
    stripe_subscription_id: "sub_sample_marcus_333",
    charity_id: "c2222222-2222-2222-2222-222222222222",
    charity_contribution_percentage: 15,
    subscribed_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    renewal_date: new Date(Date.now() + 305 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "s4444444-4444-4444-4444-444444444444",
    user_id: "a4444444-4444-4444-4444-444444444444",
    plan_type: "monthly",
    status: "renewing",
    stripe_customer_id: "cus_sample_elena_444",
    stripe_subscription_id: "sub_sample_elena_444",
    charity_id: "c3333333-3333-3333-3333-333333333333",
    charity_contribution_percentage: 10,
    subscribed_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    renewal_date: new Date(Date.now() + 5 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "s5555555-5555-5555-5555-555555555555",
    user_id: "a5555555-5555-5555-5555-555555555555",
    plan_type: "monthly",
    status: "lapsed",
    stripe_customer_id: "cus_sample_david_555",
    stripe_subscription_id: "sub_sample_david_555",
    charity_id: "c1111111-1111-1111-1111-111111111111",
    charity_contribution_percentage: 10,
    subscribed_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    renewal_date: new Date(Date.now() - 5 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_GOLF_SCORES: GolfScore[] = [
  // Alex Morgan's 5 rolling scores
  {
    id: "g1111111-1111-1111-1111-111111111111",
    user_id: "a1111111-1111-1111-1111-111111111111",
    score: 38,
    score_date: "2026-03-01",
    course_name: "Pebble Beach Golf Links",
    created_at: "2026-03-01T18:00:00Z",
    updated_at: "2026-03-01T18:00:00Z"
  },
  {
    id: "g2222222-2222-2222-2222-222222222222",
    user_id: "a1111111-1111-1111-1111-111111111111",
    score: 34,
    score_date: "2026-03-05",
    course_name: "Spyglass Hill",
    created_at: "2026-03-05T17:30:00Z",
    updated_at: "2026-03-05T17:30:00Z"
  },
  {
    id: "g3333333-3333-3333-3333-333333333333",
    user_id: "a1111111-1111-1111-1111-111111111111",
    score: 41,
    score_date: "2026-03-10",
    course_name: "Cypress Point Club",
    created_at: "2026-03-10T19:00:00Z",
    updated_at: "2026-03-10T19:00:00Z"
  },
  {
    id: "g4444444-4444-4444-4444-444444444444",
    user_id: "a1111111-1111-1111-1111-111111111111",
    score: 36,
    score_date: "2026-03-14",
    course_name: "Spanish Bay Links",
    created_at: "2026-03-14T16:45:00Z",
    updated_at: "2026-03-14T16:45:00Z"
  },
  {
    id: "g5555555-5555-5555-5555-555555555555",
    user_id: "a1111111-1111-1111-1111-111111111111",
    score: 39,
    score_date: "2026-03-18",
    course_name: "Torrey Pines South",
    created_at: "2026-03-18T18:20:00Z",
    updated_at: "2026-03-18T18:20:00Z"
  },
  // Marcus Vance scores
  { id: "g301", user_id: "a3333333-3333-3333-3333-333333333333", score: 38, score_date: "2026-03-02", course_name: "Pinehurst No. 2", created_at: "2026-03-02T10:00:00Z", updated_at: "2026-03-02T10:00:00Z" },
  { id: "g302", user_id: "a3333333-3333-3333-3333-333333333333", score: 32, score_date: "2026-03-06", course_name: "Pinehurst No. 4", created_at: "2026-03-06T10:00:00Z", updated_at: "2026-03-06T10:00:00Z" },
  { id: "g303", user_id: "a3333333-3333-3333-3333-333333333333", score: 41, score_date: "2026-03-11", course_name: "Tobacco Road", created_at: "2026-03-11T10:00:00Z", updated_at: "2026-03-11T10:00:00Z" },
  { id: "g304", user_id: "a3333333-3333-3333-3333-333333333333", score: 28, score_date: "2026-03-15", course_name: "Mid Pines", created_at: "2026-03-15T10:00:00Z", updated_at: "2026-03-15T10:00:00Z" },
  { id: "g305", user_id: "a3333333-3333-3333-3333-333333333333", score: 35, score_date: "2026-03-19", course_name: "Pine Needles", created_at: "2026-03-19T10:00:00Z", updated_at: "2026-03-19T10:00:00Z" },
  // Elena Rostova scores
  { id: "g401", user_id: "a4444444-4444-4444-4444-444444444444", score: 34, score_date: "2026-03-03", course_name: "Bandon Dunes", created_at: "2026-03-03T10:00:00Z", updated_at: "2026-03-03T10:00:00Z" },
  { id: "g402", user_id: "a4444444-4444-4444-4444-444444444444", score: 39, score_date: "2026-03-07", course_name: "Pacific Dunes", created_at: "2026-03-07T10:00:00Z", updated_at: "2026-03-07T10:00:00Z" },
  { id: "g403", user_id: "a4444444-4444-4444-4444-444444444444", score: 27, score_date: "2026-03-12", course_name: "Bandon Trails", created_at: "2026-03-12T10:00:00Z", updated_at: "2026-03-12T10:00:00Z" },
  { id: "g404", user_id: "a4444444-4444-4444-4444-444444444444", score: 41, score_date: "2026-03-16", course_name: "Old Macdonald", created_at: "2026-03-16T10:00:00Z", updated_at: "2026-03-16T10:00:00Z" },
  { id: "g405", user_id: "a4444444-4444-4444-4444-444444444444", score: 38, score_date: "2026-03-20", course_name: "Sheep Ranch", created_at: "2026-03-20T10:00:00Z", updated_at: "2026-03-20T10:00:00Z" }
];

export const INITIAL_DRAWS: Draw[] = [
  {
    id: "d1111111-1111-1111-1111-111111111111",
    draw_date: "2026-02-15",
    draw_type: "algorithmic",
    status: "completed",
    pool_5_match: 8400,
    pool_4_match: 7350,
    pool_3_match: 5250,
    total_pool: 21000,
    rollover_amount: 0,
    active_subscriber_count: 800,
    drawn_numbers: [38, 34, 27, 41, 19],
    published_at: "2026-02-15T21:00:00Z",
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-02-15T21:00:00Z"
  },
  {
    id: "d2222222-2222-2222-2222-222222222222",
    draw_date: "2026-03-31",
    draw_type: "random",
    status: "scheduled",
    pool_5_match: 11200,
    pool_4_match: 9800,
    pool_3_match: 7000,
    total_pool: 28000,
    rollover_amount: 1500,
    active_subscriber_count: 1050,
    drawn_numbers: null,
    published_at: null,
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z"
  }
];

export const INITIAL_DRAW_RESULTS: DrawResult[] = [
  {
    id: "dr111111-1111-1111-1111-111111111111",
    draw_id: "d1111111-1111-1111-1111-111111111111",
    match_type: 5,
    drawn_numbers: [38, 34, 27, 41, 19],
    winner_count: 1,
    prize_per_winner: 8400,
    tier_pool: 8400,
    created_at: "2026-02-15T21:05:00Z"
  },
  {
    id: "dr222222-2222-2222-2222-222222222222",
    draw_id: "d1111111-1111-1111-1111-111111111111",
    match_type: 4,
    drawn_numbers: [38, 34, 27, 41, 19],
    winner_count: 5,
    prize_per_winner: 1470,
    tier_pool: 7350,
    created_at: "2026-02-15T21:05:00Z"
  },
  {
    id: "dr333333-3333-3333-3333-333333333333",
    draw_id: "d1111111-1111-1111-1111-111111111111",
    match_type: 3,
    drawn_numbers: [38, 34, 27, 41, 19],
    winner_count: 16,
    prize_per_winner: 328.12,
    tier_pool: 5250,
    created_at: "2026-02-15T21:05:00Z"
  }
];

export const INITIAL_WINNERS: Winner[] = [
  {
    id: "w1111111-1111-1111-1111-111111111111",
    draw_id: "d1111111-1111-1111-1111-111111111111",
    user_id: "a1111111-1111-1111-1111-111111111111",
    match_type: 3,
    amount_won: 328.12,
    proof_url: "https://images.unsplash.com/photo-1593111774642-a1a8c9b31d05?auto=format&fit=crop&w=600&q=80",
    status: "verified",
    payout_date: "2026-02-25T12:00:00Z",
    verification_notes: "Official club scorecard sheet verified by administrator.",
    user_name: "Alex Morgan",
    user_email: "player@digitalheroes.golf",
    created_at: "2026-02-15T21:10:00Z",
    updated_at: "2026-02-25T12:00:00Z"
  },
  {
    id: "w2222222-2222-2222-2222-222222222222",
    draw_id: "d1111111-1111-1111-1111-111111111111",
    user_id: "a4444444-4444-4444-4444-444444444444",
    match_type: 4,
    amount_won: 1470,
    proof_url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=600&q=80",
    status: "pending",
    payout_date: null,
    verification_notes: "Awaiting administrator review of uploaded GHIN app screenshot.",
    user_name: "Elena Rostova",
    user_email: "elena.rostova@example.com",
    created_at: "2026-02-15T21:10:00Z",
    updated_at: "2026-02-15T21:10:00Z"
  }
];

export const INITIAL_CHARITY_CONTRIBUTIONS: CharityContribution[] = [
  {
    id: "cc111111-1111-1111-1111-111111111111",
    user_id: "a1111111-1111-1111-1111-111111111111",
    charity_id: "c1111111-1111-1111-1111-111111111111",
    subscription_id: "s1111111-1111-1111-1111-111111111111",
    amount: 5.80,
    contribution_date: "2026-02-01",
    created_at: "2026-02-01T00:00:00Z"
  },
  {
    id: "cc222222-2222-2222-2222-222222222222",
    user_id: "a1111111-1111-1111-1111-111111111111",
    charity_id: "c1111111-1111-1111-1111-111111111111",
    subscription_id: "s1111111-1111-1111-1111-111111111111",
    amount: 5.80,
    contribution_date: "2026-03-01",
    created_at: "2026-03-01T00:00:00Z"
  }
];

// In-Memory Database Store with LocalStorage synchronization
class MockDatabase {
  private users: User[] = [];
  private charities: Charity[] = [...INITIAL_CHARITIES];
  private subscriptions: Subscription[] = [...INITIAL_SUBSCRIPTIONS];
  private scores: GolfScore[] = [...INITIAL_GOLF_SCORES];
  private draws: Draw[] = [...INITIAL_DRAWS];
  private drawResults: DrawResult[] = [...INITIAL_DRAW_RESULTS];
  private winners: Winner[] = [...INITIAL_WINNERS];
  private contributions: CharityContribution[] = [...INITIAL_CHARITY_CONTRIBUTIONS];
  private currentUserId: string | null = null; // Unauthenticated by default for new visitors

  constructor() {
    this.loadFromStorage();
  }

  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  private loadFromStorage() {
    if (!this.isBrowser()) return;
    try {
      const savedUser = localStorage.getItem("dh_current_user_id");
      this.currentUserId = savedUser ? savedUser : null;

      const storedUsers = localStorage.getItem("dh_users");
      if (storedUsers) {
        try {
          const parsed: User[] = JSON.parse(storedUsers);
          // Cleanse any legacy auto-created demo fallbacks ("Active Player" or "Golfer")
          this.users = parsed.filter(
            (u) => u.full_name !== "Active Player" && u.full_name !== "Golfer"
          );
        } catch {
          this.users = [];
        }
      } else {
        this.users = [];
      }

      // Reset invalid or purged session IDs
      if (this.currentUserId && !this.users.some((u) => u.id === this.currentUserId)) {
        this.currentUserId = null;
        localStorage.removeItem("dh_current_user_id");
      }

      const scores = localStorage.getItem("dh_scores");
      if (scores) this.scores = JSON.parse(scores);

      const charities = localStorage.getItem("dh_charities");
      if (charities) this.charities = JSON.parse(charities);

      const subscriptions = localStorage.getItem("dh_subscriptions");
      if (subscriptions) this.subscriptions = JSON.parse(subscriptions);

      const draws = localStorage.getItem("dh_draws");
      if (draws) this.draws = JSON.parse(draws);

      const winners = localStorage.getItem("dh_winners");
      if (winners) this.winners = JSON.parse(winners);

      const contributions = localStorage.getItem("dh_contributions");
      if (contributions) this.contributions = JSON.parse(contributions);
    } catch (e) {
      console.error("Error loading mock db from storage", e);
    }
  }

  private saveToStorage() {
    if (!this.isBrowser()) return;
    try {
      if (this.currentUserId) {
        localStorage.setItem("dh_current_user_id", this.currentUserId);
      } else {
        localStorage.removeItem("dh_current_user_id");
      }
      localStorage.setItem("dh_users", JSON.stringify(this.users));
      localStorage.setItem("dh_scores", JSON.stringify(this.scores));
      localStorage.setItem("dh_charities", JSON.stringify(this.charities));
      localStorage.setItem("dh_subscriptions", JSON.stringify(this.subscriptions));
      localStorage.setItem("dh_draws", JSON.stringify(this.draws));
      localStorage.setItem("dh_winners", JSON.stringify(this.winners));
      localStorage.setItem("dh_contributions", JSON.stringify(this.contributions));
    } catch (e) {
      console.error("Error saving mock db to storage", e);
    }
  }

  // --- Auth & Users ---
  getCurrentUser(): User | null {
    if (!this.currentUserId) return null;
    return this.users.find((u) => u.id === this.currentUserId) || null;
  }

  setCurrentUser(userId: string | null): User | null {
    if (!userId) {
      this.currentUserId = null;
      this.saveToStorage();
      if (this.isBrowser()) {
        window.dispatchEvent(new Event("storage"));
      }
      return null;
    }
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.currentUserId = user.id;
      this.saveToStorage();
      if (this.isBrowser()) {
        window.dispatchEvent(new Event("storage"));
      }
      return user;
    }
    return null;
  }

  logout(): void {
    this.currentUserId = null;
    this.saveToStorage();
    if (this.isBrowser()) {
      window.dispatchEvent(new Event("storage"));
    }
  }

  getUsers(): User[] {
    return [...this.users];
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  syncUser(user: User): void {
    const idx = this.users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      this.users[idx] = { ...this.users[idx], ...user };
    } else {
      this.users.push(user);
    }
    this.saveToStorage();
  }

  createUser(
    email: string,
    fullName: string,
    role: "subscriber" | "admin" = "subscriber",
    password?: string
  ): User {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = this.users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      throw new Error("An account with this email address already exists. Please log in instead.");
    }

    const newUser: User = {
      id: `u-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      email: email.trim(),
      full_name: fullName.trim(),
      role,
      password: password || "HeroGolf2026!",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.users.push(newUser);
    this.setCurrentUser(newUser.id);
    this.saveToStorage();
    return newUser;
  }

  updateUserPassword(userId: string, newPassword: string): boolean {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return false;
    user.password = newPassword;
    user.updated_at = new Date().toISOString();
    this.saveToStorage();
    return true;
  }

  deleteUser(userId: string): boolean {
    const initLen = this.users.length;
    this.users = this.users.filter((u) => u.id !== userId);
    this.subscriptions = this.subscriptions.filter((s) => s.user_id !== userId);
    this.scores = this.scores.filter((s) => s.user_id !== userId);
    this.saveToStorage();
    return this.users.length < initLen;
  }

  // --- Charities ---
  getCharities(): Charity[] {
    return [...this.charities];
  }

  getCharityById(id: string): Charity | undefined {
    return this.charities.find((c) => c.id === id);
  }

  createCharity(data: Omit<Charity, "id" | "ytd_contribution" | "lives_supported" | "created_at" | "updated_at">): Charity {
    const newCharity: Charity = {
      ...data,
      id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      ytd_contribution: 0,
      lives_supported: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.charities.unshift(newCharity);
    this.saveToStorage();
    return newCharity;
  }

  updateCharity(id: string, updates: Partial<Charity>): Charity | undefined {
    const charity = this.charities.find((c) => c.id === id);
    if (!charity) return undefined;
    Object.assign(charity, updates, { updated_at: new Date().toISOString() });
    this.saveToStorage();
    return charity;
  }

  deleteCharity(id: string): boolean {
    const initLen = this.charities.length;
    this.charities = this.charities.filter((c) => c.id !== id);
    this.saveToStorage();
    return this.charities.length < initLen;
  }

  // --- Subscriptions ---
  getUserSubscription(userId?: string): Subscription | undefined {
    const uid = userId || this.currentUserId;
    return this.subscriptions.find((s) => s.user_id === uid);
  }

  getAllSubscriptions(): Subscription[] {
    return [...this.subscriptions];
  }

  createOrUpdateSubscription(data: {
    userId?: string;
    planType: "monthly" | "yearly";
    charityId: string;
    charityPercentage: number;
  }): Subscription {
    const uid = data.userId || this.currentUserId || "a1111111-1111-1111-1111-111111111111";
    const existing = this.subscriptions.find((s) => s.user_id === uid);
    const renewalDays = data.planType === "yearly" ? 365 : 30;

    if (existing) {
      existing.plan_type = data.planType;
      existing.charity_id = data.charityId;
      existing.charity_contribution_percentage = data.charityPercentage;
      existing.status = "active";
      existing.updated_at = new Date().toISOString();
      this.saveToStorage();
      return existing;
    }

    const newSub: Subscription = {
      id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      user_id: uid,
      plan_type: data.planType,
      status: "active",
      stripe_customer_id: `cus_${Math.random().toString(36).substr(2, 10)}`,
      stripe_subscription_id: `sub_${Math.random().toString(36).substr(2, 10)}`,
      charity_id: data.charityId,
      charity_contribution_percentage: data.charityPercentage,
      subscribed_at: new Date().toISOString(),
      renewal_date: new Date(Date.now() + renewalDays * 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.subscriptions.push(newSub);
    this.saveToStorage();
    return newSub;
  }

  updateSubscription(subscriptionId: string, updates: Partial<Subscription>): Subscription | undefined {
    const sub = this.subscriptions.find((s) => s.id === subscriptionId);
    if (!sub) return undefined;
    Object.assign(sub, updates, { updated_at: new Date().toISOString() });
    this.saveToStorage();
    return sub;
  }

  // --- Golf Scores (Rolling 5, Stableford 1-45, No Duplicate Dates) ---
  getUserScores(userId?: string): GolfScore[] {
    const uid = userId || this.currentUserId;
    return this.scores
      .filter((s) => s.user_id === uid)
      .sort((a, b) => new Date(b.score_date).getTime() - new Date(a.score_date).getTime())
      .slice(0, 5);
  }

  getAllScores(): GolfScore[] {
    return [...this.scores];
  }

  addScore(score: number, scoreDate: string, courseName?: string, userId?: string): { success: boolean; score?: GolfScore; error?: string } {
    // Range validation
    if (score < 1 || score > 45) {
      return { success: false, error: "Score must be between 1 and 45 in Stableford format." };
    }

    // Future date validation
    const today = new Date().toISOString().split("T")[0];
    if (scoreDate > today) {
      return { success: false, error: "Score date cannot be in the future." };
    }

    const uid = userId || this.currentUserId || "a1111111-1111-1111-1111-111111111111";

    // Duplicate date validation
    const existingDate = this.scores.find((s) => s.user_id === uid && s.score_date === scoreDate);
    if (existingDate) {
      return { success: false, error: "Only one score per date is permitted. You already logged a round on this date." };
    }

    const newScore: GolfScore = {
      id: `g-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      user_id: uid,
      score,
      score_date: scoreDate,
      course_name: courseName || "Unspecified Course",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add new score
    this.scores.push(newScore);

    // Apply rolling 5 limit: fetch all scores for user, keep 5 newest, evict oldest
    const userScores = this.scores
      .filter((s) => s.user_id === uid)
      .sort((a, b) => new Date(b.score_date).getTime() - new Date(a.score_date).getTime());

    if (userScores.length > 5) {
      const allowedIds = new Set(userScores.slice(0, 5).map((s) => s.id));
      this.scores = this.scores.filter((s) => s.user_id !== uid || allowedIds.has(s.id));
    }

    this.saveToStorage();
    return { success: true, score: newScore };
  }

  updateScore(id: string, score: number, scoreDate: string, courseName?: string): { success: boolean; score?: GolfScore; error?: string } {
    const s = this.scores.find((sc) => sc.id === id);
    if (!s) return { success: false, error: "Score not found" };

    if (score < 1 || score > 45) {
      return { success: false, error: "Score must be between 1 and 45." };
    }

    // Check duplicate if date changed
    if (s.score_date !== scoreDate) {
      const existing = this.scores.find((other) => other.user_id === s.user_id && other.id !== id && other.score_date === scoreDate);
      if (existing) {
        return { success: false, error: "A score is already logged on this date." };
      }
    }

    s.score = score;
    s.score_date = scoreDate;
    if (courseName !== undefined) s.course_name = courseName;
    s.updated_at = new Date().toISOString();

    this.saveToStorage();
    return { success: true, score: s };
  }

  deleteScore(id: string): boolean {
    const initLen = this.scores.length;
    this.scores = this.scores.filter((s) => s.id !== id);
    this.saveToStorage();
    return this.scores.length < initLen;
  }

  // --- Draws & Results ---
  getDraws(): Draw[] {
    return [...this.draws].sort((a, b) => new Date(b.draw_date).getTime() - new Date(a.draw_date).getTime());
  }

  getDrawById(id: string): Draw | undefined {
    return this.draws.find((d) => d.id === id);
  }

  getUpcomingDraw(): Draw | undefined {
    return this.draws.find((d) => d.status === "scheduled") || this.draws[0];
  }

  getDrawResults(drawId: string): DrawResult[] {
    return this.drawResults.filter((dr) => dr.draw_id === drawId);
  }

  createDraw(data: {
    draw_date: string;
    draw_type: DrawType;
    total_pool?: number;
    rollover_amount?: number;
  }): Draw {
    const activeSubs = this.subscriptions.filter((s) => s.status === "active" || s.status === "renewing").length;
    const pool = data.total_pool || Math.max(activeSubs * 26.10, 4200);
    const rollover = data.rollover_amount || 0;

    const newDraw: Draw = {
      id: `d-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      draw_date: data.draw_date,
      draw_type: data.draw_type,
      status: "scheduled",
      pool_5_match: Math.round((pool * 0.40 + rollover) * 100) / 100,
      pool_4_match: Math.round(pool * 0.35 * 100) / 100,
      pool_3_match: Math.round(pool * 0.25 * 100) / 100,
      total_pool: pool,
      rollover_amount: rollover,
      active_subscriber_count: activeSubs || 1000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.draws.unshift(newDraw);
    this.saveToStorage();
    return newDraw;
  }

  simulateDraw(drawId: string, customType?: DrawType): SimulationResults {
    const draw = this.getDrawById(drawId) || this.getUpcomingDraw()!;
    const drawType = customType || draw.draw_type;

    // Compile active users and their scores
    const activeUsers = this.users;
    const profiles: UserRoundProfile[] = activeUsers.map((u) => {
      const userScores = this.getUserScores(u.id).map((s) => s.score);
      return {
        user_id: u.id,
        user_name: u.full_name,
        scores: userScores,
      };
    });

    const allScores = this.scores.map((s) => s.score);

    return simulateDraw(
      drawType,
      profiles,
      allScores,
      draw.total_pool,
      draw.rollover_amount
    );
  }

  publishDraw(drawId: string, simulation: SimulationResults): Draw {
    const draw = this.getDrawById(drawId);
    if (!draw) throw new Error("Draw not found");

    draw.status = "completed";
    draw.drawn_numbers = simulation.drawn_numbers;
    draw.published_at = new Date().toISOString();
    draw.pool_5_match = simulation.pool_5_match;
    draw.pool_4_match = simulation.pool_4_match;
    draw.pool_3_match = simulation.pool_3_match;
    draw.updated_at = new Date().toISOString();

    // Create draw_results
    const res5: DrawResult = {
      id: `dr-5-${Date.now()}`,
      draw_id: draw.id,
      match_type: 5,
      drawn_numbers: simulation.drawn_numbers,
      winner_count: simulation.tier_5_winners.length,
      prize_per_winner: simulation.prize_per_tier_5,
      tier_pool: simulation.pool_5_match,
      created_at: new Date().toISOString()
    };
    const res4: DrawResult = {
      id: `dr-4-${Date.now()}`,
      draw_id: draw.id,
      match_type: 4,
      drawn_numbers: simulation.drawn_numbers,
      winner_count: simulation.tier_4_winners.length,
      prize_per_winner: simulation.prize_per_tier_4,
      tier_pool: simulation.pool_4_match,
      created_at: new Date().toISOString()
    };
    const res3: DrawResult = {
      id: `dr-3-${Date.now()}`,
      draw_id: draw.id,
      match_type: 3,
      drawn_numbers: simulation.drawn_numbers,
      winner_count: simulation.tier_3_winners.length,
      prize_per_winner: simulation.prize_per_tier_3,
      tier_pool: simulation.pool_3_match,
      created_at: new Date().toISOString()
    };
    this.drawResults.push(res5, res4, res3);

    // Insert winners
    simulation.tier_5_winners.forEach((w) => {
      this.winners.push({
        id: `w-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        draw_id: draw.id,
        user_id: w.user_id,
        user_name: w.user_name,
        match_type: 5,
        amount_won: simulation.prize_per_tier_5,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    });

    simulation.tier_4_winners.forEach((w) => {
      this.winners.push({
        id: `w-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        draw_id: draw.id,
        user_id: w.user_id,
        user_name: w.user_name,
        match_type: 4,
        amount_won: simulation.prize_per_tier_4,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    });

    simulation.tier_3_winners.forEach((w) => {
      this.winners.push({
        id: `w-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        draw_id: draw.id,
        user_id: w.user_id,
        user_name: w.user_name,
        match_type: 3,
        amount_won: simulation.prize_per_tier_3,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    });

    this.saveToStorage();
    return draw;
  }

  // --- Winners & Payouts ---
  getWinners(userId?: string): Winner[] {
    if (userId) {
      return this.winners.filter((w) => w.user_id === userId);
    }
    return [...this.winners];
  }

  getWinnerById(id: string): Winner | undefined {
    return this.winners.find((w) => w.id === id);
  }

  uploadProof(winnerId: string, proofUrl: string): Winner | undefined {
    const winner = this.winners.find((w) => w.id === winnerId);
    if (!winner) return undefined;
    winner.proof_url = proofUrl;
    winner.status = "pending";
    winner.updated_at = new Date().toISOString();
    this.saveToStorage();
    return winner;
  }

  approveWinner(winnerId: string, notes?: string): Winner | undefined {
    const winner = this.winners.find((w) => w.id === winnerId);
    if (!winner) return undefined;
    winner.status = "verified";
    if (notes) winner.verification_notes = notes;
    winner.updated_at = new Date().toISOString();
    this.saveToStorage();
    return winner;
  }

  rejectWinner(winnerId: string, reason: string): Winner | undefined {
    const winner = this.winners.find((w) => w.id === winnerId);
    if (!winner) return undefined;
    winner.status = "rejected";
    winner.verification_notes = reason;
    winner.updated_at = new Date().toISOString();
    this.saveToStorage();
    return winner;
  }

  markWinnerPaid(winnerId: string, payoutDate?: string): Winner | undefined {
    const winner = this.winners.find((w) => w.id === winnerId);
    if (!winner) return undefined;
    winner.status = "paid";
    winner.payout_date = payoutDate || new Date().toISOString();
    winner.updated_at = new Date().toISOString();
    this.saveToStorage();
    return winner;
  }

  // --- Charity Contributions ---
  getContributions(userId?: string): CharityContribution[] {
    if (userId) {
      return this.contributions.filter((c) => c.user_id === userId);
    }
    return [...this.contributions];
  }

  addContribution(data: Omit<CharityContribution, "id" | "created_at">): CharityContribution {
    const newContrib: CharityContribution = {
      ...data,
      id: `cc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.contributions.push(newContrib);
    // Update charity ytd
    const charity = this.charities.find((c) => c.id === data.charity_id);
    if (charity) {
      charity.ytd_contribution += data.amount;
    }
    this.saveToStorage();
    return newContrib;
  }
}

// Global singleton instance
export const mockDb = new MockDatabase();
