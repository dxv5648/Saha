import { useEffect, useMemo, useState } from "react";
import supabase from "../supabase-client";
import Header from "../home-page/header.jsx";
import Footer from "../home-page/footer.jsx";

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value);
  }
}

export default function AdminModeration() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [actionBusy, setActionBusy] = useState(false);

  const selected = useMemo(
    () => items.find((x) => x.id === selectedId) || null,
    [items, selectedId],
  );

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("service_submissions")
        .select("*, locations(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setItems(data || []);
      if (!selectedId && data?.[0]?.id) setSelectedId(data[0].id);
    } catch (e) {
      const msg = e?.message || "Failed to load submissions";
      if (
        typeof msg === "string" &&
        (msg.includes("Could not find the table") ||
          msg.includes("schema cache") ||
          msg.includes("public.service_submissions"))
      ) {
        setError(
          "Missing table: `service_submissions`. Create it in Supabase (Table Editor) before using the admin dashboard.",
        );
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function moderateSubmission({ id, decision }) {
    setActionBusy(true);
    setError("");
    try {
      const status = decision === "approve" ? "approved" : "denied";

      const { error } = await supabase
        .from("service_submissions")
        .update({ status, reviewed_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      await load();
    } catch (e) {
      setError(e?.message || "Moderation failed");
    } finally {
      setActionBusy(false);
    }
  }

  return (
    <div className="bg-black min-h-screen min-w-screen flex flex-col">
      <Header />

      <div className="flex flex-col w-full max-w-6xl mx-auto px-6 py-10 gap-6">
        <h1 className="text-white text-3xl poppins-bold">
          Admin • Pending Service Posts
        </h1>

        {error && (
          <div className="bg-red-950/50 border border-red-500/40 text-red-100 rounded-xl p-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-[#121212] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold">Submissions</p>
              <button
                type="button"
                onClick={load}
                className="text-xs px-3 py-2 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/60"
                disabled={loading}
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-white/70 text-sm">Loading…</p>
            ) : items.length === 0 ? (
              <p className="text-white/70 text-sm">No submissions found.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[70vh] overflow-auto pr-1">
                {items.map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => setSelectedId(it.id)}
                    className={`text-left rounded-xl p-3 border transition ${
                      selectedId === it.id
                        ? "bg-white text-black border-white"
                        : "bg-[#0F0F0F] text-white border-white/10 hover:border-white/40"
                    }`}
                  >
                    <p className="font-semibold line-clamp-1">{it.name}</p>
                    <p className="text-xs opacity-80 line-clamp-1">
                      {it.category} • {it.provider}
                    </p>
                    <p className="text-[11px] opacity-70 mt-1">
                      {formatDate(it.created_at)}
                    </p>
                    <p className="text-[11px] opacity-70">
                      status: {it.status || "pending"}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2 bg-[#121212] border border-white/10 rounded-2xl p-6">
            {!selected ? (
              <p className="text-white/70 text-sm">Select a submission.</p>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h2 className="text-white text-2xl font-bold">
                      {selected.name}
                    </h2>
                    <p className="text-white/70 text-sm mt-1">
                      {selected.category} • {selected.provider}
                    </p>
                    <p className="text-white/60 text-xs mt-1">
                      Submitted: {formatDate(selected.created_at)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={actionBusy}
                      onClick={() => moderateSubmission({ id: selected.id, decision: "approve" })}
                      className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={actionBusy}
                      onClick={() => moderateSubmission({ id: selected.id, decision: "deny" })}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold disabled:opacity-50"
                    >
                      Deny
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="Location" value={selected?.locations?.name || "—"} />
                  <Info label="City" value={selected?.locations?.city || "—"} />
                  <Info label="Region" value={selected?.locations?.region || "—"} />
                  <Info label="Country" value={selected?.locations?.country || "—"} />
                  <Info label="Spam verdict" value={selected.spam_verdict || "—"} />
                  <Info
                    label="Spam confidence"
                    value={
                      selected.spam_confidence === null || selected.spam_confidence === undefined
                        ? "—"
                        : String(selected.spam_confidence)
                    }
                  />
                </div>

                <div>
                  <p className="text-white font-semibold mb-2">Description</p>
                  <p className="text-white/80 text-sm whitespace-pre-wrap bg-[#0F0F0F] border border-white/10 rounded-xl p-4">
                    {selected.description || ""}
                  </p>
                </div>

                <div>
                  <p className="text-white font-semibold mb-2">Services & prices</p>
                  <p className="text-white/80 text-sm bg-[#0F0F0F] border border-white/10 rounded-xl p-4">
                    <span className="text-white/60">service_list:</span> {selected.service_list || ""}
                    <br />
                    <span className="text-white/60">service_price:</span> {selected.service_price || ""}
                  </p>
                </div>

                {Array.isArray(selected.spam_reasons) && selected.spam_reasons.length > 0 && (
                  <div>
                    <p className="text-white font-semibold mb-2">Spam reasons</p>
                    <ul className="list-disc ml-5 text-white/80 text-sm">
                      {selected.spam_reasons.map((r, idx) => (
                        <li key={idx}>{String(r)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer className="mt-auto" />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-[#0F0F0F] border border-white/10 rounded-xl p-4">
      <p className="text-white/60 text-xs">{label}</p>
      <p className="text-white text-sm mt-1 break-words">{value}</p>
    </div>
  );
}
