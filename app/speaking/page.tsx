import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speaking",
  description:
    "Nathan Okoye speaks on strategy, positioning, and why most consultants never leave the boardroom. Available for conferences, association meetings, and sector gatherings.",
};

export default function SpeakingPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow hero-eyebrow">Speaking</p>
          <h1 className="hero-h1 text-balance">Speaking</h1>
          <p className="hero-sub">
            Available for talks on strategy, positioning, and why most consultants never leave the
            boardroom.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="prose stack" style={{ maxWidth: "46rem" }}>
            <p>
              I speak on the same topics I write about, at conferences, association meetings, and
              sector gatherings where the audience is leaders of established organizations rather
              than marketing practitioners.
            </p>
          </div>

          <header className="section-header" style={{ marginTop: "3rem" }}>
            <p className="eyebrow">Topics I present</p>
          </header>
          <div className="prose stack" style={{ maxWidth: "46rem" }}>
            <p>
              <strong>Most consultants never leave the boardroom.</strong> Why leadership-only
              strategy fails and what the diagnostic model does instead.
            </p>
            <p>
              <strong>The three views of an organization that almost never match.</strong> A working
              session on finding the gap between leadership vision, operational reality, and customer
              experience.
            </p>
            <p>
              <strong>Fixing positioning before you buy more marketing.</strong> Why growth stalls
              when the message is aimed at the wrong person, and how to know if that&apos;s
              what&apos;s happening to you.
            </p>
            <p>
              The sectors I know best: cultural institutions, philanthropic practices, civic
              organizations, established professional services.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <p className="eyebrow eyebrow-plain" style={{ display: "block", textAlign: "center", marginBottom: "1.25rem" }}>
            Availability
          </p>
          <h2 className="text-balance">I take a small number of speaking engagements each year.</h2>
          <p>If you&apos;re organizing something that fits, get in touch.</p>
          <div className="cta-row">
            <a href="#" data-arivio-widget="open" className="btn btn-primary btn-lg">
              Get in touch
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
