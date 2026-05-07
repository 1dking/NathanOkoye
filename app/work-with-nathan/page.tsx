import Image from "next/image";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Work With Nathan Okoye",
  description: "Nathan Okoye works with a small number of consultants at a time. Every engagement begins with The CORE Discovery Session, a paid session that identifies exactly where your brand gap is and what it is costing you.",
};

type Tier = "low" | "medium" | "high";

function readTier(): Tier {
  const v = cookies().get("nate_tier")?.value;
  return v === "medium" || v === "high" ? v : "low";
}

export default function WorkWithNathanPage() {
  const tier = readTier();

  return (
    <>
{/* HERO */}
    <section id="work-with-nathan" className="hero">
      <div className="container container-narrow">
        <div className="hero-centered">
          <p className="eyebrow hero-eyebrow">Work With Nathan</p>
          <h1 className="hero-h1 text-balance" style={{ maxWidth: '22ch' }}>
            If your brand does not reflect your work, the gap is costing you more than you know.
          </h1>
          <p className="hero-sub" style={{ marginInline: 'auto' }}>
            I work with a small number of consultants at a time. The starting point is always the same: a paid session that tells you exactly where the gap is and what it is costing you.
          </p>
          <div className="cta-row">
            <a href="#book" className="btn btn-primary btn-lg">Book The CORE Discovery Session →</a>
          </div>
        </div>
      </div>
    </section>

    {/* MEDIUM-intent banner — only when tier === 'medium'. */}
    {tier === "medium" && (
      <section className="medium-banner" aria-label="Read the case studies first">
        <div className="container">
          <p>
            Most people who reach this page have already read the case studies.
            If you have not — start there.
          </p>
          <a href="/#case-studies">See the results →</a>
        </div>
      </section>
    )}

    {/* SECTION 1 HOW NATHAN WORKS */}
    <section className="section">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">How Nathan Works</p>
          <h2 className="text-balance">This is not a services menu. Here is how the engagement actually works.</h2>
        </header>
        <div className="prose stack">
          <p>I do not offer packages. I do not have tiers with feature lists. I work with a maximum of three clients at a time, each engagement is scoped to what the situation actually requires, and every engagement begins in the same place.</p>
          <p>That place is The CORE Discovery Session.</p>
          <p>It is not a free consultation with a price tag on it. It is the first layer of the CORE framework applied to your specific situation. By the end of it, you will know who you actually are to the people you serve, who your audience actually is and how they think about the problem you solve, and where the gap between those two things is currently costing you. In revenue, in referrals, in opportunities that arrived and then went quiet.</p>
          <p>Most consultants who complete the session move into a full engagement. Some do not. Both outcomes are fine, because the session delivers what it promises regardless of what comes next.</p>
        </div>
      </div>
    </section>

    {/* IMAGE BREAK */}
    <section className="image-band">
      <div className="container">
        <figure className="img-frame img-frame--banner">
          <Image
            src="/images/work-with-nathan-discovery-session.png"
            alt="The CORE Discovery Session in progress — Nathan with a client, working through positioning."
            width={1600}
            height={686}
            loading="lazy"
          />
        </figure>
      </div>
    </section>

    {/* SECTION 2 THE CORE DISCOVERY SESSION */}
    <section className="section section-paper-deep">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Stage 01</p>
          <h2 className="text-balance">The CORE Discovery Session what it is and what it produces.</h2>
        </header>
        <div className="prose stack">
          <p>The CORE Discovery Session is a paid, standalone engagement. It is the entry point for every client I work with, without exception.</p>
          <p>Here is what it does.</p>
          <p>It separates who you are from who your client is. This sounds straightforward. It is not. Most consultants, when asked to describe their ideal client, describe a version of themselves. Most consultants, when asked what problem they solve, describe it in the language they use internally, not the language their client uses when they are living with the problem. That gap is where most brand strategies fail before they begin.</p>
          <p>The session surfaces that gap specifically, in your context, with the details that are unique to your practice. It does not produce generic insights that could apply to any consultant. It produces a clear picture of your specific positioning problem and what resolving it would make possible.</p>
        </div>

        <div className="callout mt-7" style={{ maxWidth: '40rem' }}>
          <p className="eyebrow eyebrow-muted">Investment</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 2.4vw, 2rem)', lineHeight: '1.2', color: 'var(--ink)', marginBottom: '0.75rem' }}>$500 – $1,500</p>
          <p className="small mb-0">The exact price is confirmed when you enquire.</p>
        </div>

        <div className="cta-row">
          <a href="#book" className="btn btn-primary">Book The CORE Discovery Session →</a>
        </div>
      </div>
    </section>

    {/* SECTION 3 THE CORE BRAND BUILD */}
    <section className="section">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Stage 02</p>
          <h2 className="text-balance">The CORE Brand Build what happens after Discovery for clients who move forward.</h2>
        </header>
        <div className="prose stack">
          <p>For consultants who complete The CORE Discovery Session and want to close the gap fully, the next stage is The CORE Brand Build.</p>
          <p>This is a custom-scoped engagement. The scope is determined by what the Discovery Session reveals, not by a predetermined package. Depending on the situation, the work can include a brand strategy document and positioning framework the client owns outright, a live social media presence built on that foundation, a website, or a combination of these. Some clients need all of it. Some need two of the three. The session tells us which.</p>
          <p>To be clear about what this is not. It is not an agency retainer where a team executes a brief you hand them. It is a strategic engagement where the positioning work comes first, the systems are built from that positioning, and everything produced reflects a brand that has been built from the inside out rather than assembled from templates.</p>
          <p>The results that positioning work has produced: a $75 million advisory engagement acquired through brand clarity alone, 15,000 people at an event built from no brand foundation, $39,378 in revenue unlocked by repositioning an expert's first product, and a first sold-out event in 15 years for an established organisation.</p>
          <p>Those results did not come from better execution of a weak strategy. They came from getting the foundation right before anything else was built.</p>
        </div>

        <div className="callout mt-7" style={{ maxWidth: '40rem' }}>
          <p className="eyebrow eyebrow-muted">Investment</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 2.4vw, 2rem)', lineHeight: '1.2', color: 'var(--ink)', marginBottom: '0.75rem' }}>$12,000 – $24,000</p>
          <p className="small mb-0">Timeline is defined per project. This is a high-touch engagement and it is scoped accordingly.</p>
        </div>
      </div>
    </section>

    {/* SECTION 4 ONGOING PARTNERSHIP */}
    <section className="section section-paper-deep">
      <div className="container container-narrow">
        <header className="section-header">
          <p className="eyebrow">Stage 03</p>
          <h2 className="text-balance">Ongoing partnership for clients who want continued support after the Brand Build.</h2>
        </header>
        <div className="prose stack">
          <p>After The CORE Brand Build is complete, some clients choose to continue with an ongoing monthly engagement. This covers continued strategic support and execution as the brand grows.</p>
          <p>The scope of the ongoing partnership is defined at the close of The CORE Brand Build, not sold upfront. It is available to Brand Build clients only.</p>
        </div>
      </div>
    </section>

    {/* SECTION 5 WHO THIS IS FOR */}
    <section className="section">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Who This Is For</p>
          <h2 className="text-balance">The consultants I work with share a specific profile.</h2>
        </header>
        <div className="prose stack">
          <p>The work I do produces results for consultants who meet a specific description.</p>
          <p>You have been working in your field long enough that your expertise is real and your track record is documented, at least in your own files and in the memories of clients who would refer you without hesitation. But your public presence does not reflect that. A prospect who finds you independently, or who Googles you after a referral, finds something that tells a smaller story than the one your clients would tell.</p>
          <p>You are not looking for someone to tell you to post more consistently or to help you write captions. You understand that the problem is structural, even if you have not yet named it clearly. You are looking for someone who can identify specifically what the structure should be and build it.</p>
          <p>You are willing to invest in the foundation because you understand that everything built without it requires rebuilding later.</p>
          <p>If that is where you are, The CORE Discovery Session will confirm it within the first hour. If it is not, I will tell you that too.</p>
        </div>
      </div>
    </section>

    {/* IMAGE BREAK */}
    <section className="image-band">
      <div className="container">
        <figure className="img-frame img-frame--wide">
          <Image
            src="/images/work-with-nathan-mid-engagement.png"
            alt="Nathan mid-engagement — the work, close."
            width={1600}
            height={900}
            loading="lazy"
          />
        </figure>
      </div>
    </section>

    {/* SECTION 6 CLOSING CTA */}
    <section className="cta-banner" id="book">
      <div className="container">
        <p className="eyebrow eyebrow-plain" style={{ display: 'block', textAlign: 'center', marginBottom: '1.25rem' }}>One Starting Point</p>
        <h2 className="text-balance">One starting point. One action.</h2>
        <p>Every engagement begins with The CORE Discovery Session. There is no other entry point, no taster call, no free assessment. The session is the work. It is where the clarity starts.</p>
        <p>If you are a consultant whose brand does not yet reflect what you have built, this is where that changes.</p>
        <div className="cta-row" style={{ flexDirection: 'column', alignItems: 'center' }}>
          <a
            href="mailto:nathan@ocidm.com?subject=CORE%20Discovery%20Session%20enquiry"
            className={`btn btn-primary btn-lg${tier === "high" ? " pulse-cta" : ""}`}
          >
            Book The CORE Discovery Session →
          </a>
          {tier === "high" && (
            <p className="urgency-line">
              Nathan works with a maximum of three clients at a time.
            </p>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
