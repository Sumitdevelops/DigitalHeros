import crypto from "node:crypto";
import { getServiceSupabase, isSupabaseConfigured } from "./supabase";
import { User } from "@/types";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string, storedHashOrPlain: string | null | undefined): boolean {
  if (!storedHashOrPlain) return false;
  // Direct match or SHA-256 hash match
  const hashed = hashPassword(password);
  return storedHashOrPlain === hashed || storedHashOrPlain === password;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  code?: "EMAIL_NOT_REGISTERED" | "INVALID_PASSWORD" | "EMAIL_ALREADY_EXISTS" | "INTERNAL_ERROR";
}

/**
 * Authenticate user strictly against Supabase PostgreSQL database.
 * No mock accounts or mock fallbacks.
 */
export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  const trimmedEmail = email.trim().toLowerCase();

  const supabase = getServiceSupabase();
  if (!supabase || !isSupabaseConfigured) {
    return {
      success: false,
      error: "Supabase database is not configured. Please check your Supabase credentials.",
      code: "INTERNAL_ERROR"
    };
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .ilike("email", trimmedEmail)
      .maybeSingle();

    if (error) {
      console.error("Supabase auth lookup error:", error);
      return {
        success: false,
        error: "Database error during authentication: " + error.message,
        code: "INTERNAL_ERROR"
      };
    }

    if (!user) {
      // Account is NOT registered in Supabase
      return {
        success: false,
        error: "Email not registered. Please sign up or check your email address.",
        code: "EMAIL_NOT_REGISTERED"
      };
    }

    // User is registered in Supabase -> Verify password matches registered password
    const matches = verifyPassword(password, user.password_hash);
    if (!matches) {
      return {
        success: false,
        error: "Incorrect password. The registered password does not match this email.",
        code: "INVALID_PASSWORD"
      };
    }

    const authenticatedUser: User = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role as "subscriber" | "admin",
      avatar_url: user.avatar_url || undefined,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    return {
      success: true,
      user: authenticatedUser
    };
  } catch (err: any) {
    console.error("Supabase auth exception:", err);
    return {
      success: false,
      error: err.message || "Authentication failed.",
      code: "INTERNAL_ERROR"
    };
  }
}

/**
 * Register a new user strictly in Supabase PostgreSQL database.
 * No mock accounts or mock fallbacks.
 */
export async function registerUser(email: string, fullName: string, password: string): Promise<AuthResult> {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = fullName.trim();

  const supabase = getServiceSupabase();
  if (!supabase || !isSupabaseConfigured) {
    return {
      success: false,
      error: "Supabase database is not configured. Please check your Supabase credentials.",
      code: "INTERNAL_ERROR"
    };
  }

  try {
    // Check if email already registered in Supabase
    const { data: existing, error: checkError } = await supabase
      .from("users")
      .select("id, email")
      .ilike("email", trimmedEmail)
      .maybeSingle();

    if (checkError) {
      console.error("Supabase check error on registration:", checkError);
      return {
        success: false,
        error: "Failed to verify registration status with Supabase.",
        code: "INTERNAL_ERROR"
      };
    }

    if (existing) {
      return {
        success: false,
        error: "An account with this email address already exists. Please log in instead.",
        code: "EMAIL_ALREADY_EXISTS"
      };
    }

    // Insert new user into Supabase
    const hashedPassword = hashPassword(password);
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        email: trimmedEmail,
        full_name: trimmedName,
        password_hash: hashedPassword,
        role: "subscriber"
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase insert user error:", insertError);
      if (insertError.code === "23505") {
        return {
          success: false,
          error: "An account with this email address already exists. Please log in instead.",
          code: "EMAIL_ALREADY_EXISTS"
        };
      }
      return {
        success: false,
        error: "Failed to create user in Supabase: " + insertError.message,
        code: "INTERNAL_ERROR"
      };
    }

    const createdUser: User = {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      role: newUser.role as "subscriber" | "admin",
      avatar_url: newUser.avatar_url || undefined,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at
    };

    return {
      success: true,
      user: createdUser
    };
  } catch (err: any) {
    console.error("Supabase registration exception:", err);
    return {
      success: false,
      error: err.message || "Registration failed.",
      code: "INTERNAL_ERROR"
    };
  }
}
