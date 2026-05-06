/**
 * Single source of truth for email visual chrome — dark #080808 background,
 * cream #F0EBE3 text, orange #E05A0C accent. Mobile-responsive via inline
 * CSS only (no <style> tags, since many clients strip them).
 */

const SITE_URL = "https://nathanokoye.com";
const BG = "#080808";
const TEXT = "#F0EBE3";
const TEXT_MUTED = "rgba(240,235,227,0.62)";
const ACCENT = "#E05A0C";
const RULE = "rgba(240,235,227,0.14)";

export interface RenderArgs {
  title: string;       // shown in <title>
  preheader?: string;  // hidden preview text in inbox
  bodyHtml: string;    // pre-rendered inner HTML
  unsubscribeUrl: string;
}

export function renderEmail({
  title,
  preheader = "",
  bodyHtml,
  unsubscribeUrl,
}: RenderArgs): string {
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${BG};color:${TEXT};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;color:${BG};">${escapeHtml(preheader)}</div>` : ""}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${BG};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;">
      <tr><td style="padding:0 0 24px;">
        <p style="margin:0;font-family:Georgia,'Iowan Old Style','Palatino Linotype',serif;font-size:18px;letter-spacing:0.04em;color:${TEXT};">Nathan Okoye <span style="color:${TEXT_MUTED};font-size:12px;letter-spacing:0.18em;text-transform:uppercase;margin-left:8px;">Brand Strategist</span></p>
      </td></tr>
      <tr><td style="font-size:16px;line-height:1.65;color:${TEXT};">
        ${bodyHtml}
      </td></tr>
      <tr><td style="padding:36px 0 0;border-top:1px solid ${RULE};font-size:12px;line-height:1.6;color:${TEXT_MUTED};">
        <p style="margin:0 0 6px;">Nathan Okoye · Brand Strategist · Toronto, Canada</p>
        <p style="margin:0;">
          <a href="${escapeAttr(unsubscribeUrl)}" style="color:${TEXT_MUTED};text-decoration:underline;">Unsubscribe</a>
          &nbsp;·&nbsp;
          <a href="${SITE_URL}" style="color:${TEXT_MUTED};text-decoration:underline;">nathanokoye.com</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

/** Pill-shaped CTA button — use inside a body block. */
export function ctaButton(label: string, href: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
  <tr><td bgcolor="${ACCENT}" style="border-radius:999px;">
    <a href="${escapeAttr(href)}" style="display:inline-block;padding:14px 28px;color:${TEXT};background:${ACCENT};text-decoration:none;font-weight:600;border-radius:999px;letter-spacing:0.02em;">${escapeHtml(label)}</a>
  </td></tr>
</table>`;
}

/** Subtle inline link inside the body. */
export function inlineLink(label: string, href: string): string {
  return `<a href="${escapeAttr(href)}" style="color:${ACCENT};text-decoration:underline;">${escapeHtml(label)}</a>`;
}

/** Tier label shown above the headline — bracketed in oxblood/orange. */
export function tierLabel(label: string): string {
  return `<p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;color:${ACCENT};">[ ${escapeHtml(label)} ]</p>`;
}

/** Editorial H1 inside an email. */
export function emailH1(text: string): string {
  return `<h1 style="margin:0 0 16px;font-family:Georgia,'Iowan Old Style','Palatino Linotype',serif;font-size:28px;line-height:1.2;letter-spacing:-0.01em;font-weight:400;color:${TEXT};">${escapeHtml(text)}</h1>`;
}

/** Score callout block. */
export function scoreCallout(label: string, scoreOf50: number): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;border:1px solid ${RULE};border-radius:6px;width:100%;">
    <tr><td style="padding:18px 22px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${TEXT_MUTED};">Your score</p>
      <p style="margin:0;font-family:Georgia,serif;font-size:32px;line-height:1;color:${TEXT};">${scoreOf50}<span style="font-size:14px;color:${TEXT_MUTED};margin-left:6px;">/ 50</span></p>
      <p style="margin:8px 0 0;font-size:13px;color:${TEXT_MUTED};">${escapeHtml(label)}</p>
    </td></tr>
  </table>`;
}

function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}
