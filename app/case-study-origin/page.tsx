import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How I Built the Framework by Living the Problem First",
  description:
    "Nathan Okoye spent 15 years as the invisible expert before building the CORE framework. This is that story.",
};

export default function CaseStudyOriginPage() {
  return (
    <>
      {/* HERO + META */}
      <section className="section-sm" style={{ paddingTop: 'clamp(3rem, 7vw, 5rem)' }}>
        <div className="container">
          <p className="eyebrow">Case Study · The Origin Story</p>
          <h1 className="h1 text-balance" style={{ maxWidth: '22ch' }}>
            How I Built the Framework by Living the Problem First
          </h1>

          <dl className="case-meta-row mt-7">
            <div>
              <dt>Client</dt>
              <dd>Nathan Okoye, Founder OCIDM</dd>
            </div>
            <div>
              <dt>Engagement</dt>
              <dd>15 Years of Hard-Won Experience</dd>
            </div>
            <div>
              <dt>Timeline</dt>
              <dd>2009 — Present</dd>
            </div>
            <div>
              <dt>Result</dt>
              <dd>The CORE Framework — applied across $75M+ in client outcomes</dd>
            </div>
          </dl>

          <div className="img-placeholder img-placeholder--wide mt-7">
            <div className="img-placeholder__inner">
              <span className="img-placeholder__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="9" cy="11" r="1.5"/><path d="M3 17l5-4 4 3 4-2 5 3"/></svg>
              </span>
              <p className="img-placeholder__eyebrow">Image · 16:9 hero</p>
              <p className="img-placeholder__caption">Editorial portrait — Nathan Okoye, the founder behind the framework.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE OPENING */}
      <section className="section">
        <div className="container">
          <div className="prose stack">
            <p>Fifteen years ago I was editing music videos in my basement for $100 a project — and spending five days on each edit.</p>
            <p>I thought that was the business.</p>
            <p>It wasn't.</p>
          </div>
        </div>
      </section>

      {/* THE PIVOT */}
      <section className="section section-paper-deep">
        <div className="container">
          <header className="section-header">
            <p className="eyebrow">The Pivot</p>
            <h2 className="text-balance">The sentence that became the foundation of everything I do now.</h2>
          </header>
          <div className="prose stack">
            <p>The pivot came when a mentor asked me what I did. I listed everything. Websites. Apps. Social media. Commercials. Videos. He looked at me with something close to pity and said:</p>
          </div>

          <blockquote className="pullquote mt-7">
            If you confuse people when describing yourself, they won't trust you.
          </blockquote>

          <div className="prose stack">
            <p>That sentence became the foundation of everything I do now.</p>
          </div>
        </div>
      </section>

      {/* THE COST */}
      <section className="section">
        <div className="container">
          <header className="section-header">
            <p className="eyebrow">The Cost</p>
            <h2 className="text-balance">For years I kept making the same mistake in a different form.</h2>
          </header>
          <div className="prose stack">
            <p>For years after that conversation I kept making the same mistake in a different form. I was building brands for clients without having built my own. I was charging $5,000 for work worth $20,000 because I hadn't built the positioning that made the higher number feel obvious. I was taking clients who couldn't afford me because I was operating from scarcity instead of strategy.</p>
            <p>The work was good. The results were real. But the brand was invisible — and an invisible brand costs you in ways you don't always see directly. The referral that doesn't come. The prospect who seemed interested and then went quiet. The client who pushed back on price and you folded because you didn't have the positioning to hold it.</p>
            <p>I was the consultant with the wrong brand problem.</p>
          </div>
        </div>
      </section>

      {/* THE SHIFT */}
      <section className="section section-paper-deep">
        <div className="container">
          <header className="section-header">
            <p className="eyebrow">The Shift</p>
            <h2 className="text-balance">From speaking to yourself to speaking to your client.</h2>
          </header>
          <div className="prose stack">
            <p>I thought I needed to explain myself better. To post more consistently. To find a better way to describe what I did. What I actually needed was to stop speaking my own language and start building the language that made sense to the people I was trying to reach.</p>
            <p>That shift — from speaking to yourself to speaking to your client — is the insight the CORE framework is built on.</p>
            <p>I did not build CORE from theory. I built it from the specific failures that taught me what works and what does not when expertise needs to become visible authority. Every layer of the framework exists because I lived the cost of not having it.</p>
          </div>
        </div>
      </section>

      {/* THE LESSON */}
      <section className="section">
        <div className="container">
          <header className="section-header">
            <p className="eyebrow">The Lesson</p>
            <h2 className="text-balance">The version of your practice that was always possible.</h2>
          </header>
          <div className="prose stack">
            <p>The consultants and advisors I work with today are not in a different situation than I was. They are doing exceptional work. Their existing clients trust them. Their track record is real. But their brand is speaking their language — not their client's language — and the gap is costing them in ways they can feel but not always name.</p>
            <p>The CORE framework closes that gap. It did it for me. It has done it for every client I have applied it to.</p>
            <p>The result is not just a better brand. It is the version of your practice that was always possible — finally visible to the people who need to find it.</p>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="cta-banner">
        <div className="container">
          <p className="eyebrow eyebrow-plain" style={{ display: 'block', textAlign: 'center', marginBottom: '1.25rem' }}>The Next Step</p>
          <h2 className="text-balance">If you recognise yourself in this story, the Strategic Authenticity Assessment is the fastest way to see exactly where your gap is.</h2>
          <div className="cta-row">
            <Link href="/assessment" className="btn btn-primary btn-lg">Take the Assessment →</Link>
            <Link href="/case-study-advisor" className="link-arrow">Read the other case studies</Link>
          </div>
        </div>
      </section>
    </>
  );
}
