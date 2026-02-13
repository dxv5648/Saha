import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import supabase from "../supabase-client";

// Admin is stored in the DB (Option B): `profiles.is_admin`.
// RLS should ensure users can only read their own profile row.

const AuthContext = createContext(null);
export { AuthContext };

// ── Standalone helpers (no React state, no dependency arrays) ──────────
// These are pure async functions so they never cause effect re-registration.

async function ensureProfileRow(userId) {
  if (!userId) return;
  try {
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId }, { onConflict: "id" });
    if (error) throw error;
  } catch (e) {
    console.warn("profiles bootstrap failed:", e);
  }
}

async function fetchIsAdmin(userId) {
  if (!userId) return false;
  try {
    await ensureProfileRow(userId);
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return Boolean(data?.is_admin);
  } catch (e) {
    console.warn("profiles is_admin check failed:", e);
    return false;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  // Track the latest userId we're checking so we can ignore stale responses.
  const adminCheckRef = useRef(0);

  // refreshIsAdmin accepts an explicit session so callers don't rely on stale
  // closure over the `session` state variable. It is intentionally dependency-
  // free so it never triggers effect re-registration.
  const refreshIsAdmin = useCallback(async (currentSession) => {
    const userId = currentSession?.user?.id;
    if (!userId) {
      setIsAdmin(false);
      setIsAdminLoading(false);
      return { isAdmin: false };
    }

    // Bump a counter so concurrent calls don't clobber each other.
    const checkId = ++adminCheckRef.current;
    setIsAdminLoading(true);

    const flag = await fetchIsAdmin(userId);

    // Only commit state if this is still the most recent check.
    if (checkId === adminCheckRef.current) {
      setIsAdmin(flag);
      setIsAdminLoading(false);
    }
    return { isAdmin: flag };
  }, []); // ← stable: no deps

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        // Email confirmation + OAuth redirects can land back with a `code` param.
        // We must exchange it for a session so the user becomes logged in.
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(
            window.location.href,
          );
          if (error) {
            console.error("supabase.auth.exchangeCodeForSession error:", error);
          } else {
            // Clean up URL (removes ?code=... etc.)
            url.searchParams.delete("code");
            url.searchParams.delete("state");
            url.searchParams.delete("error");
            url.searchParams.delete("error_code");
            url.searchParams.delete("error_description");
            window.history.replaceState({}, document.title, url.toString());
          }
        }

        const { data, error } = await supabase.auth.getSession();
        if (!isMounted) return;
        if (error) {
          console.error("supabase.auth.getSession error:", error);
        }

        const initialSession = data?.session ?? null;
        setSession(initialSession);
        setIsAuthReady(true);

        // Prime admin state once when we finish initializing.
        if (initialSession) {
          refreshIsAdmin(initialSession);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("AuthProvider init exception:", err);
        setSession(null);
        setIsAuthReady(true);
      }
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!isMounted) return;

        setSession(newSession);
        setIsAuthReady(true);

        if (!newSession?.user) {
          // Logged out — immediately clear admin state, no async needed.
          setIsAdmin(false);
          setIsAdminLoading(false);
          return;
        }

        // Update admin state as soon as auth changes (covers Google OAuth too).
        refreshIsAdmin(newSession);
      },
    );

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe?.();
    };
  }, [refreshIsAdmin]); // refreshIsAdmin is stable (no deps), so this effect runs once

  const value = useMemo(() => {
    const user = session?.user ?? null;
    return {
      session,
      user,
      isAdmin,
      isAdminLoading,
      refreshIsAdmin,
      isAuthReady,
      signInWithPassword: async ({ email, password }) => {
        return await supabase.auth.signInWithPassword({ email, password });
      },
      signUp: async ({ email, password, emailRedirectTo }) => {
        return await supabase.auth.signUp({
          email,
          password,
          options: emailRedirectTo ? { emailRedirectTo } : undefined,
        });
      },
      signInWithProvider: async ({ provider, redirectTo }) => {
        return await supabase.auth.signInWithOAuth({
          provider,
          options: redirectTo ? { redirectTo } : undefined,
        });
      },
      resetPassword: async ({ email, redirectTo }) => {
        return await supabase.auth.resetPasswordForEmail(email, redirectTo
          ? { redirectTo }
          : undefined);
      },
      signOut: async () => {
        // Clear admin state synchronously first so the UI never shows an
        // admin tab for a logged-out user, even for a single frame.
        setIsAdmin(false);
        setIsAdminLoading(false);
        setSession(null);
        return await supabase.auth.signOut();
      },
    };
  }, [session, isAuthReady, isAdmin, isAdminLoading, refreshIsAdmin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


