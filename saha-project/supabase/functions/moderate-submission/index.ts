// Deprecated.
// Moderation is now handled via direct DB updates guarded by RLS for admins.

Deno.serve(() => {
  return new Response(
    JSON.stringify({
      ok: false,
      error: "deprecated",
      message: "Moderate via DB (service_submissions) using profiles.is_admin + RLS.",
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
