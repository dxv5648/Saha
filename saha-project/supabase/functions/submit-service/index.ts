// Supabase Edge Function: submit-service
// - Runs AI spam check server-side
// - Creates/uses a locations row
// - Inserts a pending row into service_submissions
// - (Optional) emails admin via external provider (not implemented here)
//
// Deploy with: supabase functions deploy submit-service
// Secrets:
// - GEMINI_API_KEY

import { createClient } from "jsr:@supabase/supabase-js@2";

type ReqBody = {
  name: string;
  provider: string;
  category: string;
  description: string;
  location: {
    name: string;
    city: string;
    region: string;
    postal_code?: string | null;
    latitude?: number | null;
    // Deprecated.
    // This project switched to direct inserts into `service_submissions` from the client,
    // and DB-backed admin control via `profiles.is_admin`.

    Deno.serve(() => {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "deprecated",
          message: "Use direct DB inserts into service_submissions.",
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
async function geminiSpamCheck(input: unknown) {
