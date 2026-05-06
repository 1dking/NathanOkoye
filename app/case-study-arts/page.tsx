import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "First Sold-Out Event in 15 Years | Performing Arts Case Study",
  description: "A performing arts organisation hadn\'t sold out in 15 years. Two months of repositioned content and structured performance marketing changed that. The product never changed. The conversation did.",
};

export default function CaseStudyArtsPage() {
  return (
    <>
{/* HERO + META */}
    <section className="section-sm" style={{ paddingTop: 'clamp(3rem, 7vw, 5rem)' }}>
      <div className="container">
        <p className="eyebrow">Case Study · Performing Arts</p>
        <h1 className="h1 text-balance" style={{ maxWidth: '22ch' }}>
          How an established organisation sold out for the first time in 15 years.
        </h1>

        <dl className="case-meta-row mt-7">
          <div>
            <dt>Client</dt>
            <dd>Established performing arts organisation</dd>
          </div>
          <div>
            <dt>Engagement</dt>
            <dd>Brand Strategy, Content, Social, Performance Marketing</dd>
          </div>
          <div>
            <dt>Timeline</dt>
            <dd>Apr – May 2025</dd>
          </div>
          <div>
            <dt>Result</dt>
            <dd>First sold-out event in 15 years</dd>
          </div>
        </dl>

        {/* secondary stat row */}
        <div className="proof-grid mt-7" style={{ borderTop: '1px solid var(--rule)', paddingTop: 'var(--s-6)' }}>
          <div className="stat">
            <dt className="stat-number">1M<span className="unit">+</span></dt>
            <dd className="stat-label">Impressions across paid and organic in two months</dd>
          </div>
          <div className="stat">
            <dt className="stat-number">$15.8K</dt>
            <dd className="stat-label">In ticket revenue from the campaign window</dd>
          </div>
          <div className="stat">
            <dt className="stat-number">11.3<span className="unit">%</span></dt>
            <dd className="stat-label">Instagram engagement rate (well above platform average)</dd>
          </div>
          <div className="stat">
            <dt className="stat-number">3.2<span className="unit">%</span></dt>
            <dd className="stat-label">Click-through rate against a typical benchmark below 1%</dd>
          </div>
        </div>

        <div className="img-placeholder img-placeholder--wide mt-7">
          <div className="img-placeholder__inner">
            <span className="img-placeholder__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="9" cy="11" r="1.5"/><path d="M3 17l5-4 4 3 4-2 5 3"/></svg>
            </span>
            <p className="img-placeholder__eyebrow">Image · 16:9 hero</p>
            <p className="img-placeholder__caption">Anonymised editorial image performance hall, audience in low light. The room finally full.</p>
          </div>
        </div>
      </div>
    </section>

    {/* THE SHORT VERSION */}
    <section className="section-sm">
      <div className="container">
        <div className="prose">
          <p className="lead" style={{ maxWidth: '44ch' }}>
            A performing arts organisation with 15 years of history, a loyal core audience, and a genuinely excellent product had stopped growing. The event hadn't sold out in 15 years not because the quality had declined, but because the organisation had been speaking to the same people in the same way for a long time, and the wider market didn't know what they were missing. Two months of repositioned content and performance marketing later, the event sold out. The product hadn't changed. The conversation around it had.
          </p>
        </div>
      </div>
    </section>

    {/* THE PROBLEM */}
    <section className="section">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">The Problem</p>
          <h2 className="text-balance">What was the actual problem?</h2>
        </header>
        <div className="prose stack">
          <p>Fifteen years is a long time to be good at something without growing.</p>
          <p>This organisation had built real credibility over that time a track record, a loyal base, genuine artistic quality. None of that was in question. What had quietly calcified was the outward conversation. The content spoke to people who already understood the value of the event. It assumed a level of familiarity that most of the potential audience simply didn't have. And without a content strategy designed to bring new people into the world of the event to make it feel relevant, exciting, and worth attending for someone who had never been the audience stayed roughly the same size it had always been.</p>
          <p>This is a specific and common failure mode for established organisations. It is different from the problems faced by a founder with no brand or an expert with the wrong audience. The product is not in question. The brand has real equity. The failure is narrower: the organisation has been talking to its existing audience for so long that it has forgotten how to talk to anyone else.</p>
          <p>The risk of diagnosing this incorrectly is significant. An organisation in this position can easily conclude that the product needs to change, the pricing needs to drop, or the audience simply isn't there. None of those conclusions are correct. The audience is there. The product is right. The conversation is the problem.</p>
        </div>
      </div>
    </section>

    {/* THE APPROACH */}
    <section className="section section-paper-deep">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">The Approach</p>
          <h2 className="text-balance">What does the CORE framework identify in a situation like this?</h2>
        </header>
        <div className="prose stack">
          <p>When an established organisation stops growing, the CORE framework asks a specific question before anything else: is the content serving the existing audience or recruiting a new one?</p>
          <p>Almost always, in situations like this, the answer is the former. Content that serves an existing audience reinforces what they already know and love. It deepens loyalty but does not expand reach. It produces strong engagement from a small pool and limited traction everywhere else which is precisely the pattern this organisation had been experiencing.</p>
          <p>The repositioning worked on two levels simultaneously.</p>
          <p><strong>New audience acquisition through content.</strong> The content strategy was rebuilt around the experience of attending what a night at this event actually felt like, who it was for, what it gave people that they couldn't get anywhere else. This is fundamentally different from content that describes the event's credentials. Credentials speak to the converted. Experience speaks to the curious. The goal was to make someone who had never considered attending feel like they were already missing something.</p>
          <p><strong>Performance marketing built on the CORE graduation system.</strong> Paid promotion followed the same logic as the content no selling to cold audiences before trust was established. Awareness content ran first, building familiarity and desire. Conversion content ran to warm audiences who had already engaged. The result was a cost-per-click and engagement rate that significantly outperformed platform averages a CTR of 3.2% against a typical benchmark well below 1%, and an Instagram engagement rate of 11.31%.</p>
          <p>The combination produced reach at scale over 1 million impressions and 600,000+ people reached with conversion rates that justified every dollar of ad spend.</p>
        </div>
      </div>
    </section>

    {/* THE OUTCOME */}
    <section className="section">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">The Outcome</p>
          <h2 className="text-balance">What did selling out actually represent?</h2>
        </header>
        <div className="prose stack">
          <p>The sold-out result is the headline. What sits underneath it is more instructive.</p>
          <p>This organisation did not sell out because it finally found the right audience. It sold out because it finally spoke to the audience that had always been there people who would have attended years ago if the event had ever entered their awareness in the right way. Fifteen years of not selling out was not a supply problem. It was a communication problem. The product was always good enough. The conversation around it was not reaching far enough.</p>
          <p>The 1 million impressions generated in two months did not come from a budget that would surprise anyone. They came from content that was specific enough to resonate and structured well enough to travel. The 97,000+ video views and 66,000 seconds of watch time are not vanity metrics in this context they are evidence that people with no prior relationship with the organisation were willing to spend real time with the content. That is the precondition for a purchase from a new audience member.</p>
          <p>The $15,876.68 in ticket revenue is the conversion of that attention into action. It happened because the content did the trust-building work that made the purchase feel like the natural next step not a leap of faith toward something unfamiliar.</p>
        </div>

        <blockquote className="pullquote mt-7">
          The work was always worth it. The audience was always out there. The gap was always the conversation.
        </blockquote>
      </div>
    </section>

    {/* IMAGE BREAK outcome */}
    <section className="image-band">
      <div className="container">
        <div className="img-placeholder img-placeholder--banner">
          <div className="img-placeholder__inner">
            <span className="img-placeholder__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="9" cy="11" r="1.5"/><path d="M3 17l5-4 4 3 4-2 5 3"/></svg>
            </span>
            <p className="img-placeholder__eyebrow">Image · 21:9 banner</p>
            <p className="img-placeholder__caption">Campaign artefacts content samples, paid creative, performance dashboard. Anonymised.</p>
          </div>
        </div>
      </div>
    </section>

    {/* CLIENT QUOTE */}
    <section className="section-sm">
      <div className="container container-narrow">
        <p className="eyebrow">In Their Words</p>
        <div className="client-quote">
          <q>We assumed our audience had simply stopped growing. The work Nathan did showed us we'd stopped recruiting one. The product never changed. We just finally introduced it to the right people in the right way.</q>
          <p className="attribution">Established performing arts organisation &nbsp; <span className="note">INSERT: anonymised client quote</span></p>
        </div>
      </div>
    </section>

    {/* THE LESSON */}
    <section className="section section-paper-deep">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">The Lesson</p>
          <h2 className="text-balance">What established consultants and practitioners take from this case.</h2>
        </header>
        <div className="prose stack">
          <p>The pattern this organisation experienced is the one I find most often in established consulting practices that have plateaued. Strong retention. Weak new business. A network that knows and trusts the work but isn't growing. Referrals that come in steadily but slowly. The sense that the market simply isn't expanding when in truth, the market is the same size it has always been. The conversation just isn't reaching it.</p>
          <p>The instinct in this situation is usually to change something about the offer adjust the positioning, add a new service, lower the price to attract a different buyer. That instinct is almost always wrong. The offer is fine. The product has been validated by years of loyal clients. What needs to change is the outward-facing conversation the content, the messaging, the channels so that it is capable of recruiting people who have never been in the room before.</p>
          <p>For this organisation, two months of repositioned content and structured paid promotion produced what 15 years of existing strategy had not. The event sold out. For an established consultant, the equivalent is a pipeline that finally starts moving again not because the work changed, but because the right people finally heard about it in the right way.</p>
          <p>The work was always worth it. The audience was always out there. The gap was always the conversation.</p>
        </div>
      </div>
    </section>

    {/* RELATED */}
    <section className="section">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Related Work</p>
          <h2 className="text-balance">Other case studies.</h2>
        </header>

        <div className="case-grid">
          <Link href="/case-study-advisor" className="case-card">
            <p className="eyebrow eyebrow-muted">Senior advisor, 20-year practice</p>
            <p className="case-outcome text-balance">$75M+ engagement from positioning alone.</p>
            <p className="case-desc">A philanthropic advisor with decades of credibility. The prior agency had failed her. Six months after rebuilding the positioning, the right person finally saw what was always there.</p>
            <div className="case-foot">
              <span className="case-meta">Read the case study</span>
              <span className="case-arrow" aria-hidden="true">→</span>
            </div>
          </Link>

          <Link href="/case-study-institution" className="case-card">
            <p className="eyebrow eyebrow-muted">Founder, civic institution</p>
            <p className="case-outcome text-balance">15,000 attendees, from no brand foundation.</p>
            <p className="case-desc">A founder building a civic institution from scratch with a municipal partner. The brand was built from nothing. So was the attendance.</p>
            <div className="case-foot">
              <span className="case-meta">Read the case study</span>
              <span className="case-arrow" aria-hidden="true">→</span>
            </div>
          </Link>

          <Link href="/case-study-publisher" className="case-card">
            <p className="eyebrow eyebrow-muted">Subject-matter expert, first product</p>
            <p className="case-outcome text-balance">From passion project to institutional product.</p>
            <p className="case-desc">A subject-matter expert with a product the market admired but didn't know how to buy. The same product, repositioned, generated $39,378 in online revenue.</p>
            <div className="case-foot">
              <span className="case-meta">Read the case study</span>
              <span className="case-arrow" aria-hidden="true">→</span>
            </div>
          </Link>

          <Link href="/core-framework" className="case-card">
            <p className="eyebrow eyebrow-muted">The Methodology</p>
            <p className="case-outcome text-balance">The CORE framework.</p>
            <p className="case-desc">The four-layer system underneath every engagement. Creative Authenticity, Organic Reach, Repeatable Systems, Engagement Strategy. Built from 15 years of experience.</p>
            <div className="case-foot">
              <span className="case-meta">Read the framework</span>
              <span className="case-arrow" aria-hidden="true">→</span>
            </div>
          </Link>
        </div>
      </div>
    </section>

    {/* CLOSING CTA */}
    <section className="cta-banner">
      <div className="container">
        <p className="eyebrow eyebrow-plain" style={{ display: 'block', textAlign: 'center', marginBottom: '1.25rem' }}>The Next Step</p>
        <h2 className="text-balance">If your work is stronger than your pipeline, the gap is closeable.</h2>
        <p>The first step is a conversation. Not a pitch. A conversation about where the gap is, and what closing it would make possible.</p>
        <div className="cta-row">
          <Link href="/work-with-nathan" className="btn btn-primary btn-lg">Book a strategy call with Nathan →</Link>
        </div>
      </div>
    </section>
    </>
  );
}
