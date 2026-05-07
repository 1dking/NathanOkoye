import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Nathan Okoye",
  description: "Nathan Okoye is a brand strategist who spent 15 years building the framework he wish he had on day one. He works with established consultants whose brand does not yet reflect the work they do.",
};

export default function AboutPage() {
  return (
    <>
{/* HERO */}
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <p className="eyebrow hero-eyebrow">About</p>
            <h1 className="hero-h1 text-balance">
              I spent 15 years learning what I wish I had known on day one.
            </h1>
            <p className="hero-sub">
              Now I teach it to consultants who are doing the work but not getting the recognition, the clients, or the revenue their expertise deserves.
            </p>
          </div>
          <div className="portrait-frame">
            <Image src="/images/nateceo.png" alt="Portrait of Nathan Okoye" loading="eager" priority width={1080} height={1350} />
          </div>
        </div>
      </div>
    </section>

    {/* SECTION 1 THE ORIGIN */}
    <section className="section">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">The Origin</p>
          <h2 className="text-balance">I didn't climb the ladder. I climbed the tree.</h2>
        </header>
        <div className="prose stack">
          <p>I started out doing everything. Websites. Videos. Graphics. Music videos for $500. Social media. If someone needed it and I could figure it out, I did it. I called it a business. What it actually was, was a one-man operation with no niche, no offer, and no idea what I was really selling.</p>
          <p>When someone asked me what I did, I told them everything. And I watched their eyes glaze over.</p>
          <p>I didn't go to school for business. I didn't come up through an agency or a structured career path. I learned by doing, by failing, by staying up through the night to figure out what the textbooks don't teach. That felt like a weakness for a long time. I had imposter syndrome. I worried that because I hadn't climbed the ladder the conventional way, I didn't have the right to claim what I knew.</p>
          <p>What I didn't see then was that the path I took gave me something that a structured career rarely does. I went deep into territory most people outsource or skip. I learned digital marketing from the inside out. I learned what happens when you build a website with no brand strategy behind it. I learned what happens when you post every day with no positioning. I learned what happens when you take clients who can't afford you because you're operating from scarcity and not from value.</p>
          <p>I learned all of it the hard way. And that is exactly why the frameworks I built work.</p>
        </div>
      </div>
    </section>

    {/* SECTION 2 THE SHIFT */}
    <section className="section section-paper-deep">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">The Shift</p>
          <h2 className="text-balance">The moment everything changed.</h2>
        </header>
        <div className="prose stack">
          <p>There was a client early on who told us she would pay later. She never did. That was the moment I understood I had been aiming at the wrong market with the talent I had.</p>
          <p>There was another client we charged $5,000 for a website. She pushed back on the price, wanted to see more work. We did the project. When it was done, she told us she would have paid $15,000 more. She felt guilty for not paying us what we were worth. She offered to consult with us on how to charge what we deserved.</p>
          <p>We didn't know what we were worth because we hadn't yet learned the language that communicates value. We were building brands for clients without having built our own.</p>
          <p>The shift came in stages. First, I discovered brand strategy, which I realised was completely separate from digital marketing. Most digital marketing agencies don't understand brand strategy. That gap is why so much digital marketing produces activity but not results. Once I understood both, and understood how they connect, everything we produced for clients became more effective. Not incrementally. Completely.</p>
          <p>Then came the harder shift. We had to stop taking clients who didn't fit. Not because we didn't need the money. Because working with the wrong clients was costing us the time, the clarity, and the confidence we needed to build something real. We let go of work that wasn't right for us. We got more focused, less stressed, and started producing results that actually reflected what we were capable of.</p>
          <p>That is when the CORE framework took shape. Not as a theory. As a system we had tested on ourselves before we ever sold it to anyone else.</p>
        </div>
      </div>
    </section>

    {/* IMAGE BREAK */}
    <section className="image-band">
      <div className="container">
        <div className="img-placeholder img-placeholder--banner">
          <div className="img-placeholder__inner">
            <span className="img-placeholder__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="9" cy="11" r="1.5"/><path d="M3 17l5-4 4 3 4-2 5 3"/></svg>
            </span>
            <p className="img-placeholder__eyebrow">Image · 21:9 banner</p>
            <p className="img-placeholder__caption">Editorial photograph workspace, in motion. The craft behind the framework.</p>
          </div>
        </div>
      </div>
    </section>

    {/* SECTION 3 THE FRAMEWORK */}
    <section className="section">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">The Framework</p>
          <h2 className="text-balance">Why I built CORE and what it actually does.</h2>
        </header>
        <div className="prose stack">
          <p>Most of the frameworks I studied were built by people who left out the parts that made them necessary. They gave you the how without the why behind it. The structure without the struggle that produced it. That meant the frameworks worked for them, in their context, with their experience underneath it, but not necessarily for the person trying to apply them without that same foundation.</p>
          <p>I built CORE differently. I built it from the specific failure I kept seeing in every client we worked with and in ourselves before we fixed it. The failure is simple: the business speaks its own language and calls it marketing.</p>
          <p>A consultant writes their bio the way they think about their work. They post content that reflects how they see their expertise. They build a website that makes sense to them. None of it is wrong. None of it resonates with the person they are trying to reach, because that person thinks about it completely differently.</p>
          <p>CORE closes that gap. It starts with identity, not content. It figures out who you actually are to the people you serve, then builds the content, the systems, and the engagement strategy around that identity. In that order. Every time.</p>
          <p>The result is a brand that sounds like you, reaches the right people without paid ads to establish the foundation, and converts attention into real conversations.</p>
          <p>I have used it with philanthropic advisors, cultural founders, subject-matter experts, and established organisations. The context changes. The gap it closes is always the same.</p>
          <Link href="/core-framework" className="link-arrow mt-5">Read the full CORE framework</Link>
        </div>
      </div>
    </section>

    {/* SECTION 4 WHO NATHAN IS */}
    <section className="section section-paper-deep">
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Who Nathan Is</p>
          <h2 className="text-balance">What 15 years actually looks like.</h2>
        </header>
        <div className="prose stack">
          <p>I am a brand strategist based in Canada. I run OCIDM, the agency through which my team delivers brand strategy and digital systems for clients who want the work done for them. The frameworks I teach through my personal brand are the same ones we use in every client engagement.</p>
          <p>My work sits at the intersection of brand strategy, digital marketing, content systems, and community building. I do not separate these things because they are not separate. A brand without a content system is a logo and a tagline. A content system without brand strategy is noise. A community without both is just an audience that doesn't know why it showed up.</p>
          <p>I have helped a senior advisor acquire a $75 million engagement through positioning alone. I have built a cultural initiative from nothing to 15,000 attendees. I have repositioned an expert's first product from celebrated to purchased, generating $39,378 in online revenue. I have helped an established performing arts organisation sell out for the first time in 15 years.</p>
          <p>None of those results came from tactics. They came from starting in the right place, with the right question, every time.</p>
          <p>Outside the work, I am a father. The fear of not being able to provide for my kids was one of the early engines that kept me pushing through the years when nothing was working. That same clarity about what actually matters is what keeps the work honest now.</p>
        </div>

        <div className="image-duo mt-7">
          <div className="img-placeholder img-placeholder--landscape">
            <div className="img-placeholder__inner">
              <span className="img-placeholder__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="9" cy="11" r="1.5"/><path d="M3 17l5-4 4 3 4-2 5 3"/></svg>
              </span>
              <p className="img-placeholder__eyebrow">Image · 3:2</p>
              <p className="img-placeholder__caption">Personal a quieter moment. The life behind the work.</p>
            </div>
          </div>
          <div className="img-placeholder img-placeholder--landscape">
            <div className="img-placeholder__inner">
              <span className="img-placeholder__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="9" cy="11" r="1.5"/><path d="M3 17l5-4 4 3 4-2 5 3"/></svg>
              </span>
              <p className="img-placeholder__eyebrow">Image · 3:2</p>
              <p className="img-placeholder__caption">Toronto a sense of place. Where the work happens.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* SECTION 5 THE INVITATION */}
    <section className="cta-banner">
      <div className="container">
        <p className="eyebrow eyebrow-plain" style={{ display: 'block', textAlign: 'center', marginBottom: '1.25rem' }}>The Invitation</p>
        <h2 className="text-balance">If you recognise yourself in this, we should talk.</h2>
        <p>I work with consultants who are good at what they do and whose brand does not yet reflect it. People who have built something real but whose public presence tells a different, smaller story than the one their clients would tell about them.</p>
        <p>If that is where you are, the gap is not a mystery. It is a positioning problem with a clear solution. I have closed it enough times to know exactly where to start.</p>
        <p>The first conversation is about understanding your situation, not pitching a programme. If there is a fit, we will know it quickly.</p>
        <div className="cta-row">
          <a href="#" data-arivio-widget="open" className="btn btn-primary btn-lg">Book a strategy call with Nathan →</a>
          <Link href="/case-study-advisor" className="link-arrow">See the case studies</Link>
        </div>
      </div>
    </section>
    </>
  );
}
