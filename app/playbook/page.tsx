import type { Metadata } from "next";
import PlaybookForm from "./PlaybookForm";

export const metadata: Metadata = {
  title: "The Visibility Playbook",
  description:
    "A practical guide for consultants, coaches, and advisors who are done posting into the void. The four post types that build authority for established practitioners, and how to move from content that performs to content that converts.",
};

export default function PlaybookPage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container container-narrow">
          <div className="hero-centered">
            <p className="eyebrow hero-eyebrow">The Playbook</p>
            <h1 className="hero-h1 text-balance" style={{ maxWidth: '22ch' }}>
              The Visibility Playbook
            </h1>
            <p className="hero-sub" style={{ marginInline: 'auto' }}>
              A practical guide for consultants, coaches, and advisors who are done posting into the void.
            </p>
          </div>
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className="section-sm">
        <div className="container">
          <PlaybookForm />
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="section">
        <div className="container">
          <header className="section-header">
            <p className="eyebrow">What's Inside</p>
            <h2 className="text-balance">Three sections, written for practitioners who already do the work.</h2>
          </header>

          <div className="prose stack">
            <h3>1. Why your content is not connecting — and it is not a consistency problem</h3>
            <p>The most common diagnosis ("post more, post consistently") fixes the wrong thing. The actual problem sits one layer below — and once you see it, the content you already produce starts to land. The first section walks through the gap most consultants don't realise they're talking past, and the small re-frame that closes it.</p>

            <h3>2. The four post types that build authority for established practitioners</h3>
            <p>Most content advice is built for creators selling courses, not consultants selling expertise. The four post types in this section are the ones that actually move a 15-year practice forward — point-of-view, pattern recognition, contrarian read, and decision frame. Each comes with a structure, a worked example, and a way to recognise when you're falling back into category-language without realising it.</p>

            <h3>3. How to move from content that performs to content that converts</h3>
            <p>Reach without conversion is a distribution list, not a pipeline. Section three covers the engagement architecture that turns the right reader into the right conversation: how a single piece of content seeds a discovery call, what to invite, and what to never write at the bottom of a post if you want a serious prospect to take you seriously.</p>
          </div>
        </div>
      </section>
    </>
  );
}
