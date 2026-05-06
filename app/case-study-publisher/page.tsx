import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "From Passion Project to Institutional Product | Subject-Matter Expert Case Study",
  description: "A subject-matter expert had a product the market admired but didn\'t know how to buy. The repositioning generated $39,378 in online revenue from the same product, directed at the right audience.",
};

export default function CaseStudyPublisherPage() {
  return (
    <>
{/* HERO + META */}
    <section className="section-sm" style={{ paddingTop: 'clamp(3rem, 7vw, 5rem)' }}>
      <div className="container">
        <p className="eyebrow">Case Study · Subject-Matter Expert</p>
        <h1 className="h1 text-balance" style={{ maxWidth: '22ch' }}>
          From passion project to institutional product: how repositioning unlocked $39,378 in online revenue.
        </h1>

        <dl className="case-meta-row mt-7">
          <div>
            <dt>Client</dt>
            <dd>Subject-matter expert, first commercial product</dd>
          </div>
          <div>
            <dt>Engagement</dt>
            <dd>Brand Strategy, Product Positioning, Audience Clarification</dd>
          </div>
          <div>
            <dt>Timeline</dt>
            <dd>Dec 2024 – Apr 2025</dd>
          </div>
          <div>
            <dt>Result</dt>
            <dd>$39,378.53 in online revenue</dd>
          </div>
        </dl>

        <figure className="img-frame img-frame--wide mt-7">
          <Image
            src="/images/case-study-publisher-hero.png"
            alt="The product in a classroom or institutional context. Materials in use."
            width={1600}
            height={900}
            priority
          />
        </figure>
      </div>
    </section>

    {/* THE SHORT VERSION */}
    <section className="section-sm">
      <div className="container">
        <div className="prose">
          <p className="lead" style={{ maxWidth: '44ch' }}>
            A subject-matter expert had built something genuinely valuable an educational product rooted in deep knowledge and real cultural need. The market respected the mission. But respect and revenue are different things. Schools wanted to support the work. They didn't know how to implement it. The product read as a passion project, not a system. The repositioning changed that. The same product, reframed for the audiences that could actually adopt it institutionally, generated $39,378.53 in online revenue within the campaign window.
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
          <p>The product was not the problem. The classification was.</p>
          <p>When a school administrator, a curriculum coordinator, or a cultural institution evaluates an educational resource, they are not asking "is this meaningful?" They already know it is. They are asking: "Can I implement this? Does it fit our framework? Is this something I can bring to a committee and defend?" If the answer to those questions is unclear, the purchase doesn't happen regardless of how much the individual in the room believes in the work.</p>
          <p>This subject-matter expert had spent years building expertise and translating it into a flagship educational product with companion materials. The knowledge was deep. The mission was clear. But the brand spoke to people who already cared about the subject it did not speak to the institutional buyers who had the authority and budget to adopt it at scale.</p>
          <p>The result was a common and costly pattern: strong mission alignment, weak conversion. People sharing the work, celebrating it, endorsing it and then not buying it, because the path from belief to purchase had not been built.</p>
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
          <p>The CORE framework's first question is always about the gap between who the creator thinks they are serving and who actually has the power to act.</p>
          <p>In this case, the gap was specific. The product had been positioned for end users parents, individuals, community members who connected with the subject matter emotionally. That audience is real and valuable. But the product's actual scalability lived with a different audience entirely: educators, school boards, and cultural institutions who operate through procurement processes, curriculum frameworks, and committee decisions.</p>
          <p>These two audiences speak different languages. The end user responds to mission and meaning. The institutional buyer responds to implementation clarity, structural credibility, and evidence that the product fits within an existing system. The brand had been built entirely in the first language. It needed to become fluent in the second without losing the first.</p>
          <p>Three things were reframed:</p>
          <p><strong>The product suite architecture.</strong> The flagship kit and its companion products including bilingual materials were repositioned as a structured ecosystem rather than a collection of related items. An ecosystem has logic. It has a centre and a periphery. Institutional buyers can map it to their existing frameworks. A collection is something you pick through. A system is something you adopt.</p>
          <p><strong>The audience hierarchy.</strong> Messaging was sharpened to address institutional decision-makers as the primary audience, with end users as secondary. This is not a shift in values the mission didn't change. It is a shift in language and structure that makes the same mission legible to the people who control the budgets and the adoption decisions.</p>
          <p><strong>The authority signals.</strong> The brand was translated from passion-project language into curriculum-adjacent language the specific register that educators and school boards use when evaluating resources for institutional use. Credibility in this context is not about credentials. It is about whether the product reads as something that belongs in a classroom, not just in a home.</p>
        </div>
      </div>
    </section>

    {/* THE OUTCOME */}
    <section className="section">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">The Outcome</p>
          <h2 className="text-balance">What did $39,378 in online revenue actually represent?</h2>
        </header>
        <div className="prose stack">
          <p>The revenue figure represents something more important than a campaign result. It represents proof of concept for institutional positioning.</p>
          <p>The same product that the market had been celebrating without converting generated nearly $40,000 in online revenue once the positioning was corrected. No new product was built. No new audience was invented. The expert's knowledge didn't change. What changed was the clarity with which that knowledge was packaged and the precision with which it was directed at the people who could act on it.</p>
          <p>The bilingual English/French materials, repositioned as a strategic advantage for national adoption rather than a secondary feature, opened a specific institutional channel that had previously been invisible. School boards operating across language requirements don't see bilingual materials as a bonus. They see them as a requirement. Naming that explicitly changed how those buyers evaluated the product.</p>
        </div>

        <blockquote className="pullquote mt-7">
          The product was always worth buying. The question was always whether it was being offered to the person who could.
        </blockquote>
      </div>
    </section>

    {/* IMAGE BREAK outcome */}
    <section className="image-band">
      <div className="container">
        <figure className="img-frame img-frame--banner">
          <Image
            src="/images/case-study-publisher-banner.png"
            alt="Repositioned product suite — bilingual materials, ecosystem layout, institutional packaging."
            width={1600}
            height={686}
            loading="lazy"
          />
        </figure>
      </div>
    </section>

    {/* CLIENT QUOTE */}
    <section className="section-sm">
      <div className="container container-narrow">
        <p className="eyebrow">In Their Words</p>
        <div className="client-quote">
          <q>We had spent years building something we believed in, and watching people celebrate it without buying it. Nathan helped us see who was actually in a position to say yes and how to speak to them.</q>
          <p className="attribution">Subject-matter expert, anonymised &nbsp; <span className="note">INSERT: anonymised client quote</span></p>
        </div>
      </div>
    </section>

    {/* THE LESSON */}
    <section className="section section-paper-deep">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">The Lesson</p>
          <h2 className="text-balance">What subject-matter experts and consultants take from this case.</h2>
        </header>
        <div className="prose stack">
          <p>This is the case study I point to when a consultant tells me their work is undervalued. Not because the word "undervalued" is wrong it usually isn't. But because the solution they are reaching for (charge more, find better clients, explain it better in conversations) addresses the symptom rather than the cause.</p>
          <p>The cause, almost always, is that the brand is speaking to the wrong version of the right audience. The people who love the work are not always the people who have the authority or the budget to buy it at the level the work deserves. Identifying that gap and building positioning that speaks to the buyer rather than the admirer is what converts respected expertise into revenue.</p>
          <p>For this client, the gap cost years of celebrated work that didn't convert at the scale it should have. The repositioning didn't require starting over. It required looking clearly at who was actually in a position to say yes, and building the language that made it easy for them to do so.</p>
          <p>The product was always worth buying. The question was always whether it was being offered to the person who could.</p>
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

          <Link href="/case-study-arts" className="case-card">
            <p className="eyebrow eyebrow-muted">Performing arts organisation</p>
            <p className="case-outcome text-balance">First sold-out event in 15 years.</p>
            <p className="case-desc">An established organisation that had been speaking to the same audience for so long it had forgotten how to speak to anyone new. Two months later, the event sold out.</p>
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
