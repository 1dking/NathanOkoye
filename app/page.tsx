import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
{/* HERO dark dramatic, portrait as background */}
    <section className="hero-dramatic">

      {/* Background portrait, faded on all sides */}
      <div className="hero-bg-image" aria-hidden="true">
        <Image src="/images/nateceo.png" alt="" loading="eager" priority width={1080} height={1350} />
      </div>
      {/* Atmospheric tint + edge darkening */}
      <div className="hero-bg-glow" aria-hidden="true"></div>

      {/* Foreground content */}
      <div className="container hero-dramatic-content">

        {/* TOP: pill + H1 cluster (left), meta (right) */}
        <div className="hero-dramatic-top">
          <div className="hero-dramatic-top-left">
            <span className="eyebrow-pill"><span className="dot" aria-hidden="true"></span>Available for select engagements</span>
            <h1 className="hero-dramatic-h1">
              You're not invisible because you lack expertise.
              <span className="accent">You're invisible because your brand is speaking your language, not your client's.</span>
            </h1>
          </div>
          <div className="hero-dramatic-aside">
            <div><strong>15 years</strong> of practice</div>
            <div>Toronto, Canada</div>
          </div>
        </div>

        {/* spacer */}
        <div className="hero-dramatic-mid" aria-hidden="true"></div>

        {/* FOOT: large wordmark in front of figure + tagline · CTA · proof */}
        <div className="hero-dramatic-foot">
          <span className="hero-wordmark-front" aria-hidden="true">Nathan&nbsp;<em>Okoye</em></span>

          <div className="hero-dramatic-bottom">
            <p className="hero-dramatic-tagline">
              I help established consultants close the gap between the reputation they've built and the brand that represents them.
            </p>
            <div className="cta-row">
              <Link href="/work-with-nathan" className="btn btn-on-ink btn-lg">Work with Nathan →</Link>
            </div>
            <div className="hero-dramatic-meta">
              <div className="hero-dramatic-meta-item"><strong>$75M+</strong><span>engagement acquired</span></div>
              <div className="hero-dramatic-meta-item"><strong>15,000</strong><span>attendees from zero</span></div>
            </div>
          </div>
        </div>

      </div>
    </section>

    {/* PROOF BAR */}
    <section className="proof-bar">
      <div className="container">
        <dl className="proof-grid">
          <div className="stat">
            <dt className="stat-number">$75M<span className="unit">+</span></dt>
            <dd className="stat-label">Engagement acquired by a senior advisor through positioning alone</dd>
          </div>
          <div className="stat">
            <dt className="stat-number">15,000</dt>
            <dd className="stat-label">People who showed up for a brand built from nothing</dd>
          </div>
          <div className="stat">
            <dt className="stat-number">$39K</dt>
            <dd className="stat-label">Revenue unlocked by repositioning an expert's first product</dd>
          </div>
          <div className="stat">
            <dt className="stat-number">15<span className="unit">yrs</span></dt>
            <dd className="stat-label">First sold-out event for an established organisation</dd>
          </div>
        </dl>
      </div>
    </section>

    {/* SECTION 1 THE PROBLEM */}
    <section className="section">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">The Problem</p>
          <h2 className="text-balance">Most consultants have the wrong brand problem.</h2>
        </header>
        <div className="prose stack">
          <p>Most consultants have the wrong brand problem. The issue is rarely the quality of the work. It is the gap between how good the work actually is and how clearly the brand communicates it. You know what you do. Your existing clients know what you do. But to everyone else, the right prospects, the speaking stages, the high-value opportunities, your brand is saying something different from what you mean. Or saying nothing at all.</p>
          <p>I spent years watching this happen with my own company and with every client we worked with before we understood it. We were doing the work. The clients were satisfied. But the brand wasn't translating any of it into the room before we arrived. So we kept starting every conversation from zero.</p>
          <p>The problem is not your credentials. It is translation. And translation is fixable, but only if you start in the right place.</p>
        </div>
      </div>
    </section>

    {/* SECTION 2 THE INSIGHT */}
    <section className="section section-paper-deep">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">The Insight</p>
          <h2 className="text-balance">Businesses speak to themselves and call it marketing.</h2>
        </header>
        <div className="prose stack">
          <p>When a consultant sits down to write their website copy, their LinkedIn bio, or their service description, they almost always write what makes sense to them. The language that feels accurate. The terms that describe the work correctly. The framing that reflects how they think about what they do.</p>
          <p>Their client doesn't think about it that way at all.</p>
          <p>This is the gap the CORE framework was built to close. Not by making you sound different. By making you sound like what you already are, to the person you're actually trying to reach.</p>
          <p>The consultants I work with are not lacking expertise. They are lacking a brand that speaks their client's language clearly enough to make the right person stop, read, and say: this is exactly what I've been looking for.</p>
          <Link href="/core-framework" className="link-arrow mt-5">See how the CORE framework works</Link>
        </div>
      </div>
    </section>

    {/* IMAGE BREAK */}
    <section className="image-band">
      <div className="container">
        <figure className="img-frame img-frame--banner">
          <Image src="/images/Editorial%20photograph%20Nathan%20in%20conversation%20with%20a%20consultant%2C%20notebooks%20and%20reference%20materials%20in%20frame..png" alt="Nathan in conversation with a consultant, notebooks and reference materials in frame" loading="lazy" width={1600} height={686} />
        </figure>
      </div>
    </section>

    {/* SECTION 3 SOCIAL PROOF */}
    <section className="section">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Selected Work</p>
          <h2 className="text-balance">What changes when the brand finally matches the work.</h2>
        </header>

        <div className="case-grid">
          <Link href="/case-study-advisor" className="case-card">
            <p className="eyebrow eyebrow-muted">Senior advisor, 20-year practice</p>
            <p className="case-outcome text-balance">$75M+ engagement, acquired through positioning alone.</p>
            <p className="case-desc">A philanthropic advisor with decades of credibility had a brand that communicated none of it. A prior agency had failed her. Within six months of rebuilding her positioning and digital presence, she acquired an advisory engagement worth over $75 million. No campaign. No outreach. Precise positioning, and the right person finally saw what was always there.</p>
            <div className="case-foot">
              <span className="case-meta">Read the full case study</span>
              <span className="case-arrow" aria-hidden="true">→</span>
            </div>
          </Link>

          <Link href="/case-study-institution" className="case-card">
            <p className="eyebrow eyebrow-muted">Founder, civic institution</p>
            <p className="case-outcome text-balance">15,000 people, from no brand foundation.</p>
            <p className="case-desc">A founder building a cultural initiative in partnership with a municipal government had a vision and a partnership but no brand to hold either of them. We built the positioning, the platform, and the content strategy from the ground up. Fifteen thousand people showed up to something that had no prior history, no established audience, and no brand equity the week before we started.</p>
            <div className="case-foot">
              <span className="case-meta">Read the full case study</span>
              <span className="case-arrow" aria-hidden="true">→</span>
            </div>
          </Link>

          <Link href="/case-study-publisher" className="case-card">
            <p className="eyebrow eyebrow-muted">Subject-matter expert, first product</p>
            <p className="case-outcome text-balance">$39,378 in online revenue, from a repositioned product.</p>
            <p className="case-desc">An expert with deep knowledge and a strong mission had a product the market celebrated but didn't buy. The repositioning reframed it from a passion project into an institutional system, directed at the buyers who had the authority and budget to adopt it. $39,378 in online revenue followed.</p>
            <div className="case-foot">
              <span className="case-meta">Read the full case study</span>
              <span className="case-arrow" aria-hidden="true">→</span>
            </div>
          </Link>

          <Link href="/case-study-arts" className="case-card">
            <p className="eyebrow eyebrow-muted">Established organisation, audience plateau</p>
            <p className="case-outcome text-balance">First sold-out event in 15 years.</p>
            <p className="case-desc">A performing arts organisation hadn't sold out in 15 years. Not because the product had declined, but because the content had been speaking to the same audience for so long it had forgotten how to speak to anyone new. Two months of repositioned content and structured performance marketing later, the event sold out for the first time in 15 years.</p>
            <div className="case-foot">
              <span className="case-meta">Read the full case study</span>
              <span className="case-arrow" aria-hidden="true">→</span>
            </div>
          </Link>
        </div>
      </div>
    </section>

    {/* SECTION 4 THE FRAMEWORK */}
    <section className="section section-paper-deep">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">The Framework</p>
          <h2 className="text-balance">The CORE framework, built from experience, not borrowed from someone else's.</h2>
        </header>

        <div className="prose stack mb-7">
          <p>I did not find this framework in a course. I built it from 15 years of working in the field, from the years of taking the wrong clients because I didn't know my own value, to the moment I finally understood that brand strategy and digital marketing are two different things, and that without the first, the second produces nothing.</p>
          <p>The CORE framework starts with identity, not content. Before a single post is written, a single page is built, or a single ad is run, we answer one question: who are you to the people you serve, and does anything you're currently putting into the world reflect that accurately?</p>
          <p>Most of the time, for consultants who do exceptional work and have an invisible brand, the answer to the second part is no.</p>
        </div>

        <div className="core-letters">
          <article className="core-letter">
            <span className="glyph">C</span>
            <span className="label">Creative Authenticity</span>
            <p>We figure out what makes you genuinely different and build content that only you could make. Not content that sounds like the category. Content that sounds like you.</p>
          </article>
          <article className="core-letter">
            <span className="glyph">O</span>
            <span className="label">Organic Reach</span>
            <p>Your content finds the right people. No ads required to build the foundation. The right positioning makes the right audience self-select.</p>
          </article>
          <article className="core-letter">
            <span className="glyph">R</span>
            <span className="label">Repeatable Systems</span>
            <p>The systems that let you create in two hours what used to take all day, making every piece of content stronger than the one before it.</p>
          </article>
          <article className="core-letter">
            <span className="glyph">E</span>
            <span className="label">Engagement Strategy</span>
            <p>The move from people who watch to people who pay. Turning an audience into a client base through structured, intentional conversation.</p>
          </article>
        </div>

        <div className="cta-row mt-8">
          <Link href="/core-framework" className="btn btn-ghost">Learn the full CORE framework →</Link>
        </div>
      </div>
    </section>

    {/* IMAGE BREAK framework visual */}
    <section className="image-band">
      <div className="container">
        <figure className="img-frame img-frame--full">
          <Image src="/images/CORE%20framework.png" alt="CORE framework annotated visual showing the four layers and how they build on one another" loading="lazy" width={1600} height={900} />
        </figure>
      </div>
    </section>

    {/* SECTION 5 ABOUT NATHAN */}
    <section className="section">
      <div className="container">
        <div className="split split-asym">
          <div className="portrait-frame portrait-frame--full">
            <Image src="/images/about.png" alt="Nathan Okoye" width={1080} height={1350} />
          </div>
          <div>
            <p className="eyebrow">About Nathan</p>
            <h2 className="text-balance">I built this framework because I needed it and it didn't exist.</h2>
            <div className="prose stack">
              <p>Fifteen years ago I was a one-man operation doing websites, videos, graphics, and social media, telling anyone who asked that I did all of it. The confusion on their faces told me everything. I didn't know my value. I didn't know my niche. I didn't know my offer. I just knew I could do the work.</p>
              <p>I had clients who didn't pay. I had clients who didn't understand what we were building for them. I had years of taking any work that came in because I was operating from scarcity instead of strategy. I worked harder than I ever had and built less than I should have.</p>
              <p>The shift came when I stopped trying to fit what I did into language that made sense to me and started building the language that made sense to the people I was actually trying to serve. Once I understood brand strategy and added it to everything I already knew about digital marketing, everything changed. Not just for my clients. For us.</p>
              <p>The frameworks I teach are not borrowed. They were built from the failures, the late nights, the wrong clients, the missed opportunities, and the moments when we finally got it right and saw what was possible when a brand finally speaks the right language to the right person.</p>
              <Link href="/about" className="link-arrow mt-5">More about Nathan</Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* SECTION 6 WHO THIS IS FOR */}
    <section className="section section-paper-deep">
      <div className="container container-narrow">
        <header className="section-header">
          <p className="eyebrow">Who This Is For</p>
          <h2 className="text-balance">This is for you if your work is stronger than your pipeline.</h2>
        </header>
        <div className="prose stack">
          <p>You have been doing this long enough to be good at it. Your existing clients trust you. They refer you. They come back. But new business moves slowly, and when someone Googles you after a referral, what they find does not reflect the work they were told about.</p>
          <p>You know you need to be more visible. You are not sure how to do it without it feeling like self-promotion that doesn't fit who you are.</p>
          <p>You have tried posting consistently. You have tried explaining what you do more clearly. You have tried being more active on LinkedIn. And the pipeline has not moved the way your track record says it should.</p>
          <p>That is a positioning problem. Not a consistency problem. Not a content problem. Not a confidence problem, though confidence follows positioning and not the other way around.</p>
          <p>If your work is stronger than your pipeline, that gap is closeable. It has been closed for every client in the case studies above. It can be closed for you.</p>
          <Link href="/work-with-nathan" className="link-arrow mt-5">Start the conversation</Link>
        </div>
      </div>
    </section>

    {/* SECTION 7 CLOSING CTA */}
    <section className="cta-banner">
      <div className="container">
        <p className="eyebrow eyebrow-plain" style={{ display: 'block', textAlign: 'center', marginBottom: '1.25rem' }}>Ready</p>
        <h2 className="text-balance">Ready to close the gap?</h2>
        <p>The first step is a conversation, not a pitch. I want to understand where the gap is before I tell you what the work looks like. If we are the right fit, we will know it quickly.</p>
        <p>If you are a consultant or advisor whose brand does not yet reflect the work you do, this is where that changes.</p>
        <div className="cta-row">
          <Link href="/work-with-nathan" className="btn btn-primary btn-lg">Book a strategy call with Nathan →</Link>
          <Link href="/case-study-advisor" className="link-arrow">Read the case studies first</Link>
        </div>
      </div>
    </section>
    </>
  );
}
