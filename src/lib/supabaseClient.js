// ─────────────────────────────────────────────────────────────
// Supabase client — Private Storage & Auth-Gated Access
//
// Ensures genuine privacy: private files are stored in a private
// bucket ("bouquet-media") with Row Level Security (RLS) enabled.
// No signed media URL exists unless there is an active session.
// ─────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "https://your-project.supabase.co" &&
  !supabaseUrl.includes("placeholder")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Cache signed URLs in memory during the session so we don't spam the API
const signedUrlCache = new Map();

/**
 * Request a short-lived signed URL for a file in the private "bouquet-media" bucket.
 * Returns null if Supabase is not configured or if access is unauthorized.
 */
export async function getSignedMediaUrl(storagePath, expiresInSeconds = 3600) {
  if (!storagePath) return null;
  if (!supabase) return null;

  // Check cache (with 60-second safety window before expiry)
  const cached = signedUrlCache.get(storagePath);
  if (cached && cached.expiresAt > Date.now() + 60000) {
    return cached.url;
  }

  try {
    const { data, error } = await supabase.storage
      .from("bouquet-media")
      .createSignedUrl(storagePath, expiresInSeconds);

    if (error) {
      console.warn(`[Supabase Storage] Could not sign URL for ${storagePath}:`, error.message);
      return null;
    }

    if (data?.signedUrl) {
      signedUrlCache.set(storagePath, {
        url: data.signedUrl,
        expiresAt: Date.now() + expiresInSeconds * 1000,
      });
      return data.signedUrl;
    }
  } catch (err) {
    console.error("[Supabase Storage] Network error while fetching signed URL:", err);
  }

  return null;
}

/**
 * Sign in using Supabase magic link (email OTP)
 */
export async function signInWithMagicLink(email) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
}

/**
 * Sign in with email & password (if you set up a dedicated girlfriend account)
 */
export async function signInWithCredentials(email, password) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }
  return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign in anonymously if permitted by project settings
 */
export async function signInAnonymously() {
  if (!supabase) return null;
  return supabase.auth.signInAnonymously?.() || null;
}

/**
 * Get current active user session
 */
export async function getCurrentSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

/**
 * Sign out
 */
export async function signOut() {
  if (!supabase) return;
  signedUrlCache.clear();
  return supabase.auth.signOut();
}
