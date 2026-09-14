import Link from "next/link";
import type { Metadata } from "next";
import { FIELD_NOTES, formatNoteDate } from "@/lib/fieldNotes";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Field Notes",
  description:
    "Writing on strategy, positioning, and why most consultants never leave the boardroom. New pieces published as they are written, not on a schedule.",
};

export default function WritingPage() {
  const posts = [...FIELD_NOTES].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow hero-eyebrow">Writing</p>
          <h1 className="hero-h1 text-balance">Field Notes</h1>
          <p className="hero-sub">
            Writing on strategy, positioning, and why most consultants never leave the boardroom.
          </p>
          <p className="hero-sub">New pieces published as I write them, not on a schedule.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stack" style={{ maxWidth: "46rem" }}>
            {posts.map((post) => (
              <article key={post.slug} style={{ paddingBlock: "1.5rem", borderBottom: "1px solid var(--line, rgba(0,0,0,0.08))" }}>
                <h2 style={{ marginBottom: "0.6rem" }}>
                  <Link href={`/writing/${post.slug}`}>{post.title}</Link>
                </h2>
                <p style={{ marginBottom: "0.6rem" }}>{post.description}</p>
                <p className="eyebrow eyebrow-plain">
                  {formatNoteDate(post.date)} · {post.readTime}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-paper-deep">
        <div className="container">
          <div className="prose stack" style={{ maxWidth: "46rem" }}>
            <p>
              I write when I have something worth publishing, not to hit a schedule. If you want new
              pieces in your inbox, subscribe below.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
