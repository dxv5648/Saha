import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import supabase from "../supabase-client";

// Admin is stored in the DB (Option B): `profiles.is_admin`.
// RLS should ensure users can only read their own profile row.

const AuthContext = createContext(null);
export { AuthContext };

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const ensureProfileRow = useCallback(
    async (currentSession) => {
      const effectiveSession = currentSession ?? session;
      const userId = effectiveSession?.user?.id;
      if (!userId) return;

      try {
        // Create the profile row if it doesn't exist yet.
        // RLS policy "Profiles: insert own" allows this.
        const { error } = await supabase
          .from("profiles")
          .upsert({ id: userId }, { onConflict: "id" });
        if (error) throw error;
      } catch (e) {
        // Not fatal; admin check will just resolve to false.
        console.warn("profiles bootstrap failed:", e);
      }
    },
    [session],
  );

  const refreshIsAdmin = useCallback(async (currentSession) => {
    const effectiveSession = currentSession ?? session;
    if (!effectiveSession?.user) {
      setIsAdmin(false);
      setIsAdminLoading(false);
      return { isAdmin: false };
    }

    try {
      setIsAdminLoading(true);
      await ensureProfileRow(effectiveSession);
      const userId = effectiveSession.user.id;
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;

      const flag = Boolean(data?.is_admin);
      setIsAdmin(flag);
      return { isAdmin: flag };
    } catch (e) {
      console.warn("profiles is_admin check failed:", e);
      setIsAdmin(false);
      return { isAdmin: false, error: e };
    } finally {
      setIsAdminLoading(false);
    }
  }, [session, ensureProfileRow]);

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
          // If this fails we still want the app to render; treat as logged out.
          console.error("supabase.auth.getSession error:", error);
        }
        setSession(data?.session ?? null);
        setIsAuthReady(true);

        // Prime admin state once when we finish initializing.
        if (data?.session) refreshIsAdmin(data.session);
      } catch (err) {
        if (!isMounted) return;
        console.error("AuthProvider init exception:", err);
        setSession(null);
        setIsAuthReady(true);
      }
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setIsAuthReady(true);

        if (!newSession?.user) {
          // Logged out — immediately clear admin state, no async needed.
          setIsAdmin(false);
          return;
        }

        // Update admin state as soon as auth changes (covers Google OAuth too).
        ensureProfileRow(newSession);
        refreshIsAdmin(newSession);
      },
    );

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe?.();
    };
  }, [refreshIsAdmin, ensureProfileRow]);

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
        setIsAdmin(false);
        return await supabase.auth.signOut();
      },
    };
  }, [session, isAuthReady, isAdmin, isAdminLoading, refreshIsAdmin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


