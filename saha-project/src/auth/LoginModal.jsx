import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function LoginModal({ isOpen, onClose }) {
  const { signInWithPassword, signUp, signInWithProvider, resetPassword } =
    useAuth();

  const [mode, setMode] = useState("login"); // login | register | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const redirectTo = useMemo(() => window.location.origin, []);

  useEffect(() => {
    if (!isOpen) return;
    setMode("login");
    setError("");
    setNotice("");
    // keep email if user reopens quickly; clear password always
    setPassword("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const title =
    mode === "register"
      ? "Create your saha account."
      : mode === "forgot"
        ? "Reset your password."
        : "Sign into saha.";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        const { error: err } = await signInWithPassword({ email, password });
        if (err) throw err;
        onClose?.();
        return;
      }
      if (mode === "register") {
        const { error: err } = await signUp({
          email,
          password,
          emailRedirectTo: redirectTo,
        });
        if (err) throw err;
        setNotice(
          "Check your email to confirm your account (if email confirmation is enabled).",
        );
        return;
      }
      if (mode === "forgot") {
        const { error: err } = await resetPassword({ email, redirectTo });
        if (err) throw err;
        setNotice("If that email exists, a reset link has been sent.");
        return;
      }
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const oauth = async (provider) => {
    setError("");
    setNotice("");
    setIsSubmitting(true);
    try {
      const { error: err } = await signInWithProvider({ provider, redirectTo });
      if (err) throw err;
      // Supabase will redirect for OAuth flows; no further action here.
    } catch (err) {
      setError(err?.message || "OAuth sign-in failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Login"
    >
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/70"
        aria-label="Close"
        onClick={onClose}
        type="button"
      />

      {/* modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[20px] bg-[#0F0F0FB5] shadow-2xl border border-[#BABABA]/20 inter-regular">
        <div className="px-6 pb-6 pt-[60px]">
          <div className="absolute right-4 top-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-2 py-1 text-sm text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <span className="mb-[30px] block text-center text-3xl font-bold text-white poppins-bold">
            {title}
          </span>

          <form onSubmit={submit} className="flex flex-col">
            <input
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              className="mb-4 rounded-[10px] border border-solid border-[#BABABA]/40 bg-[#1A1A1A] px-3 py-4 text-lg text-white placeholder:text-[#BABABA]/60 focus:border-[#014A86] focus:outline-none transition-colors inter-regular"
              required
            />

            {mode !== "forgot" && (
              <input
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete={
                  mode === "register" ? "new-password" : "current-password"
                }
                className="mb-4 rounded-[10px] border border-solid border-[#BABABA]/40 bg-[#1A1A1A] px-3 py-4 text-lg text-white placeholder:text-[#BABABA]/60 focus:border-[#014A86] focus:outline-none transition-colors inter-regular"
                required
                minLength={6}
              />
            )}

            {error ? (
              <div className="mb-3 rounded-[10px] bg-red-500/15 px-3 py-2 text-sm text-red-200 inter-regular">
                {error}
              </div>
            ) : null}

            {notice ? (
              <div className="mb-3 rounded-[10px] bg-blue-500/15 px-3 py-2 text-sm text-blue-200 inter-regular">
                {notice}
              </div>
            ) : null}

            <button
              className={cx(
                "mb-4 rounded-[10px] border border-solid border-[#014A86]/60 bg-[#014A86] px-3 py-[17px] text-center text-lg text-white font-semibold transition-all inter-semi-bold",
                isSubmitting
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:border-[#014A86] hover:bg-[#0B3A6A]",
              )}
              style={{ boxShadow: "0px 4px 4px #00000040" }}
              disabled={isSubmitting}
              type="submit"
            >
              {mode === "register"
                ? "Create account"
                : mode === "forgot"
                  ? "Send reset link"
                  : "Sign in"}
            </button>
          </form>

          <div className="mb-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => oauth("google")}
              disabled={isSubmitting}
              className={cx(
                "rounded-[10px] border border-solid border-[#BABABA]/40 bg-[#1A1A1A] px-3 py-3 text-center text-sm text-white transition-all inter-semi-bold",
                isSubmitting
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:border-[#BABABA]/70 hover:bg-[#252525]",
              )}
            >
              Continue with Google
            </button>
          </div>

          <div className="flex flex-col items-center gap-4">
            {mode !== "register" ? (
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-base text-[#014A86] hover:text-[#0B5BA3] hover:underline transition-colors inter-regular"
              >
                Register to saha.
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-base text-[#014A86] hover:text-[#0B5BA3] hover:underline transition-colors inter-regular"
              >
                Already have an account? Sign in
              </button>
            )}

            {mode !== "forgot" ? (
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-base text-[#014A86] hover:text-[#0B5BA3] hover:underline transition-colors inter-regular"
              >
                Forgot Password
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-base text-[#014A86] hover:text-[#0B5BA3] hover:underline transition-colors inter-regular"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
