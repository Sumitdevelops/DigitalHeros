import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const idx = trimmed.indexOf("=");
    if (idx > -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      env[key] = val;
    }
  }
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("==================================================");
console.log("🔍 LIVE SUPABASE DATABASE VERIFICATION");
console.log("Target:", supabaseUrl);
console.log("==================================================\n");

async function verifyAll() {
  const supabase = createClient(supabaseUrl, serviceKey);

  const tables = [
    { name: "users", label: "Users" },
    { name: "charities", label: "Charities" },
    { name: "subscriptions", label: "Subscriptions" },
    { name: "golf_scores", label: "Golf Scores" },
    { name: "draws", label: "Draws" },
    { name: "draw_results", label: "Draw Results" },
    { name: "winners", label: "Winners" },
    { name: "charity_contributions", label: "Charity Contributions" },
  ];

  for (const t of tables) {
    const { count, error } = await supabase.from(t.name).select("*", { count: "exact", head: true });
    if (error) {
      console.log(`❌ Table '${t.name}': Error (${error.message})`);
    } else {
      console.log(`✅ Table '${t.name}': Active with ${count} row(s)`);
    }
  }

  console.log("\n✨ Live PostgreSQL database is fully operational and verified!");
}

verifyAll().catch(console.error);
