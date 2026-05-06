import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The CORE Framework",
  description: "The CORE Framework is Nathan Okoye\'s four-layer brand strategy system for consultants. Creative Authenticity, Organic Reach, Repeatable Systems, Engagement Strategy. Built from 15 years of experience.",
};

export default function CoreFrameworkPage() {
  return (
    <>
{/* HERO */}
    <section className="hero">
      <div className="container container-narrow">
        <div className="hero-centered">
          <p className="eyebrow hero-eyebrow">The Methodology</p>
          <h1 className="hero-h1 text-balance" style={{ maxWidth: '24ch' }}>
            The CORE Framework
          </h1>
          <p className="lead" style={{ maxWidth: '32ch', marginInline: 'auto', marginBottom: '1.5rem' }}>
            Built to close the gap between who you are and how your brand represents you.
          </p>
          <p className="hero-sub" style={{ marginInline: 'auto' }}>
            Most consultants have more expertise than their brand communicates. CORE is the system that fixes that, starting with identity and building everything else in the right order.
          </p>
        </div>
      </div>
    </section>

    {/* SECTION 1 THE PROBLEM CORE SOLVES */}
    <section className="section">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">The Problem CORE Solves</p>
          <h2 className="text-balance">Why most brand strategies fail consultants before they start.</h2>
        </header>
        <div className="prose stack">
          <p>Most brand strategy advice starts in the wrong place. It starts with content. With posting schedules. With what platform to be on and how often to show up. With tips for writing a better LinkedIn headline or making your website look more professional.</p>
          <p>None of that is wrong. All of it is premature.</p>
          <p>If the foundation is not right, everything built on top of it is the wrong thing said more consistently to more people in more places. That is not a brand strategy. That is a faster way to reach the wrong audience with a message that doesn't convert.</p>
          <p>The foundation is identity. Specifically, the answer to one question: who are you to the people you serve, and does anything you are currently putting into the world reflect that accurately?</p>
          <p>In 15 years of working with consultants, advisors, founders, and established organisations, I have never met a practitioner whose answer to the first part of that question matched what their brand was actually communicating. The gap is always there. The only variable is how much it is costing them.</p>
          <p>CORE closes that gap. In order. From the foundation up.</p>
        </div>
      </div>
    </section>

    {/* SECTION 2 WHERE CORE CAME FROM */}
    <section className="section section-paper-deep">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Origin</p>
          <h2 className="text-balance">Why I built this instead of borrowing someone else's framework.</h2>
        </header>
        <div className="prose stack">
          <p>I studied the frameworks. Dennis Yu. Chris Do. Justin Welsh. Myron Golden. Justin Brooke. I consumed everything they produced and tried to apply it. What I kept finding was that the frameworks worked for the people who built them, in the context of the journey that produced them, but they left out the parts that made them necessary. The struggles underneath. The specific failures that revealed the insight. The reasons why the framework exists at all.</p>
          <p>When you learn a framework without understanding the problem it was built to solve, you apply it mechanically. You get the structure without the substance. You post consistently and nothing moves. You update your website and the pipeline stays the same. You follow the steps and wonder why the results are not following.</p>
          <p>I built CORE from the specific failure I kept seeing everywhere, including in my own business before I understood it. Businesses speak to themselves and call it marketing. They write their bio the way they think about their work. They create content that makes sense to them. They build websites that reflect their own understanding of what they do.</p>
          <p>Their client doesn't think about it that way at all.</p>
          <p>CORE was built to solve that problem, from the inside out, starting with who the practitioner actually is to the people they serve, and building the content, the systems, and the engagement strategy around that identity. In that order. Every time.</p>
        </div>
      </div>
    </section>

    {/* IMAGE BREAK framework diagram */}
    <section className="image-band">
      <div className="container">
        <figure className="img-frame img-frame--full">
          <Image src="/images/COREframework.png" alt="CORE framework full stacked diagram. Identity at the foundation, engagement at the top." loading="lazy" width={1600} height={900} />
        </figure>
      </div>
    </section>

    {/* SECTION 3 THE FRAMEWORK */}
    <section className="section">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">The Framework</p>
          <h2 className="text-balance">What CORE stands for and what each layer actually does.</h2>
          <p className="subhead">CORE is a four-layer system. Each layer builds on the one before it. Skipping a layer or reversing the order is the most common reason a brand strategy produces effort without results.</p>
        </header>

        <hr className="divider" />

        <article className="split split-asym mb-7" style={{ marginBottom: 'var(--s-9)' }}>
          <div>
            <span className="glyph" style={{ fontFamily: 'var(--font-display)', fontWeight: '300', fontSize: 'clamp(5rem, 10vw, 9rem)', lineHeight: '0.9', letterSpacing: '-0.04em', color: 'var(--accent)', display: 'block' }}>C</span>
            <p className="eyebrow mt-5">Layer 01</p>
            <h3 style={{ fontSize: 'clamp(1.625rem, 2.4vw, 2.25rem)', marginTop: '0' }}>Creative Authenticity</h3>
            <p className="lead" style={{ maxWidth: '30ch' }}>We figure out what makes you genuinely different and build content that only you could make.</p>
          </div>
          <div className="prose stack">
            <p>This is not about finding your voice in the abstract. It is about identifying the specific combination of experience, perspective, and insight that you carry that no one else in your space has in quite the same form, and then building content that expresses that, consistently and specifically.</p>
            <p>Generic content loses. Not because it is bad. Because it is indistinguishable. When your content could have been written by anyone in your category, the reader has no reason to choose you over the next result they find. When your content could only have been written by you, the right reader stops and pays attention.</p>
            <p>Most consultants already have the material. They have 10, 15, 20 years of hard-won insight. What they lack is a system for extracting it and turning it into content that sounds like them and reaches the people they are trying to serve.</p>
            <p>That is what the C layer builds.</p>
          </div>
        </article>

        <hr className="divider" />

        <article className="split split-asym mb-7" style={{ marginBottom: 'var(--s-9)' }}>
          <div>
            <span className="glyph" style={{ fontFamily: 'var(--font-display)', fontWeight: '300', fontSize: 'clamp(5rem, 10vw, 9rem)', lineHeight: '0.9', letterSpacing: '-0.04em', color: 'var(--accent)', display: 'block' }}>O</span>
            <p className="eyebrow mt-5">Layer 02</p>
            <h3 style={{ fontSize: 'clamp(1.625rem, 2.4vw, 2.25rem)', marginTop: '0' }}>Organic Reach</h3>
            <p className="lead" style={{ maxWidth: '30ch' }}>Your content finds the right people without paid ads to establish the foundation.</p>
          </div>
          <div className="prose stack">
            <p>The right positioning makes the right audience self-select. When your content speaks the specific language of the problem your ideal client is living with, they find it. They share it. They save it. They come back for the next one.</p>
            <p>This is not a promise that content goes viral. It is a structural point about how positioning works. When a consultant's content is built on genuine identity and speaks to a specific audience's specific problem, that content has a natural reach that generic content never achieves, regardless of how consistently it is published.</p>
            <p>The O layer is where the content system built in the C layer meets the audience it was designed for. The result is not follower counts. It is the right people in the right conversations.</p>
          </div>
        </article>

        <hr className="divider" />

        <article className="split split-asym mb-7" style={{ marginBottom: 'var(--s-9)' }}>
          <div>
            <span className="glyph" style={{ fontFamily: 'var(--font-display)', fontWeight: '300', fontSize: 'clamp(5rem, 10vw, 9rem)', lineHeight: '0.9', letterSpacing: '-0.04em', color: 'var(--accent)', display: 'block' }}>R</span>
            <p className="eyebrow mt-5">Layer 03</p>
            <h3 style={{ fontSize: 'clamp(1.625rem, 2.4vw, 2.25rem)', marginTop: '0' }}>Repeatable Systems</h3>
            <p className="lead" style={{ maxWidth: '30ch' }}>The systems that let you create content in two hours what used to take all day, making every piece stronger than the one before it.</p>
          </div>
          <div className="prose stack">
            <p>Consistency is not a discipline problem for most consultants. It is a systems problem. Without a content system, every piece of content starts from scratch. Every post requires a new decision about topic, format, angle, and structure. That is exhausting. It is also inefficient, because the decisions made under that pressure are rarely the best ones.</p>
            <p>Repeatable systems solve this. A system built around your identity and your audience means that the decisions are made once, at the strategic level, and executed repeatedly at the production level. The content gets better over time because each piece is informed by the ones before it. The effort decreases because the foundation is already built.</p>
            <p>This is the layer most consultants try to build first. It is the third layer for a reason. Systems built on the wrong foundation just systematise the wrong message faster.</p>
          </div>
        </article>

        <hr className="divider" />

        <article className="split split-asym">
          <div>
            <span className="glyph" style={{ fontFamily: 'var(--font-display)', fontWeight: '300', fontSize: 'clamp(5rem, 10vw, 9rem)', lineHeight: '0.9', letterSpacing: '-0.04em', color: 'var(--accent)', display: 'block' }}>E</span>
            <p className="eyebrow mt-5">Layer 04</p>
            <h3 style={{ fontSize: 'clamp(1.625rem, 2.4vw, 2.25rem)', marginTop: '0' }}>Engagement Strategy</h3>
            <p className="lead" style={{ maxWidth: '30ch' }}>The move from people who watch to people who pay. Turning an audience into a client base through structured, intentional conversation.</p>
          </div>
          <div className="prose stack">
            <p>Reach without conversion is not a business result. An audience that consumes your content and never becomes a client is a distribution list, not a pipeline. The gap between the two is engagement, and engagement requires a strategy, not just a presence.</p>
            <p>The E layer builds the specific approach to conversation that moves a person from awareness to action. Not through pressure or tactics. Through the kind of structured, genuine exchange that makes the next step, the discovery call, the enquiry, the referral, feel like the natural outcome of the relationship that has been built.</p>
            <p>This is where the CORE system becomes revenue. Not because of a clever call to action, but because every layer that came before it built the right relationship with the right person, and the engagement strategy gives that relationship somewhere to go.</p>
          </div>
        </article>
      </div>
    </section>

    {/* SECTION 4 WHO THIS IS FOR */}
    <section className="section section-paper-deep">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Who This Is For</p>
          <h2 className="text-balance">The CORE framework works for consultants in a specific situation.</h2>
        </header>
        <div className="prose stack">
          <p>CORE is not for everyone. It is for consultants, advisors, and practitioners who meet a specific description.</p>
          <p>You have been doing this long enough that your work is good. Your existing clients know it. They refer you. They come back. But your brand does not reflect the standard of the work. New prospects who find you independently, or who Google you after a referral, find something that does not match what your clients would say about you.</p>
          <p>You have tried to fix this. You have posted more consistently. You have updated your website. You have tried to explain what you do more clearly in conversations. The pipeline has not responded the way your track record says it should.</p>
          <p>That means the foundation has not been set yet. The content, the website, and the consistency are all built on a positioning that has not been clarified. CORE sets the foundation first. Everything else follows from that.</p>
          <p>If that description fits, the framework fits. The question is whether you want to build it yourself, learn it through a structured programme, or have it built for you.</p>
          <Link href="/work-with-nathan" className="link-arrow mt-5">See how to work with Nathan</Link>
        </div>
      </div>
    </section>

    {/* IMAGE BREAK */}
    <section className="image-band">
      <div className="container">
        <figure className="img-frame img-frame--wide">
          <Image src="/images/Editorial.png" alt="Editorial photograph the framework in application. Strategy session in motion." loading="lazy" width={1600} height={900} />
        </figure>
      </div>
    </section>

    {/* SECTION 5 THE RESULTS */}
    <section className="section">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">The Results</p>
          <h2 className="text-balance">What happens when the CORE framework is applied.</h2>
          <p className="subhead">The results across four client engagements where the CORE framework was the strategic foundation:</p>
        </header>

        <div className="case-grid">
          <Link href="/case-study-advisor" className="case-card">
            <p className="eyebrow eyebrow-muted">Senior advisor, 20-year practice</p>
            <p className="case-outcome text-balance">$75M+ advisory engagement in six months.</p>
            <p className="case-desc">A senior advisor with a 20-year practice acquired a $75 million advisory engagement within six months of rebuilding her positioning and digital presence. No campaign. No outreach. Precise positioning.</p>
            <div className="case-foot">
              <span className="case-meta">Read the case study</span>
              <span className="case-arrow" aria-hidden="true">→</span>
            </div>
          </Link>

          <Link href="/case-study-institution" className="case-card">
            <p className="eyebrow eyebrow-muted">Founder, civic institution</p>
            <p className="case-outcome text-balance">15,000 attendees from no brand foundation.</p>
            <p className="case-desc">A founder building a civic institution in partnership with a municipal government brought 15,000 people to an event with no prior history and no established audience. The brand was built from nothing. So was the attendance.</p>
            <div className="case-foot">
              <span className="case-meta">Read the case study</span>
              <span className="case-arrow" aria-hidden="true">→</span>
            </div>
          </Link>

          <Link href="/case-study-publisher" className="case-card">
            <p className="eyebrow eyebrow-muted">Subject-matter expert, first product</p>
            <p className="case-outcome text-balance">$39,378 in online revenue, same product, new positioning.</p>
            <p className="case-desc">A subject-matter expert repositioned their first commercial product from passion project to institutional system. The same product, directed at the right buyers with the right language, generated $39,378 in online revenue.</p>
            <div className="case-foot">
              <span className="case-meta">Read the case study</span>
              <span className="case-arrow" aria-hidden="true">→</span>
            </div>
          </Link>

          <Link href="/case-study-arts" className="case-card">
            <p className="eyebrow eyebrow-muted">Performing arts organisation</p>
            <p className="case-outcome text-balance">First sold-out event in 15 years.</p>
            <p className="case-desc">A performing arts organisation sold out for the first time in 15 years. Not because the product changed. Because the conversation around it finally reached the people who had always been there.</p>
            <div className="case-foot">
              <span className="case-meta">Read the case study</span>
              <span className="case-arrow" aria-hidden="true">→</span>
            </div>
          </Link>
        </div>
      </div>
    </section>

    {/* SECTION 6 CLOSING CTA */}
    <section className="cta-banner">
      <div className="container">
        <p className="eyebrow eyebrow-plain" style={{ display: 'block', textAlign: 'center', marginBottom: '1.25rem' }}>The Next Step</p>
        <h2 className="text-balance">Ready to put the foundation in place?</h2>
        <p>The CORE framework can be applied in three ways, depending on where you are and what you need.</p>
        <p>You can learn it independently through the resources and programme available here. You can go through a structured implementation with Nathan's guidance. Or you can have it built for you by Nathan's team, end to end.</p>
        <p>The right starting point is a conversation. Not a pitch. A conversation about where the gap is and what closing it would make possible.</p>
        <div className="cta-row">
          <Link href="/work-with-nathan" className="btn btn-primary btn-lg">Book a strategy call with Nathan →</Link>
          <Link href="/case-study-advisor" className="link-arrow">Read the case studies first</Link>
        </div>
      </div>
    </section>
    </>
  );
}
