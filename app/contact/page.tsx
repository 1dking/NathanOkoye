import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work with me",
  description:
    "The diagnostic and the engagement live at OCIDM. If your organization has been doing the right things consistently and the numbers still won't compound, the scoping call is thirty minutes and it costs nothing.",
};

export default function ContactPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow hero-eyebrow">Contact</p>
          <h1 className="hero-h1 text-balance">Work with me</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="prose stack" style={{ maxWidth: "46rem" }}>
            <p>The diagnostic and the engagement live at OCIDM.</p>
            <p>
              If your organization has been doing the right things consistently and the numbers
              still won&apos;t compound, the scoping call is thirty minutes and it costs nothing.
            </p>
            <div className="cta-row" style={{ marginTop: "1.5rem" }}>
              <a href="#" data-arivio-widget="open" className="btn btn-primary btn-lg">
                Book a scoping call
              </a>
            </div>
            <p style={{ marginTop: "2rem" }}>
              For speaking inquiries, media, or anything else, email{" "}
              <a href="mailto:nathan@ocidm.com">nathan@ocidm.com</a> directly.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
