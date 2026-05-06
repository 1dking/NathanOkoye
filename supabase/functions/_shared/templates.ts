// deno-lint-ignore-file no-explicit-any
import { getServiceClient } from "./supabase.ts";

export interface EmailTemplate {
  id: string;
  sequence_type: string;
  tier: string | null;
  step: number;
  subject: string;
  body_html: string;
  delay_days: number;
  active: boolean;
}

/**
 * Map an assessment's result_tier label to the sequence_type slug used
 * everywhere downstream (sequence_enrollments, email_templates, logs).
 */
export function tierKeyFromLabel(resultTier: string): string {
  const t = (resultTier ?? "").toLowerCase();
  if (t.includes("strategically")) return "strategically-authentic";
  if (t.includes("unfocused")) return "authentic-but-unfocused";
  if (t.includes("templates")) return "following-templates";
  return "generic-content";
}

/** Fetch the active template for (sequence_type, step). */
export async function getTemplate(
  sequenceType: string,
  step: number,
): Promise<EmailTemplate | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("email_templates")
    .select("*")
    .eq("sequence_type", sequenceType)
    .eq("step", step)
    .eq("active", true)
    .maybeSingle();
  if (error) {
    console.warn("template fetch failed", { sequenceType, step, error });
    return null;
  }
  return (data as EmailTemplate | null) ?? null;
}

export interface TemplateVars {
  first_name: string;
  unsubscribe_url: string;
  score?: number | string;
  [key: string]: string | number | undefined;
}

/** Replace {{key}} placeholders in `s` using `vars`. Missing keys → "". */
export function applyVars(s: string, vars: TemplateVars): string {
  return s.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const v = (vars as any)[key];
    return v === undefined || v === null ? "" : String(v);
  });
}

/** Build the unsubscribe URL pattern used everywhere. */
export function unsubscribeUrl(enrollmentId: string): string {
  const base = Deno.env.get("SUPABASE_URL")!;
  return `${base}/functions/v1/unsubscribe?token=${enrollmentId}`;
}
