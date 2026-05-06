"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { insertRow } from "@/lib/supabase";
import { getOrCreateVisitorToken } from "@/lib/visitor";

const SUPABASE_TABLE = "assessment_submissions";

/* ---- Data --------------------------------------------------------------- */

type AreaId =
  | "distinctiveness"
  | "recognition"
  | "energy"
  | "business_impact"
  | "authentic_expression";

interface Area {
  id: AreaId;
  name: string;
  number: number;
  statements: number[];
}

const AREAS: Area[] = [
  { id: "distinctiveness", name: "Distinctiveness", number: 1, statements: [1, 2] },
  { id: "recognition", name: "Recognition", number: 2, statements: [3, 4] },
  { id: "energy", name: "Energy", number: 3, statements: [5, 6] },
  { id: "business_impact", name: "Business Impact", number: 4, statements: [7, 8] },
  { id: "authentic_expression", name: "Authentic Expression", number: 5, statements: [9, 10] },
];

const STATEMENTS: { id: number; text: string; areaId: AreaId }[] = [
  { id: 1, areaId: "distinctiveness", text: "My content reflects a perspective that only I could have not the general language of my category." },
  { id: 2, areaId: "distinctiveness", text: "When someone reads my content without seeing my name, they can tell it's mine." },
  { id: 3, areaId: "recognition", text: "People in my network refer me unprompted not just when directly asked." },
  { id: 4, areaId: "recognition", text: "When someone describes the problem I solve, my name comes up in the room without me being there." },
  { id: 5, areaId: "energy", text: "Showing up online feels like a natural extension of how I already think and communicate." },
  { id: 6, areaId: "energy", text: "I create content consistently without it feeling like a task I am avoiding." },
  { id: 7, areaId: "business_impact", text: "My content directly opens conversations that lead to real client enquiries." },
  { id: 8, areaId: "business_impact", text: "The people who find me independently arrive already understanding what I do and who it's for." },
  { id: 9, areaId: "authentic_expression", text: "My brand communicates my expertise in my client's language, not my own." },
  { id: 10, areaId: "authentic_expression", text: "What my best clients would say about me matches what my public brand communicates to strangers." },
];

const RATING_LABELS: Record<number, string> = {
  1: "not true of me at all",
  2: "rarely true",
  3: "sometimes true",
  4: "mostly true",
  5: "completely true",
};

interface Tier {
  range: [number, number];
  label: string;
  headline: string;
  description: string;
  focus: string;
  ctaText: string;
  ctaHref: string;
}

const TIERS: Tier[] = [
  {
    range: [40, 50],
    label: "Strategically Authentic",
    headline: "Your brand is working. The gap is narrow.",
    description:
      "The alignment between who you are and how your brand represents you is generating real results. The foundation is solid. The work now is not repair it is compounding. Sharper systems, wider reach, and a structured engagement strategy that moves your audience from attention to action.",
    focus:
      "Repeatable Systems and Engagement Strategy. You have the identity and the organic reach. Build the infrastructure that makes it consistent at scale and converts attention into conversations.",
    ctaText: "Learn how the full CORE framework compounds what you have already built →",
    ctaHref: "/core-framework",
  },
  {
    range: [30, 39],
    label: "Authentic but Unfocused",
    headline: "The raw material is there. The precision is not.",
    description:
      "You have genuine expertise, a real point of view, and enough presence that the right people find you. What is missing is the sharpness that makes the right person stop and say this is exactly what I have been looking for. You are reaching people, but not reliably converting that reach into the right conversations.",
    focus:
      "Distinctiveness and Authentic Expression. Your content needs to speak your client's language more precisely than it currently does. The gap is in translation, not in substance.",
    ctaText: "The CORE Discovery Session identifies exactly where the translation is breaking down →",
    ctaHref: "/work-with-nathan",
  },
  {
    range: [20, 29],
    label: "Following Templates",
    headline: "You are saying the right things in the wrong way.",
    description:
      "Your brand is functional but forgettable. You are using the language of your category instead of the language that is uniquely yours. Prospects who find you understand what you do, but they cannot feel why you are the right person to do it for them.",
    focus:
      "Distinctiveness first, then Organic Reach. Before systems, before ads, before consistency the foundation needs to be set. What makes you genuinely different must be identified and articulated before anything else is built.",
    ctaText: "The CORE Discovery Session was built for this starting point →",
    ctaHref: "/work-with-nathan",
  },
  {
    range: [10, 19],
    label: "Generic Content",
    headline: "Your brand is not yet working for you.",
    description:
      "Content exists, but it is not creating distinction, recognition, or pipeline movement. This is not a reflection of the quality of your work. It is a reflection of how your brand is currently representing it. The gap between your actual expertise and your public presence is significant and that gap is the source of every slow referral, every price objection, and every prospect who seemed interested and then went quiet.",
    focus:
      "Identity before everything. Nothing built on an unclear foundation will compound. The CORE framework starts with one question who are you to the people you serve, and does anything you are currently putting into the world reflect that accurately?",
    ctaText: "Book The CORE Discovery Session →",
    ctaHref: "/work-with-nathan",
  },
];

const getTier = (score: number): Tier =>
  TIERS.find((t) => score >= t.range[0] && score <= t.range[1]) ?? TIERS[TIERS.length - 1];

interface SubmittedResult {
  firstName: string;
  email: string;
  total: number;
  tier: Tier;
  areaScores: Record<AreaId, number>;
}

/* ---- Component ---------------------------------------------------------- */

export default function AssessmentClient() {
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [emailGateShown, setEmailGateShown] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<SubmittedResult | null>(null);

  const answered = Object.keys(ratings).length;
  const remaining = 10 - answered;
  const totalScore = useMemo(
    () => Object.values(ratings).reduce((a, b) => a + b, 0),
    [ratings]
  );
  const allAnswered = answered === 10;

  // Reveal the email gate (once) when all 10 statements are answered.
  useEffect(() => {
    if (allAnswered && !emailGateShown) {
      setEmailGateShown(true);
      // Defer to next tick so the section is in the DOM before scroll.
      requestAnimationFrame(() => {
        const el = document.getElementById("emailGate");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [allAnswered, emailGateShown]);

  // After result is rendered, scroll to it.
  useEffect(() => {
    if (submitted) {
      requestAnimationFrame(() => {
        const el = document.getElementById("resultSection");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [submitted]);

  const handleRate = (statementId: number, value: number) => {
    if (submitted) return;
    if (allAnswered && emailGateShown) return; // lock once gate is open
    setRatings((prev) => ({ ...prev, [statementId]: value }));
  };

  const computeAreaScores = (): Record<AreaId, number> => ({
    distinctiveness: (ratings[1] ?? 0) + (ratings[2] ?? 0),
    recognition: (ratings[3] ?? 0) + (ratings[4] ?? 0),
    energy: (ratings[5] ?? 0) + (ratings[6] ?? 0),
    business_impact: (ratings[7] ?? 0) + (ratings[8] ?? 0),
    authentic_expression: (ratings[9] ?? 0) + (ratings[10] ?? 0),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!allAnswered) {
      setErrorMsg("Please answer all 10 statements before submitting.");
      return;
    }
    const fn = firstName.trim();
    const em = email.trim();
    if (!fn) {
      setErrorMsg("Please enter your first name.");
      return;
    }
    if (!em || !em.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    const areaScores = computeAreaScores();
    const tier = getTier(totalScore);

    const payload: Record<string, string | number | null> = {
      visitor_token: getOrCreateVisitorToken(),
      first_name: fn,
      email: em,
      total_score: totalScore,
      result_tier: tier.label,
      score_distinctiveness: areaScores.distinctiveness,
      score_recognition: areaScores.recognition,
      score_energy: areaScores.energy,
      score_business_impact: areaScores.business_impact,
      score_authentic_expression: areaScores.authentic_expression,
    };
    for (let i = 1; i <= 10; i++) {
      payload[`statement_${i}`] = ratings[i];
    }

    const result = await insertRow(SUPABASE_TABLE, payload);
    if (!result.ok) {
      // eslint-disable-next-line no-console
      console.warn("Assessment submission failed", result.status, result.error);
    }

    setSubmitting(false);
    setSubmitted({
      firstName: fn,
      email: em,
      total: totalScore,
      tier,
      areaScores,
    });
  };

  return (
    <>
      {/* HERO */}
      <section className="assessment-hero">
        <div className="container container-narrow">
          <p className="eyebrow">The Assessment</p>
          <h1>The Strategic Authenticity Assessment.</h1>
          <p className="hero-sub">
            Rate each statement honestly this is most useful when it reflects where you actually are, not where you want
            to be.
          </p>
        </div>
      </section>

      {/* SCALE LEGEND */}
      <section className="section-sm">
        <div className="container">
          <div className="scale-legend" role="note" aria-label="Rating scale">
            {Object.entries(RATING_LABELS).map(([n, label]) => (
              <span key={n}>
                <strong>{n}</strong> {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATEMENTS */}
      <section className="section">
        <div className="container">
          <form id="assessmentForm" noValidate onSubmit={(e) => e.preventDefault()}>
            {AREAS.map((area) => (
              <fieldset key={area.id} className="area-block">
                <legend className="area-eyebrow">
                  Area {area.number} · {area.name}
                </legend>
                {area.statements.map((sid) => {
                  const stmt = STATEMENTS.find((s) => s.id === sid)!;
                  const current = ratings[sid];
                  return (
                    <div
                      key={sid}
                      className={`statement-card${current ? " is-answered" : ""}`}
                      data-statement-card={sid}
                    >
                      <p className="statement-text">{stmt.text}</p>
                      <div className="rating-row" role="radiogroup" aria-label={`Rate statement ${sid}`}>
                        {[1, 2, 3, 4, 5].map((v) => (
                          <button
                            key={v}
                            type="button"
                            role="radio"
                            aria-checked={current === v}
                            aria-label={`${v} ${RATING_LABELS[v]}`}
                            disabled={!!submitted || (allAnswered && emailGateShown && !ratings[sid])}
                            className={`rating-btn${current === v ? " is-selected" : ""}`}
                            onClick={() => handleRate(sid, v)}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </fieldset>
            ))}
          </form>
        </div>
      </section>

      {/* SCORE BAR */}
      <section className={`score-bar${emailGateShown ? " is-locked" : ""}`} id="scoreBar" aria-live="polite">
        <div className="container">
          <div className="score-line">
            <span className="score-num">
              {totalScore}
              <em> / 50</em>
            </span>
            <span>
              {answered} of 10 answered · {remaining} remaining
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(answered / 10) * 100}%` }}></div>
          </div>
        </div>
      </section>

      {/* EMAIL GATE — appears once all 10 answered */}
      {emailGateShown && !submitted && (
        <section className="email-gate" id="emailGate">
          <div className="container">
            <div className="gate-card">
              <p className="gate-eyebrow">Almost done</p>
              <h2>Enter your details to see your result and your personalised focus areas.</h2>
              <form noValidate onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="first_name"
                    placeholder="First name"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-lg submit-btn" disabled={submitting}>
                  {submitting ? "Submitting…" : "Show My Result"}
                </button>
                {errorMsg && <p className="form-error">{errorMsg}</p>}
                <p className="form-note">Your result will also be sent to your email.</p>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* RESULT — rendered only after submission, never in DOM beforehand */}
      {submitted && (
        <section className="result-section" id="resultSection">
          <div className="container">
            <div className="result-stack">
              {/* Part 1: area breakdown */}
              <div className="result-part">
                <p className="result-eyebrow">Your area breakdown total {submitted.total} / 50</p>
                <div className="area-grid">
                  {AREAS.map((a) => {
                    const score = submitted.areaScores[a.id];
                    const priority = score <= 6;
                    return (
                      <div key={a.id} className={`area-card${priority ? " is-priority" : ""}`}>
                        {priority && <span className="priority-flag">Priority area</span>}
                        <p className="area-name">{a.name}</p>
                        <p className="area-score">
                          {score}
                          <em>/ 10</em>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Part 2: tier */}
              <div className="result-part tier-result">
                <p className="tier-label">[ {submitted.tier.label} ]</p>
                <h2 className="tier-headline">{submitted.tier.headline}</h2>
                <div className="tier-body">
                  <p>{submitted.tier.description}</p>
                  <p>
                    <strong>Focus </strong> {submitted.tier.focus}
                  </p>
                </div>
                <div className="tier-cta cta-row">
                  <Link href={submitted.tier.ctaHref} className="btn btn-lg">
                    {submitted.tier.ctaText}
                  </Link>
                </div>
              </div>

              {/* Part 3: confirmation */}
              <div className="result-part">
                <p className="result-confirm">
                  Thank you, {submitted.firstName}. Your result has been sent to your email{" "}
                  <strong>{submitted.email}</strong>.
                </p>
              </div>

              {/* Part 4: secondary CTA */}
              <div className="result-part result-secondary-cta">
                <Link href="/case-study-advisor" className="link-arrow">
                  Read the case studies →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
