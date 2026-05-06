/**
 * Tier mapping + email sequence definitions.
 * Single source of truth so on-assessment-submit (Step 0) and
 * process-sequences (Steps 1+) read from the same data.
 */

import {
  ctaButton,
  emailH1,
  inlineLink,
  renderEmail,
  scoreCallout,
  tierLabel,
} from "./email-template.ts";

const SITE = "https://nathanokoye.com";

export type TierKey =
  | "generic-content"
  | "following-templates"
  | "authentic-but-unfocused"
  | "strategically-authentic";

/** Map the tier label stored in assessment_submissions.result_tier to a key. */
export function tierKeyFromLabel(resultTier: string): TierKey {
  const t = (resultTier ?? "").toLowerCase();
  if (t.includes("strategically")) return "strategically-authentic";
  if (t.includes("unfocused")) return "authentic-but-unfocused";
  if (t.includes("templates")) return "following-templates";
  return "generic-content";
}

export const TIER_DETAIL: Record<
  TierKey,
  { label: string; description: string; focus: string }
> = {
  "strategically-authentic": {
    label: "Strategically Authentic",
    description:
      "The alignment between who you are and how your brand represents you is generating real results. The foundation is solid. The work now is not repair it is compounding. Sharper systems, wider reach, and a structured engagement strategy that moves your audience from attention to action.",
    focus:
      "Repeatable Systems and Engagement Strategy. You have the identity and the organic reach. Build the infrastructure that makes it consistent at scale and converts attention into conversations.",
  },
  "authentic-but-unfocused": {
    label: "Authentic but Unfocused",
    description:
      "You have genuine expertise, a real point of view, and enough presence that the right people find you. What is missing is the sharpness that makes the right person stop and say this is exactly what I have been looking for. You are reaching people, but not reliably converting that reach into the right conversations.",
    focus:
      "Distinctiveness and Authentic Expression. Your content needs to speak your client's language more precisely than it currently does. The gap is in translation, not in substance.",
  },
  "following-templates": {
    label: "Following Templates",
    description:
      "Your brand is functional but forgettable. You are using the language of your category instead of the language that is uniquely yours. Prospects who find you understand what you do, but they cannot feel why you are the right person to do it for them.",
    focus:
      "Distinctiveness first, then Organic Reach. Before systems, before ads, before consistency the foundation needs to be set. What makes you genuinely different must be identified and articulated before anything else is built.",
  },
  "generic-content": {
    label: "Generic Content",
    description:
      "Content exists, but it is not creating distinction, recognition, or pipeline movement. This is not a reflection of the quality of your work. It is a reflection of how your brand is currently representing it. The gap between your actual expertise and your public presence is significant and that gap is the source of every slow referral, every price objection, and every prospect who seemed interested and then went quiet.",
    focus:
      "Identity before everything. Nothing built on an unclear foundation will compound. The CORE framework starts with one question who are you to the people you serve, and does anything you are currently putting into the world reflect that accurately?",
  },
};

/** Step intervals (in days) AFTER Step 0. Step 0 is sent immediately. */
export const SEQUENCE_INTERVALS_DAYS: Record<TierKey, number[]> = {
  "generic-content":         [3, 7, 14],
  "following-templates":     [3, 7, 14],
  "authentic-but-unfocused": [5, 14],
  "strategically-authentic": [7],
};

/** Playbook sequence — single confirmation step then a passive nudge later. */
export const PLAYBOOK_INTERVALS_DAYS: number[] = [3];

interface Step {
  subject: string;
  build: (firstName: string, totalScore: number, unsubscribeUrl: string) => string;
}

const p = (s: string) =>
  `<p style="margin:0 0 16px;color:#F0EBE3;">${s}</p>`;

const pSoft = (s: string) =>
  `<p style="margin:0 0 16px;color:rgba(240,235,227,0.78);">${s}</p>`;

const greeting = (firstName: string) =>
  `<p style="margin:0 0 16px;color:#F0EBE3;">Hi ${escape(firstName)},</p>`;

const sign = `<p style="margin:24px 0 0;color:#F0EBE3;">— Nathan</p>`;

function escape(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ================== STEP 0 (immediate result emails) ================== */

function buildResultEmail(tier: TierKey): Step {
  const detail = TIER_DETAIL[tier];
  const isHighTier = tier === "strategically-authentic";
  const ctaText = isHighTier
    ? "See how the CORE framework compounds what you have already built →"
    : "Book The CORE Discovery Session →";
  const ctaHref = isHighTier
    ? `${SITE}/core-framework`
    : `${SITE}/work-with-nathan`;

  return {
    subject: `Your Strategic Authenticity Assessment Result [ ${detail.label} ]`,
    build: (firstName, totalScore, unsubscribeUrl) => {
      const body = [
        greeting(firstName),
        scoreCallout(detail.label, totalScore),
        tierLabel(detail.label),
        emailH1(detail.description.split(".")[0] + "."),
        pSoft(detail.description),
        `<p style="margin:0 0 8px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#E05A0C;">Your focus</p>`,
        pSoft(detail.focus),
        ctaButton(ctaText, ctaHref),
        sign,
      ].join("\n");
      return renderEmail({
        title: `Your result · ${detail.label}`,
        preheader: `Score: ${totalScore} / 50 · ${detail.label}`,
        bodyHtml: body,
        unsubscribeUrl,
      });
    },
  };
}

/* ================== ASSESSMENT FOLLOW-UP STEPS ================== */

const STEPS: Record<TierKey, Step[]> = {
  "generic-content": [
    {
      subject: "The gap between your expertise and your brand",
      build: (fn, _, un) =>
        renderEmail({
          title: "The gap between expertise and brand",
          preheader: "Cheryl Hudson — what changed when the brand finally matched the work.",
          unsubscribeUrl: un,
          bodyHtml: [
            greeting(fn),
            p("A senior philanthropic advisor came to me with a brand that communicated none of her expertise. The track record was real. The credibility in her network was real. The public-facing presence was not. Within six months of rebuilding the positioning, she acquired a philanthropic advisory engagement worth over $75 million — not from a campaign, not from outreach, from being seen clearly for the first time."),
            pSoft(`The full story: ${inlineLink("Read the case study", `${SITE}/case-study-advisor`)}.`),
            ctaButton("Book The CORE Discovery Session →", `${SITE}/work-with-nathan`),
            sign,
          ].join("\n"),
        }),
    },
    {
      subject: "What closing the gap actually looks like",
      build: (fn, _, un) =>
        renderEmail({
          title: "What closing the gap looks like",
          preheader: "Sold out for the first time in 15 years — only the conversation changed.",
          unsubscribeUrl: un,
          bodyHtml: [
            greeting(fn),
            p("A performing arts organisation hadn't sold out an event in 15 years. The product hadn't declined — the conversation around it had. Two months of repositioned content and structured performance marketing later, the event sold out for the first time in over a decade. Same product, new precision."),
            pSoft(`${inlineLink("Read the full case study", `${SITE}/case-study-arts`)}.`),
            ctaButton("Book The CORE Discovery Session →", `${SITE}/work-with-nathan`),
            sign,
          ].join("\n"),
        }),
    },
    {
      subject: "One conversation changes everything",
      build: (fn, _, un) =>
        renderEmail({
          title: "One conversation",
          preheader: "Your assessment score told me where the gap is. The Discovery Session closes it.",
          unsubscribeUrl: un,
          bodyHtml: [
            greeting(fn),
            p("Your assessment score tells me exactly where the gap is. The Discovery Session closes it. If you are ready — the link is below."),
            ctaButton("Book The CORE Discovery Session →", `${SITE}/work-with-nathan`),
            sign,
          ].join("\n"),
        }),
    },
  ],

  "following-templates": [
    {
      subject: "What happens when the foundation is set first",
      build: (fn, _, un) =>
        renderEmail({
          title: "Foundation first",
          preheader: "Caribana Ignite — 15,000 attendees from a brand built from nothing.",
          unsubscribeUrl: un,
          bodyHtml: [
            greeting(fn),
            p("A founder building a civic institution in partnership with a municipal government had a vision but no brand. We built positioning, platform, and content from the ground up — foundation first, then everything else. Fifteen thousand people showed up to an event with no prior history, no established audience, and no brand equity the week before we started. That's what happens when the foundation is set first."),
            pSoft(`${inlineLink("Read the case study", `${SITE}/case-study-institution`)}.`),
            ctaButton("Book The CORE Discovery Session →", `${SITE}/work-with-nathan`),
            sign,
          ].join("\n"),
        }),
    },
    {
      subject: "The CORE framework — built from experience",
      build: (fn, _, un) =>
        renderEmail({
          title: "The CORE framework",
          preheader: "Four layers — Creative Authenticity, Organic Reach, Repeatable Systems, Engagement Strategy.",
          unsubscribeUrl: un,
          bodyHtml: [
            greeting(fn),
            p("CORE is four layers. Each one builds on the one before it."),
            `<p style="margin:0 0 12px;color:#F0EBE3;"><strong style="color:#E05A0C;">C — Creative Authenticity.</strong> Content that only you could make, not the language of your category.</p>`,
            `<p style="margin:0 0 12px;color:#F0EBE3;"><strong style="color:#E05A0C;">O — Organic Reach.</strong> The right positioning makes the right audience self-select.</p>`,
            `<p style="margin:0 0 12px;color:#F0EBE3;"><strong style="color:#E05A0C;">R — Repeatable Systems.</strong> Two-hour content production that compounds, not exhausts.</p>`,
            `<p style="margin:0 0 16px;color:#F0EBE3;"><strong style="color:#E05A0C;">E — Engagement Strategy.</strong> Audience to client base, through structured conversation.</p>`,
            pSoft(`${inlineLink("Read the full framework", `${SITE}/core-framework`)}.`),
            ctaButton("Book The CORE Discovery Session →", `${SITE}/work-with-nathan`),
            sign,
          ].join("\n"),
        }),
    },
    {
      subject: "The first step is always the same",
      build: (fn, _, un) =>
        renderEmail({
          title: "The first step",
          preheader: "Your score points to where the foundation needs to be set.",
          unsubscribeUrl: un,
          bodyHtml: [
            greeting(fn),
            p("Your assessment score tells me exactly where the gap is. The Discovery Session closes it. If you are ready — the link is below."),
            ctaButton("Book The CORE Discovery Session →", `${SITE}/work-with-nathan`),
            sign,
          ].join("\n"),
        }),
    },
  ],

  "authentic-but-unfocused": [
    {
      subject: "When the raw material is there but the precision is not",
      build: (fn, _, un) =>
        renderEmail({
          title: "Raw material vs precision",
          preheader: "$39,378 in revenue followed when the same product was finally positioned right.",
          unsubscribeUrl: un,
          bodyHtml: [
            greeting(fn),
            p("A subject-matter expert had a product the market celebrated but did not buy. Schools wanted to support the work — they didn't know how to implement it. The product read as a passion project, not a system. The repositioning reframed it as an institutional system, directed at the buyers with the authority and budget to adopt it. $39,378 in online revenue followed within the campaign window. Same product, sharper positioning."),
            pSoft(`${inlineLink("Read the case study", `${SITE}/case-study-publisher`)}.`),
            ctaButton("Book The CORE Discovery Session →", `${SITE}/work-with-nathan`),
            sign,
          ].join("\n"),
        }),
    },
    {
      subject: "The Discovery Session finds exactly where the translation breaks down",
      build: (fn, _, un) =>
        renderEmail({
          title: "Where translation breaks down",
          preheader: "You have the expertise. The Discovery Session pinpoints where the language is losing people.",
          unsubscribeUrl: un,
          bodyHtml: [
            greeting(fn),
            p("You have the expertise. The CORE Discovery Session identifies precisely where the language is losing people before they become clients."),
            ctaButton("Book The CORE Discovery Session →", `${SITE}/work-with-nathan`),
            sign,
          ].join("\n"),
        }),
    },
  ],

  "strategically-authentic": [
    {
      subject: "The next layer — systems and engagement",
      build: (fn, _, un) =>
        renderEmail({
          title: "Systems and engagement",
          preheader: "A strong foundation means the next work is compounding — repeatable systems and conversion architecture.",
          unsubscribeUrl: un,
          bodyHtml: [
            greeting(fn),
            p("A strong foundation means the next work is compounding it — repeatable systems and an engagement strategy that converts attention into clients. That is what the CORE Brand Build is built to do."),
            ctaButton("Explore working together →", `${SITE}/work-with-nathan`),
            sign,
          ].join("\n"),
        }),
    },
  ],
};

export function getStep0Email(tier: TierKey): Step {
  return buildResultEmail(tier);
}

export function getAssessmentStep(tier: TierKey, stepIndex: number): Step | null {
  const arr = STEPS[tier];
  return arr[stepIndex - 1] ?? null; // step 1 → arr[0]
}

/* ================== PLAYBOOK SEQUENCE ================== */

export function getPlaybookConfirmationEmail(): Step {
  return {
    subject: "Your Visibility Playbook is on its way",
    build: (firstName, _score, un) =>
      renderEmail({
        title: "Playbook on its way",
        preheader: "A practical guide for consultants, coaches, and advisors done posting into the void.",
        unsubscribeUrl: un,
        bodyHtml: [
          greeting(firstName),
          p("Thank you — your Visibility Playbook is on its way and will arrive shortly."),
          p("While you wait: the fastest way to know exactly where your brand gap is sitting right now is the Strategic Authenticity Assessment. Ten statements, five minutes, a personalised tier result with focus areas pulled from your specific answers."),
          ctaButton("Take the Assessment →", `${SITE}/assessment`),
          sign,
        ].join("\n"),
      }),
  };
}

export function getPlaybookStep(stepIndex: number): Step | null {
  if (stepIndex === 1) {
    return {
      subject: "The four post types — and why most consultants only use two",
      build: (firstName, _score, un) =>
        renderEmail({
          title: "Four post types",
          preheader: "Point-of-view, pattern recognition, contrarian read, decision frame.",
          unsubscribeUrl: un,
          bodyHtml: [
            greeting(firstName),
            p("Most consultants post two of the four types — informative posts and credibility posts. They miss the two that actually move expertise into authority: the contrarian read and the decision frame. That is why content keeps performing without converting."),
            p(`The Visibility Playbook walks through all four with worked examples. While you wait for it, the assessment will tell you which of the four you are leaning on most heavily.`),
            ctaButton("Take the Assessment →", `${SITE}/assessment`),
            sign,
          ].join("\n"),
        }),
    };
  }
  return null;
}
