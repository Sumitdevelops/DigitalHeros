import { DrawType, SimulationResults, GolfScore } from "@/types";

export interface UserRoundProfile {
  user_id: string;
  user_name: string;
  scores: number[]; // 5 scores
}

/**
 * Generate 5 distinct numbers between 1 and 45 using pure uniform random sampling.
 */
export function generateRandomNumbers(count = 5, min = 1, max = 45): number[] {
  const chosen = new Set<number>();
  while (chosen.size < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    chosen.add(num);
  }
  return Array.from(chosen).sort((a, b) => a - b);
}

/**
 * Generate 5 distinct numbers weighted by score frequency in the database.
 */
export function generateAlgorithmicNumbers(
  allLoggedScores: number[],
  count = 5,
  min = 1,
  max = 45
): number[] {
  // Count frequency
  const freq: Record<number, number> = {};
  for (let n = min; n <= max; n++) {
    freq[n] = 1; // base smoothing weight
  }
  for (const s of allLoggedScores) {
    if (s >= min && s <= max) {
      freq[s] = (freq[s] || 1) + 5; // boost weight for played scores
    }
  }

  const chosen = new Set<number>();
  while (chosen.size < count) {
    // Weighted selection
    let totalWeight = 0;
    for (let n = min; n <= max; n++) {
      if (!chosen.has(n)) {
        totalWeight += freq[n] || 1;
      }
    }

    let r = Math.random() * totalWeight;
    for (let n = min; n <= max; n++) {
      if (chosen.has(n)) continue;
      r -= freq[n] || 1;
      if (r <= 0) {
        chosen.add(n);
        break;
      }
    }
  }

  return Array.from(chosen).sort((a, b) => a - b);
}

/**
 * Compare a user's 5 scores against 5 drawn numbers and count matches.
 */
export function evaluateUserMatches(userScores: number[], drawnNumbers: number[]) {
  const drawnSet = new Set(drawnNumbers);
  const matchedNumbers = userScores.filter((s) => drawnSet.has(s));
  return {
    matchCount: matchedNumbers.length,
    matchedNumbers,
  };
}

/**
 * Run a full draw simulation across all active subscribers' logged scores.
 */
export function simulateDraw(
  drawType: DrawType,
  allProfiles: UserRoundProfile[],
  allHistoricalScores: number[],
  totalPool: number,
  rolloverAmount: number = 0,
  preDeterminedNumbers?: number[]
): SimulationResults {
  const drawnNumbers = preDeterminedNumbers
    ? preDeterminedNumbers
    : drawType === "algorithmic"
    ? generateAlgorithmicNumbers(allHistoricalScores)
    : generateRandomNumbers();

  const tier_5_winners: { user_id: string; user_name: string; matched_numbers: number[] }[] = [];
  const tier_4_winners: { user_id: string; user_name: string; matched_numbers: number[] }[] = [];
  const tier_3_winners: { user_id: string; user_name: string; matched_numbers: number[] }[] = [];

  // Evaluate each user
  for (const profile of allProfiles) {
    if (profile.scores.length === 5) {
      const { matchCount, matchedNumbers } = evaluateUserMatches(profile.scores, drawnNumbers);
      if (matchCount === 5) {
        tier_5_winners.push({ user_id: profile.user_id, user_name: profile.user_name, matched_numbers: matchedNumbers });
      } else if (matchCount === 4) {
        tier_4_winners.push({ user_id: profile.user_id, user_name: profile.user_name, matched_numbers: matchedNumbers });
      } else if (matchCount === 3) {
        tier_3_winners.push({ user_id: profile.user_id, user_name: profile.user_name, matched_numbers: matchedNumbers });
      }
    }
  }

  // Pools: 40% Tier 5 + Rollover, 35% Tier 4, 25% Tier 3
  const pool_5_match = Math.round((totalPool * 0.40 + rolloverAmount) * 100) / 100;
  const pool_4_match = Math.round(totalPool * 0.35 * 100) / 100;
  const pool_3_match = Math.round(totalPool * 0.25 * 100) / 100;

  const prize_per_tier_5 = tier_5_winners.length > 0
    ? Math.round((pool_5_match / tier_5_winners.length) * 100) / 100
    : 0;
  const prize_per_tier_4 = tier_4_winners.length > 0
    ? Math.round((pool_4_match / tier_4_winners.length) * 100) / 100
    : 0;
  const prize_per_tier_3 = tier_3_winners.length > 0
    ? Math.round((pool_3_match / tier_3_winners.length) * 100) / 100
    : 0;

  // Next rollover if no tier 5 winners
  const next_rollover = tier_5_winners.length === 0 ? pool_5_match : 0;

  return {
    draw_type: drawType,
    drawn_numbers: drawnNumbers,
    total_subscribers: allProfiles.length,
    total_eligible_subscribers: allProfiles.filter((p) => p.scores.length === 5).length,
    total_pool: totalPool,
    rollover_amount: rolloverAmount,
    tier_5_winners,
    tier_4_winners,
    tier_3_winners,
    pool_5_match,
    pool_4_match,
    pool_3_match,
    prize_per_tier_5,
    prize_per_tier_4,
    prize_per_tier_3,
    next_rollover,
  };
}
