import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FIELD_NOTES, formatNoteDate, getFieldNote } from "@/lib/fieldNotes";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return FIELD_NOTES.map((n) => ({ slug: n.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const note = getFieldNote(params.slug);
  if (!note) return {};
  return { title: note.title, description: note.description };
}

export default function FieldNotePage({ params }: Props) {
  const note = getFieldNote(params.slug);
  if (!note) notFound();

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow hero-eyebrow">Field Notes</p>
          <h1 className="hero-h1 text-balance">{note.title}</h1>
          <p className="eyebrow eyebrow-plain" style={{ marginTop: "1rem" }}>
            {formatNoteDate(note.date)} · {note.readTime}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="prose stack" style={{ maxWidth: "46rem" }}>
            {note.body.map((block, i) =>
              block.startsWith("## ") ? (
                <h2 key={i} style={{ marginTop: "1.5rem" }}>{block.slice(3)}</h2>
              ) : (
                <p key={i}>{block}</p>
              )
            )}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <h2 className="text-balance">This is the thinking behind the diagnostic.</h2>
          <p>
            I run Authority Architect at OCIDM, a diagnostic engagement for established organizations
            whose growth has stalled despite consistent effort.
          </p>
          <div className="cta-row">
            <a href="#" data-arivio-widget="open" className="btn btn-primary btn-lg">
              Work with me
            </a>
            <Link href="/writing" className="link-arrow">
              Read more Field Notes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
