import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Nathan Okoye",
  description:
    "Strategist. Fifteen years of practice. Author of the writing on this site. Nathan Okoye runs Authority Architect at OCIDM, a diagnostic engagement for established organizations whose growth has stalled.",
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
              <h1 className="hero-h1 text-balance">About Nathan Okoye</h1>
              <p className="hero-sub">
                Strategist. Fifteen years of practice. Author of the writing on this site.
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
            <h2 className="text-balance">I didn&apos;t climb the ladder. I climbed the tree.</h2>
          </header>
          <div className="prose stack">
            <p>I started out doing everything. Websites. Videos. Graphics. Music videos for $500. Social media. If someone needed it and I could figure it out, I did it. I called it a business. What it actually was, was a one-man operation with no niche, no offer, and no idea what I was really selling.</p>
            <p>When someone asked me what I did, I told them everything. And I watched their eyes glaze over.</p>
            <p>I didn&apos;t go to school for business. I didn&apos;t come up through an agency or a structured career path. I learned by doing, by failing, by staying up through the night to figure out what the textbooks don&apos;t teach. That felt like a weakness for a long time. I had imposter syndrome. I worried that because I hadn&apos;t climbed the ladder the conventional way, I didn&apos;t have the right to claim what I knew.</p>
            <p>What I didn&apos;t see then was that the path I took gave me something that a structured career rarely does. I went deep into territory most people outsource or skip. I learned digital marketing from the inside out. I learned what happens when you build a website with no brand strategy behind it. I learned what happens when you post every day with no positioning. I learned what happens when you take clients who can&apos;t afford you because you&apos;re operating from scarcity and not from value.</p>
            <p>I learned all of it the hard way. And that is exactly why the work holds up now.</p>
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
            <p>We didn&apos;t know what we were worth because we hadn&apos;t yet learned the language that communicates value. We were building brands for clients without having built our own.</p>
            <p>The shift came in stages. First, I discovered brand strategy, which I realised was completely separate from digital marketing. Most digital marketing agencies don&apos;t understand brand strategy. That gap is why so much digital marketing produces activity but not results. Once I understood both, and understood how they connect, everything we produced for clients became more effective. Not incrementally. Completely.</p>
            <p>Then came the harder shift. We had to stop taking clients who didn&apos;t fit. Not because we didn&apos;t need the money. Because working with the wrong clients was costing us the time, the clarity, and the confidence we needed to build something real. We let go of work that wasn&apos;t right for us. We got more focused, less stressed, and started producing results that actually reflected what we were capable of.</p>
          </div>
        </div>
      </section>

      {/* IMAGE BREAK */}
      <section className="image-band">
        <div className="container">
          <figure className="img-frame img-frame--banner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/about-workspace.svg" alt="Editorial flat-lay of a workspace. An open notebook, pen, reference cards and coffee. The craft behind the work." />
          </figure>
        </div>
      </section>

      {/* SECTION 3 WHO NATHAN IS */}
      <section className="section">
        <div className="container">
          <header className="section-header">
            <p className="eyebrow">Who Nathan Is</p>
            <h2 className="text-balance">What fifteen years actually looks like.</h2>
          </header>
          <div className="prose stack">
            <p>I am a strategist based in Canada. I run OCIDM, the practice through which my team delivers strategy and digital systems for clients who want the work done properly. The thinking I publish on this site is the same thinking underneath every client engagement.</p>
            <p>My work sits at the intersection of strategy, positioning, content systems, and community building. I do not separate these things because they are not separate. A brand without a content system is a logo and a tagline. A content system without strategy is noise. A community without both is just an audience that doesn&apos;t know why it showed up.</p>
            <p>The practice has run across philanthropy, education, arts, and civic sectors. A philanthropic advisor whose clients raised $135M+ after repositioning. A vocal arts festival that sold out all six events for the first time in fifteen years. A civic cultural initiative that grew from 2,000 to 13,000 followers and from 15,000 to 20,000 attendees.</p>
            <p>None of those results came from tactics. They came from starting in the right place, with the right question, every time.</p>
            <p>Outside the work, I am a father. The fear of not being able to provide for my kids was one of the early engines that kept me pushing through the years when nothing was working. That same clarity about what actually matters is what keeps the work honest now.</p>
          </div>

          <div className="image-duo mt-7">
            <figure className="img-frame img-frame--landscape">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/about-personal.svg" alt="A father's quiet early hour. Dawn light through a window, a child's crayon drawing of the family taped to the glass, two mugs, well-read books with reading glasses and a framed family portrait. The life, and the reason, behind the work." />
            </figure>
            <figure className="img-frame img-frame--landscape">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/about-toronto.svg" alt="The Toronto skyline at dusk with the CN Tower. A sense of place. Where the work happens." />
            </figure>
          </div>
        </div>
      </section>

      {/* SECTION 4 WHAT I RUN */}
      <section className="cta-banner">
        <div className="container">
          <p className="eyebrow eyebrow-plain" style={{ display: 'block', textAlign: 'center', marginBottom: '1.25rem' }}>What I run</p>
          <h2 className="text-balance">Authority Architect, at OCIDM.</h2>
          <p>I run Authority Architect at OCIDM, a diagnostic engagement for established organizations whose growth has stalled.</p>
          <p>The full practice lives at ocidm.io. This site is where I write about the thinking behind it.</p>
          <div className="cta-row">
            <a href="#" data-arivio-widget="open" className="btn btn-primary btn-lg">Work with me</a>
          </div>
        </div>
      </section>
    </>
  );
}
