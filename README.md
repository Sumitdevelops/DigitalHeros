# 🏌️‍♂️ DIGITAL HEROES
### Golf Performance & Charity Draw Platform
**Modern Fintech Architecture for Athletic Performance and Catalytic Philanthropy**

---

## 🎯 Overview

**Digital Heroes** combines official USGA/WHS golf performance tracking (Stableford 1–45 pts) with transparent monthly cash prize draws and automated charitable tithes.

- **Fintech Precision**: Crafted with high-density Stripe/Linear-inspired visual aesthetics (Obsidian slate `#0B0F15`, Primary Vibrant Teal `#0D7C7F`, Gold `#D4A856`, Coral Giving `#FF6B35`). No golf clichés.
- **5-Score Rolling Engine**: Enforces strict USGA Stableford format (1–45), disallows duplicate dates, and automatically maintains the golfer's 5 freshest rounds.
- **Provably Fair Draws**: Supports uniform **Random 5-ball selection** and frequency-weighted **Algorithmic draws**.
- **Tiered Cash Payouts**: 40% (5-match Jackpot with Rollover), 35% (4-match), 25% (3-match).
- **Guaranteed Impact**: Golfers allocate 10% to 50% of their subscription fee directly to vetted non-profits (Junior Golf, Wounded Veterans, Urban Access).
- **Winner Proof Verification**: Golfers upload official scorecard screenshots, and platform administrators review, approve, and track disbursements.

---

## 📋 Technology Stack

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript, TailwindCSS
- **Design Generation**: Stitch MCP (`3704481291030897729`)
- **Backend & Database**: Supabase PostgreSQL with 8 relational tables & Row-Level Security (RLS)
- **Payments**: Stripe Subscriptions ($29/mo or $290/yr) & Webhooks
- **Visuals**: Lightweight responsive SVG charts, canvas-confetti celebration particles, Lucide React icons

---

## 🚀 Getting Started

### 1. Installation
```bash
# Clone or navigate to the workspace
cd d:\horse

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔑 Environment Variables Configuration

Copy `.env.example` to `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1Ni...

# Stripe Configuration
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Dual-Mode Data Architecture**: If Supabase or Stripe credentials are not yet configured, the platform automatically activates its unified in-memory and localStorage synced data engine. All 15 pages, score logging, draw simulations, proof uploads, and admin controls work seamlessly out of the box!

---

## 💾 Database Setup (Supabase PostgreSQL)

To provision a fresh Supabase project:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Run the complete DDL script in `supabase/schema.sql` (creates all 8 tables, indexes, check constraints, and RLS policies).
4. Run the seed script in `supabase/seed.sql` to populate partner charities, sample users, historical draws, and scores.

---

## 📄 Platform Sitemap (15 Total Pages)

### Public Pages
- `/` — Homepage (Fintech Hero, 4-step How It Works, Stats, Featured Causes, 5/4/3 Match Explainer)
- `/charities` — Charities Directory (Search, cause category filters, impact cards)
- `/charities/[id]` — Charity Detail (Cause mission, monthly contribution trajectory chart, upcoming golf days)

### Auth & Onboarding Flow
- `/auth/signup` — Sign Up with password complexity validation and auto-redirect
- `/auth/login` — Sign In with 1-click Demo logins for Subscriber and Admin
- `/onboarding/charity-selection` — Onboarding Step 1: Select cause to support
- `/onboarding/plan-selection` — Onboarding Step 2: Monthly vs Yearly plan, 10–50% charity tithe slider

### Authenticated Subscriber Hub
- `/dashboard` — Subscriber Hub (3-column layout, score logger, upcoming draw card, charity progress, recent rounds)
- `/dashboard/scores` — Stableford Score Entry & Rolling 5 history (Edit, Delete, Best score highlight)
- `/dashboard/draws` — Draws & Participation (Upcoming prize pool, eligibility ticket, past draw summaries)
- `/draws/[id]` — Draw Results Detail (Animated 5-ball reveal, match outcome comparison, confetti celebration)
- `/dashboard/charity` — Charity Management (Adjust donation percentage slider 10-50%, change charity)
- `/dashboard/winnings` — Winnings & Payouts (Upload scorecard proof modal, pending/verified/paid badges)
- `/dashboard/settings` — Account Settings (Profile info, subscription management, security, data export)

### Admin Control Surface
- `/admin` — Executive Overview (Top 4 KPIs, subscriber trajectory chart, prize pool split bar, charity donut)
- `/admin/users` — User Operations (Search, status filters, edit subscriptions, view scorecards, CSV export)
- `/admin/draws` — Draw Simulator & Publisher (Schedule draws, dry-run simulation preview, publish execution)
- `/admin/charities` — Charity Governance (Add/edit non-profits, toggle homepage featured spotlight, delete)
- `/admin/winners` — Winner Verifications & Payouts (Thumbnail expander, approve/reject, mark paid, CSV export)
- `/admin/reports` — Financial Intelligence (Revenue vs payouts margin, draw hit rates, charity ledger, print)

---

## 👥 Fast Testing Persona Guide

On any page, use the top-right navbar user menu or `/auth/login` to toggle between roles:
1. **Alex Morgan (Active Subscriber)**:
   - 5 Stableford scores logged (38, 34, 41, 36, 39 pts)
   - Active monthly membership with 20% charity tithe to Junior Golf Foundation
   - Winner of 3-number match prize in Draw 1
2. **Sarah Jenkins (Super Administrator)**:
   - Access to `/admin` control suite
   - Capable of running draw simulations, approving winner proofs, and creating causes

---

## 🧪 Testing Verification Checklist

- [x] Responsive layout tested from mobile (320px) to desktop (1440px)
- [x] Stableford range validation (1–45 points)
- [x] Rolling 5-score limit (evicts oldest score automatically)
- [x] Duplicate date prevention
- [x] Draw simulator dry-run without saving
- [x] Draw publishing with automated winner calculation and rollover logic
- [x] Winner proof upload modal with JPG/PNG verification
- [x] Admin approval and mark-as-paid settlement workflow
- [x] Charity contribution percentage adjustment (10% to 50%)
- [x] CSV data exports for users, payouts, and financial metrics
