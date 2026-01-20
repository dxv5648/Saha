import { createContext, useContext, useEffect, useMemo, useState } from "react";
import supabase from "../supabase-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

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
      },
    );

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe?.();
    };
  }, []);

  const value = useMemo(() => {
    const user = session?.user ?? null;
    return {
      session,
      user,
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
        return await supabase.auth.signOut();
      },
    };
  }, [session, isAuthReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider />");
  }
  return ctx;
}


