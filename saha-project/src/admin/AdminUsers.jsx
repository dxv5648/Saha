import { useEffect, useMemo, useState } from "react";
import supabase from "../supabase-client";
import { useAuth } from "../auth/useAuth";

/**
 * Admin-only UI.
 *
 * Contract:
 * - Input: user UUID (from Supabase Auth Users list) or an email lookup (best-effort).
 * - Action: calls an RPC that only admins can execute to set profiles.is_admin.
 */
export default function AdminUsers() {
  const { isAdmin } = useAuth();
  const [targetEmail, setTargetEmail] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean((targetUserId || targetEmail) && isAdmin && !busy);
  }, [targetUserId, targetEmail, isAdmin, busy]);

  useEffect(() => {
    setMessage(null);
  }, [targetEmail, targetUserId]);

  async function lookupUserIdByEmail(email) {
    // Note: Supabase Auth users are not queryable from the client securely.
    // This is here only if you later add a secure admin RPC to do the lookup.
    // For now, admins should paste the user's UUID.
    throw new Error(
      "Email lookup is not supported client-side. Paste the user's UUID instead.",
    );
  }

  async function makeAdmin(e) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);

    try {
      if (!isAdmin) throw new Error("Not an admin");

      const userId = targetUserId?.trim()
        ? targetUserId.trim()
        : await lookupUserIdByEmail(targetEmail.trim().toLowerCase());

      const { error } = await supabase.rpc("set_admin", {
        target_user_id: userId,
        make_admin: true,
      });

      if (error) throw error;
      setMessage({ type: "success", text: `Granted admin to ${userId}` });
      setTargetEmail("");
      setTargetUserId("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to grant admin",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Admin users</h2>
      <p>
        Promote another account to admin. For now, paste the user's UUID from
        Supabase Dashboard → Authentication → Users.
      </p>

      <form onSubmit={makeAdmin} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <label>
          User UUID
          <input
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            placeholder="e.g. 0f2e6b7a-...."
            style={{ width: "100%" }}
          />
        </label>

        <div style={{ opacity: 0.7 }}>
          Or email (not supported yet):
        </div>
        <label>
          Email
          <input
            value={targetEmail}
            onChange={(e) => setTargetEmail(e.target.value)}
            placeholder="email@example.com"
            style={{ width: "100%" }}
            disabled
          />
        </label>

        <button type="submit" disabled={!canSubmit}>
          {busy ? "Working..." : "Make admin"}
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 8,
            background: message.type === "error" ? "#3b1d1d" : "#16311d",
            color: "white",
          }}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
