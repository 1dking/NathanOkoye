// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/supabase.ts";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const page = (title: string, message: string) => `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
  html,body{margin:0;padding:0;background:#080808;color:#F0EBE3;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    min-height:100vh;}
  main{max-width:480px;margin:0 auto;padding:14vh 24px 6vh;text-align:center;}
  h1{font-family:Georgia,serif;font-weight:400;font-size:32px;line-height:1.2;letter-spacing:-0.01em;margin:0 0 16px;}
  p{font-size:16px;line-height:1.6;color:rgba(240,235,227,0.78);margin:0 0 24px;}
  a.btn{display:inline-block;background:#E05A0C;color:#F0EBE3;text-decoration:none;
    padding:12px 24px;border-radius:999px;font-weight:600;letter-spacing:0.02em;}
  .small{font-size:12px;color:rgba(240,235,227,0.55);margin-top:32px;}
  .small a{color:rgba(240,235,227,0.7);}
</style></head><body>
<main>
  <h1>${title}</h1>
  <p>${message}</p>
  <a class="btn" href="https://nathanokoye.com">Return to nathanokoye.com</a>
  <p class="small">Nathan Okoye · Brand Strategist · Toronto, Canada</p>
</main></body></html>`;

const htmlResponse = (body: string, init: ResponseInit = {}) =>
  new Response(body, {
    ...init,
    headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
  });

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "GET") {
    return htmlResponse(
      page("Unsubscribe", "This endpoint accepts GET requests only."),
      { status: 405 },
    );
  }

  const url = new URL(req.url);
  const token = (url.searchParams.get("token") ?? "").trim();

  if (!token || !UUID_RE.test(token)) {
    return htmlResponse(
      page(
        "Unsubscribe link invalid",
        "The unsubscribe link looks malformed. Reply to any email from Nathan Okoye and we'll remove you manually.",
      ),
      { status: 400 },
    );
  }

  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("sequence_enrollments")
    .update({ unsubscribed: true, completed: true })
    .eq("id", token)
    .select("email")
    .maybeSingle();

  if (error || !data) {
    return htmlResponse(
      page(
        "Already unsubscribed",
        "We could not find an active subscription for this link. You're already off the list.",
      ),
    );
  }

  return htmlResponse(
    page(
      "You have been unsubscribed",
      `You have been unsubscribed from Nathan Okoye emails. Sorry to see you go.`,
    ),
  );
});
