// Comprehensive Automated Integration & Platform Test Suite for Digital Heroes
import assert from "node:assert";

const BASE_URL = "http://localhost:3000";

// Revenue split helper (mirrors stripe.ts for math contract verification)
function calculateRevenueSplit(price, charityPercentage) {
  const charityAmount = Math.round((price * (charityPercentage / 100)) * 100) / 100;
  const grossPrizePool = Math.round((price - charityAmount) * 100) / 100;
  const tier5Pool = Math.round(grossPrizePool * 0.40 * 100) / 100;
  const tier4Pool = Math.round(grossPrizePool * 0.35 * 100) / 100;
  const tier3Pool = Math.round(grossPrizePool * 0.25 * 100) / 100;
  return {
    subscriptionPrice: price,
    charityPercentage,
    charityAmount,
    grossPrizePool,
    tier5Pool,
    tier4Pool,
    tier3Pool,
  };
}

async function runComprehensiveTests() {
  console.log("==================================================================");
  console.log("🎯 DIGITAL HEROES: COMPREHENSIVE AUTOMATED PLATFORM TEST SUITE");
  console.log("==================================================================\n");

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    process.stdout.write(`• Testing: ${name}... `);
    try {
      await fn();
      console.log("✅ PASSED");
      passed++;
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
      failed++;
    }
  }

  // ==========================================================
  // SECTION 1: CORE ROUTE HEALTH & STATUS CHECKS (ALL 15+ PAGES)
  // ==========================================================
  console.log("--- 1. ROUTE ACCESSIBILITY & RENDERING CHECKS ---");

  const coreRoutes = [
    { path: "/", title: "Homepage" },
    { path: "/charities", title: "Charity Directory" },
    { path: "/charities/charity-trees", title: "Charity Detail Page" },
    { path: "/auth/login", title: "Authentication Login" },
    { path: "/auth/signup", title: "Authentication Signup" },
    { path: "/onboarding/charity-selection", title: "Onboarding Charity Step" },
    { path: "/onboarding/plan-selection", title: "Onboarding Plan Step" },
    { path: "/dashboard", title: "Subscriber Dashboard" },
    { path: "/dashboard/scores", title: "Scorecard Management" },
    { path: "/dashboard/draws", title: "Draws Participation" },
    { path: "/draws/d1111111-1111-1111-1111-111111111111", title: "Draw Results Detail" },
    { path: "/dashboard/charity", title: "Charity Tithe Management" },
    { path: "/dashboard/winnings", title: "Winnings & Proof Verification" },
    { path: "/dashboard/settings", title: "Account & Subscription Settings" },
    { path: "/admin", title: "Admin Overview & Telemetry" },
    { path: "/admin/users", title: "Admin User Management" },
    { path: "/admin/draws", title: "Admin Draw Engine Simulator" },
    { path: "/admin/charities", title: "Admin Charity Governance" },
    { path: "/admin/winners", title: "Admin Winner Approval Queue" },
    { path: "/admin/reports", title: "Admin Financial Reports" },
  ];

  for (const route of coreRoutes) {
    await test(`${route.title} (${route.path}) HTTP 200`, async () => {
      const res = await fetch(`${BASE_URL}${route.path}`);
      assert.strictEqual(res.status, 200, `Expected 200 but got ${res.status}`);
      const text = await res.text();
      assert.ok(text.length > 200, "Response body should not be empty");
    });
  }

  // ==========================================================
  // SECTION 2: GOLF SCORING RULES & CONSTRAINTS (1-45, ROLLING 5)
  // ==========================================================
  console.log("\n--- 2. STABLEFORD SCORING LOGIC & VALIDATION ---");

  await test("Score Range: Minimum boundary rejection (<1)", async () => {
    const res = await fetch(`${BASE_URL}/api/scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: 0,
        scoreDate: "2026-03-01",
        courseName: "Bandon Dunes"
      })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes("between 1 and 45"));
  });

  await test("Score Range: Maximum boundary rejection (>45)", async () => {
    const res = await fetch(`${BASE_URL}/api/scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: 46,
        scoreDate: "2026-03-01",
        courseName: "St Andrews"
      })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes("between 1 and 45"));
  });

  await test("Date Constraint: Future dates rejected", async () => {
    const res = await fetch(`${BASE_URL}/api/scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: 38,
        scoreDate: "2030-12-31",
        courseName: "Pebble Beach"
      })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes("future"));
  });

  const testUniqueDate1 = "2026-01-10";

  await test("Valid Score Logging: Accepts score in range 1-45 with past date", async () => {
    const res = await fetch(`${BASE_URL}/api/scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: 39,
        scoreDate: testUniqueDate1,
        courseName: "Augusta National",
        userId: "u-test-score-runner"
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.score.score, 39);
    assert.strictEqual(data.score.score_date, testUniqueDate1);
  });

  await test("Duplicate Date Constraint: Rejects two scores logged on same calendar day", async () => {
    const res = await fetch(`${BASE_URL}/api/scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: 41,
        scoreDate: testUniqueDate1,
        courseName: "Augusta National Alternate",
        userId: "u-test-score-runner"
      })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes("Only one score per date is permitted"));
  });

  await test("Rolling 5 System: Cap maximum active logged rounds to 5", async () => {
    const userId = "u-rolling-tester-" + Date.now();
    // Add 6 scores with distinct historical dates
    for (let i = 1; i <= 6; i++) {
      const day = String(i).padStart(2, "0");
      const res = await fetch(`${BASE_URL}/api/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: 30 + i,
          scoreDate: `2025-10-${day}`,
          courseName: `Course #${i}`,
          userId
        })
      });
      assert.strictEqual(res.status, 200, `Failed inserting round ${i}`);
    }

    // Now query scores for this user
    const res = await fetch(`${BASE_URL}/api/scores?userId=${userId}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.scores.length, 5, "Rolling 5 must evict 6th round and maintain exactly 5");
    // Ensure oldest score (2025-10-01) was evicted
    const dates = data.scores.map(s => s.score_date);
    assert.ok(!dates.includes("2025-10-01"), "Oldest score must be evicted");
    assert.ok(dates.includes("2025-10-06"), "Newest score must be retained");
  });

  // ==========================================================
  // SECTION 3: DRAW ENGINE LOGIC & PRIZE POOL SPLITS
  // ==========================================================
  console.log("\n--- 3. DRAW ENGINE MATHEMATICS & SIMULATION ---");

  await test("Live API Simulation: Generates 5 distinct balls in [1..45] (Random)", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/draws/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        drawId: "d2222222-2222-2222-2222-222222222222",
        drawType: "random"
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    const balls = data.simulation.drawn_numbers;
    assert.strictEqual(balls.length, 5);
    const unique = new Set(balls);
    assert.strictEqual(unique.size, 5);
    for (const b of balls) {
      assert.ok(b >= 1 && b <= 45);
    }
  });

  await test("Live API Simulation: Generates 5 distinct balls in [1..45] (Algorithmic)", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/draws/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        drawId: "d2222222-2222-2222-2222-222222222222",
        drawType: "algorithmic"
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    const balls = data.simulation.drawn_numbers;
    assert.strictEqual(balls.length, 5);
    const unique = new Set(balls);
    assert.strictEqual(unique.size, 5);
    for (const b of balls) {
      assert.ok(b >= 1 && b <= 45);
    }
  });

  await test("Prize Pool Distribution: 40% Tier 5, 35% Tier 4, 25% Tier 3", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/draws/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        drawId: "d2222222-2222-2222-2222-222222222222",
        drawType: "random"
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    const sim = data.simulation;
    const basePool = sim.total_pool;
    const rollover = sim.rollover_amount || 0;

    // Verify 40% Tier 5 (+ rollover), 35% Tier 4, 25% Tier 3
    const expectedTier5 = Math.round((basePool * 0.40 + rollover) * 100) / 100;
    const expectedTier4 = Math.round((basePool * 0.35) * 100) / 100;
    const expectedTier3 = Math.round((basePool * 0.25) * 100) / 100;

    assert.strictEqual(sim.pool_5_match, expectedTier5, "Tier 5 pool mismatch");
    assert.strictEqual(sim.pool_4_match, expectedTier4, "Tier 4 pool mismatch");
    assert.strictEqual(sim.pool_3_match, expectedTier3, "Tier 3 pool mismatch");

    // Rollover check: if 0 Tier 5 winners, next_rollover equals pool_5_match
    if (sim.tier_5_winners.length === 0) {
      assert.strictEqual(sim.next_rollover, sim.pool_5_match, "Unclaimed Tier 5 must rollover");
    } else {
      assert.strictEqual(sim.next_rollover, 0, "Claimed Tier 5 must reset rollover to 0");
    }
  });

  // ==========================================================
  // SECTION 4: CHARITY TITHE & REVENUE SPLIT CALCULATIONS
  // ==========================================================
  console.log("\n--- 4. CHARITY TITHE & REVENUE SPLIT MATH ---");

  await test("Tithe Split: Minimum 10% charity contribution on $29/mo", () => {
    const split = calculateRevenueSplit(29.00, 10);
    assert.strictEqual(split.charityPercentage, 10);
    assert.strictEqual(split.charityAmount, 2.90);
    assert.strictEqual(split.grossPrizePool, 26.10);
    assert.strictEqual(split.tier5Pool, 10.44); // 40% of 26.10
    assert.strictEqual(split.tier4Pool, 9.14);  // 35% of 26.10
    assert.strictEqual(split.tier3Pool, 6.53);  // 25% of 26.10
  });

  await test("Tithe Split: Maximum 50% charity contribution on $29/mo", () => {
    const split = calculateRevenueSplit(29.00, 50);
    assert.strictEqual(split.charityPercentage, 50);
    assert.strictEqual(split.charityAmount, 14.50);
    assert.strictEqual(split.grossPrizePool, 14.50);
    assert.strictEqual(split.tier5Pool, 5.80);
    assert.strictEqual(split.tier4Pool, 5.07);
    assert.strictEqual(split.tier3Pool, 3.63);
  });

  await test("Tithe Split: Yearly subscription ($290) at 25% charity", () => {
    const split = calculateRevenueSplit(290.00, 25);
    assert.strictEqual(split.charityPercentage, 25);
    assert.strictEqual(split.charityAmount, 72.50);
    assert.strictEqual(split.grossPrizePool, 217.50);
    assert.strictEqual(split.tier5Pool, 87.00);
    assert.strictEqual(split.tier4Pool, 76.13);
    assert.strictEqual(split.tier3Pool, 54.38);
  });

  // ==========================================================
  // SECTION 5: PROOF VERIFICATION & WINNERS LEDGER WORKFLOW
  // ==========================================================
  console.log("\n--- 5. PROOF VERIFICATION & WINNERS PIPELINE ---");

  await test("API: Upload scorecard proof for verification", async () => {
    const winnersRes = await fetch(`${BASE_URL}/api/winners`);
    const winnersData = await winnersRes.json();
    assert.ok(winnersData.winners.length > 0);
    const targetWinner = winnersData.winners[0];

    const uploadRes = await fetch(`${BASE_URL}/api/winners/${targetWinner.id}/upload-proof`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        proofUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1200&q=80"
      })
    });
    assert.strictEqual(uploadRes.status, 200);
    const uploadData = await uploadRes.json();
    assert.strictEqual(uploadData.success, true);
    assert.strictEqual(uploadData.winner.proof_url.length > 0, true);
    assert.strictEqual(uploadData.winner.status, "pending");
  });

  // ==========================================================
  // SECTION 6: AUTHENTICATION INTEGRITY & UNREGISTERED EMAIL REJECTION
  // ==========================================================
  console.log("\n--- 6. AUTHENTICATION INTEGRITY & REJECTION TESTS ---");

  await test("Auth Security: Unregistered email MUST be rejected (HTTP 404)", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "completely_fake_unregistered_email_9999@domain.org",
        password: "SomePassword123!"
      })
    });
    assert.strictEqual(res.status, 404);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.toLowerCase().includes("email not registered") || data.error.toLowerCase().includes("not registered"));
  });

  await test("Auth Security: Seed user login succeeds with valid credentials", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "player@digitalheroes.golf",
        password: "HeroGolf2026!"
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.email, "player@digitalheroes.golf");
  });

  const testNewUserEmail = `player_${Date.now()}@golfherotest.org`;

  await test("Auth Security: Sign up new user and verify login", async () => {
    const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testNewUserEmail,
        fullName: "Test Golfer",
        password: "MySecurePassword2026!"
      })
    });
    assert.strictEqual(signupRes.status, 200);
    const signupData = await signupRes.json();
    assert.strictEqual(signupData.success, true);
    assert.strictEqual(signupData.user.email, testNewUserEmail);

    // Verify duplicate registration rejection
    const dupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testNewUserEmail,
        fullName: "Duplicate Golfer",
        password: "MySecurePassword2026!"
      })
    });
    assert.strictEqual(dupRes.status, 400);

    // Verify login with correct password
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testNewUserEmail,
        password: "MySecurePassword2026!"
      })
    });
    assert.strictEqual(loginRes.status, 200);
    const loginData = await loginRes.json();
    assert.strictEqual(loginData.success, true);
    assert.strictEqual(loginData.user.full_name, "Test Golfer");

    // Verify login with incorrect password
    const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testNewUserEmail,
        password: "WrongPassword999!"
      })
    });
    assert.strictEqual(badLoginRes.status, 401);
  });

  console.log("\n==================================================================");
  console.log(`📊 FINAL TEST RUN RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runComprehensiveTests().catch((err) => {
  console.error("FATAL SUITE ERROR:", err);
  process.exit(1);
});
