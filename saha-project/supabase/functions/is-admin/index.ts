// Deprecated.
// This project switched to DB-backed admin control (Option B): `profiles.is_admin`.
// Edge Functions are no longer used for admin detection.
//
// Keeping this file as a stub so accidental deploys don't expose behavior.

Deno.serve(() => {
  return new Response(
    JSON.stringify({
      ok: false,
      error: "deprecated",
      message: "Use profiles.is_admin instead of Edge Functions.",
    }),
    {
      status: 410,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
});
