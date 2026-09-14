"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { FIELD_NOTES, formatNoteDate } from "@/lib/fieldNotes";

gsap.registerPlugin(ScrollTrigger);

/* Hero orbit frame sequence (extracted from the Seedance orbit clip). */
const FRAME_COUNT = 160;
const framePath = (i: number) =>
  `/sequence/hero/frame_${String(i + 1).padStart(4, "0")}.webp`;

/* What I do — revealed one panel at a time over The Builder clip. */
const PILLARS = [
  {
    index: "01",
    title: "The Diagnostic",
    desc: "I run Authority Architect at OCIDM, a diagnostic engagement for established organizations whose growth has plateaued despite consistent marketing spend.",
  },
  {
    index: "02",
    title: "The Method",
    desc: "The method interviews leadership, staff, and customers separately, because those three views of an organization almost never match, and the gap between them is where growth dies.",
  },
  {
    index: "03",
    title: "The Sectors",
    desc: "Cultural institutions. Philanthropic practices. Civic groups. Established professional services. Fifteen years of practice, across philanthropy, education, arts, and civic sectors.",
  },
];

/* Recent work — the numbers behind the case narratives at OCIDM. */
const STATS = [
  {
    prefix: "$",
    value: 135,
    suffix: "M+",
    label: "Raised by a philanthropic advisor's clients after repositioning",
  },
  {
    prefix: "",
    value: 6,
    suffix: " of 6",
    label: "SING! Toronto Vocal Arts Festival events sold out, first time in fifteen years",
  },
  {
    prefix: "",
    value: 20000,
    suffix: "",
    label: "Caribana Ignite attendees, up from 15,000. Followers grew from 2,000 to 13,000.",
  },
];

function HeroName() {
  const words = useMemo(() => ["NATHAN", "OKOYE"], []);
  return (
    <h1 className="cin-hero-name" aria-label="Nathan Okoye">
      {words.map((word, w) => (
        <span className="word" key={word} aria-hidden="true">
          {word.split("").map((ch, i) =>
            w === 1 ? (
              <em className="letter" key={i}>{ch}</em>
            ) : (
              <span className="letter" key={i}>{ch}</span>
            )
          )}
        </span>
      ))}
    </h1>
  );
}

export default function CinematicHome() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [activePillar, setActivePillar] = useState(0);

  const recentNotes = useMemo(
    () => [...FIELD_NOTES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3),
    []
  );

  useEffect(() => {
    document.body.classList.add("is-cinema", "is-cinema-home");
    return () => document.body.classList.remove("is-cinema", "is-cinema-home");
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d")!;
    const images: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    const state = { frame: 0 };
    let destroyed = false;
    let loadedCount = 0;

    const draw = () => {
      const img =
        images[state.frame] ??
        // fall back to the nearest loaded frame so scrubbing never blanks
        images.slice(0, state.frame + 1).reverse().find(Boolean) ??
        images.find(Boolean);
      if (!img) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = canvas.clientWidth * dpr;
      const ch = canvas.clientHeight * dpr;
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      // cover-fit
      const scale = Math.max(cw / img.width, ch / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    // Preload frames; unlock the page once the first quarter is in.
    // The auto-looping SCROLL DOWN word starts with the unlock.
    let scrollWordTl: gsap.core.Timeline | null = null;
    let scrollWordStarted = false;
    const unlock = () => {
      setLoaded(true);
      if (!scrollWordStarted) {
        scrollWordStarted = true;
        scrollWordTl?.play();
      }
    };
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        if (destroyed) return;
        images[i] = img;
        loadedCount++;
        if (i === 0) draw();
        if (loadedCount >= Math.min(FRAME_COUNT * 0.25, FRAME_COUNT)) unlock();
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount >= FRAME_COUNT * 0.25) unlock();
      };
    }

    // Smooth scroll
    let lenis: Lenis | null = null;
    if (!reduceMotion) {
      lenis = new Lenis({ lerp: 0.09 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis!.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    const mm = gsap.context(() => {
      // --- HERO: scrub the orbit ---
      gsap.to(state, {
        frame: FRAME_COUNT - 1,
        snap: "frame",
        ease: "none",
        onUpdate: draw,
        scrollTrigger: {
          trigger: ".cin-hero",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });

      // WELCOME / I AM travel with him — each word emerges in the distance,
      // grows as he approaches, and blows past the lens. One scrubbed
      // timeline, 100 units = 100% of the walk.
      const words = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".cin-hero",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });
      words
        .set({}, {}, 100) // pin timeline length to 100 units
        .fromTo(
          '[data-word="greetings"]',
          { scale: 0.45, opacity: 0, filter: "blur(6px)" },
          { scale: 1, opacity: 1, filter: "blur(0px)", duration: 13 },
          5
        )
        .to(
          '[data-word="greetings"]',
          { scale: 3.2, opacity: 0, filter: "blur(14px)", duration: 17 },
          18
        )
        .fromTo(
          '[data-word="iam"]',
          { scale: 0.45, opacity: 0, filter: "blur(6px)" },
          { scale: 1, opacity: 1, filter: "blur(0px)", duration: 12 },
          42
        )
        .to(
          '[data-word="iam"]',
          { scale: 3.2, opacity: 0, filter: "blur(14px)", duration: 16 },
          54
        );

      // Name + subtitle stay hidden through the walk; they track in only
      // after the arms-open welcome (~78% of the scrub, ~frame 125/160).
      gsap.set(".cin-hero-name .letter", { yPercent: 130, opacity: 0 });
      gsap.set(".cin-hero-sub", { opacity: 0, y: 30 });
      gsap.set(".cin-hero-eyebrow", { opacity: 0, y: 20 });
      gsap.set(".cin-hero-ctas", { opacity: 0, y: 24 });
      const revealTl = gsap
        .timeline({ paused: true })
        .to(".cin-hero-eyebrow", {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        })
        .to(
          ".cin-hero-name .letter",
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.85,
            ease: "power3.out",
          },
          "-=0.25"
        )
        .to(
          ".cin-hero-sub",
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        )
        .to(
          ".cin-hero-ctas",
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.35"
        );
      ScrollTrigger.create({
        trigger: ".cin-hero",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (self.progress >= 0.78) revealTl.play();
          else revealTl.reverse();
        },
      });
      // SCROLL DOWN — same dolly-past move as the narrative words, but
      // auto-looping while the visitor rests at the top. Starts on unlock.
      if (reduceMotion) {
        gsap.set('[data-word="scrolldown"]', { opacity: 0.85, scale: 1 });
      } else {
        scrollWordTl = gsap
          .timeline({ paused: true, repeat: -1, repeatDelay: 0.5 })
          .fromTo(
            '[data-word="scrolldown"]',
            { scale: 0.45, opacity: 0, filter: "blur(6px)" },
            { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.4, ease: "power2.out" }
          )
          .to(
            '[data-word="scrolldown"]',
            { scale: 3.2, opacity: 0, filter: "blur(14px)", duration: 1.6, ease: "power2.in" },
            "+=0.35"
          );
      }
      ScrollTrigger.create({
        trigger: ".cin-hero",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (self.progress > 0.02) {
            // The movie has begun — the invitation gets out of the way.
            scrollWordTl?.pause();
            gsap.set('[data-word="scrolldown"]', { opacity: 0 });
          } else if (scrollWordStarted && scrollWordTl && scrollWordTl.paused()) {
            scrollWordTl.restart();
          } else if (reduceMotion) {
            gsap.set('[data-word="scrolldown"]', { opacity: 0.85 });
          }
        },
      });

      // --- PILLARS: reveal one at a time over the builder clip ---
      ScrollTrigger.create({
        trigger: ".cin-pillars",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const idx = Math.min(PILLARS.length - 1, Math.floor(self.progress * PILLARS.length));
          setActivePillar(idx);
        },
      });

      // --- ARGUMENT: lines rise in ---
      gsap.from(".cin-argue-line", {
        opacity: 0,
        y: 50,
        stagger: 0.16,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cin-argue", start: "top 70%", once: true },
      });

      // --- THINKING: cards rise in ---
      gsap.from(".cin-card", {
        opacity: 0,
        y: 70,
        stagger: 0.14,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cin-work-grid", start: "top 82%", once: true },
      });
      gsap.from(".cin-work-heading", {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cin-work", start: "top 70%", once: true },
      });

      // --- RECENT WORK: count up on entry ---
      const statEls = gsap.utils.toArray<HTMLElement>(".cin-stat-number [data-count]");
      statEls.forEach((el) => {
        const target = Number(el.dataset.count);
        const fmt = el.dataset.fmt;
        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent =
              fmt === "locale"
                ? Math.round(counter.v).toLocaleString("en-US")
                : String(Math.round(counter.v));
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
      gsap.from(".cin-stat", {
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cin-stats", start: "top 75%", once: true },
      });

      // --- FINALE: kinetic marquee ---
      gsap.to(".cin-marquee", {
        xPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: ".cin-finale",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      gsap.from(".cin-finale-inner", {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cin-finale", start: "top 65%", once: true },
      });
    }, root);

    const onResize = () => draw();
    window.addEventListener("resize", onResize);

    return () => {
      destroyed = true;
      window.removeEventListener("resize", onResize);
      mm.revert();
      lenis?.destroy();
    };
  }, []);

  return (
    <div className="cinema" ref={rootRef}>
      <div className="cin-grain" aria-hidden="true" />

      {/* ============ HERO — orbit scrub ============ */}
      <section className="cin-hero" aria-label="Nathan Okoye — introduction">
        <div className="cin-hero-stage">
          <canvas ref={canvasRef} className="cin-hero-canvas" aria-hidden="true" />
          <div className="cin-hero-vignette" aria-hidden="true" />
          <div className="cin-hero-word" data-word="greetings" aria-hidden="true">
            GREETINGS
          </div>
          <div className="cin-hero-word" data-word="iam" aria-hidden="true">
            I AM
          </div>
          <div className="cin-hero-word cin-hero-scrollword" data-word="scrolldown" aria-hidden="true">
            SCROLL DOWN
          </div>
          <div className="cin-hero-content">
            <span className="cin-hero-eyebrow">Strategist · Authority Architect</span>
            <HeroName />
            <p className="cin-hero-sub">
              Most organizations that stall aren&apos;t broken.{" "}
              <strong>They&apos;re aimed wrong.</strong>
              <br />
              I write about why, and I run the diagnostic that finds where.
            </p>
            <div className="cin-btn-row cin-hero-ctas">
              <Link href="/writing" className="cin-btn cin-btn-solid">
                Read the writing
              </Link>
              <a href="#" data-arivio-widget="open" className="cin-btn cin-btn-ghost">
                Work with me
              </a>
            </div>
          </div>
          <div className={`cin-hero-loader${loaded ? " is-done" : ""}`} aria-hidden="true">
            <span className="cin-loader-mark" />
          </div>
        </div>
      </section>

      {/* ============ WHAT I DO — over The Builder ============ */}
      <section className="cin-pillars" aria-label="What I do">
        <div className="cin-pillars-stage">
          <video
            className="cin-video-bg"
            src="/video/builder.mp4"
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-hidden="true"
          />
          <div className="cin-video-shade" aria-hidden="true" />
          <div className="cin-pillars-inner">
            <span className="cin-kicker">What I do</span>
            {PILLARS.map((p, i) => (
              <article className={`cin-pillar${activePillar === i ? " is-active" : ""}`} key={p.index}>
                <span className="cin-pillar-index">{p.index}</span>
                <h2 className="cin-pillar-title">{p.title}</h2>
                <p className="cin-pillar-desc">{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHAT I'M KNOWN FOR ARGUING ============ */}
      <section className="cin-argue" aria-label="What I'm known for arguing">
        <div className="cin-argue-inner">
          <span className="cin-kicker cin-argue-line">What I&apos;m known for arguing</span>
          <h2 className="cin-argue-heading cin-argue-line">
            Most strategy work never leaves <em>the boardroom.</em>
          </h2>
          <p className="cin-argue-copy cin-argue-line">
            The people in the room where positioning gets decided are the ones who can&apos;t see
            the problem, because they&apos;re inside it. That&apos;s the through-line of everything
            I write.
          </p>
          <p className="cin-argue-copy cin-argue-line">
            If you&apos;ve hired a consultant who spent two days with your leadership team, produced
            a slide deck everyone agreed with, and left, and nothing has changed since, the workshop
            wasn&apos;t your problem. The room was.
          </p>
        </div>
      </section>

      {/* ============ RECENT THINKING — over The Closer ============ */}
      <section className="cin-work" aria-label="Recent thinking">
        <video
          className="cin-video-bg"
          src="/video/closer.mp4"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden="true"
        />
        <div className="cin-video-shade" aria-hidden="true" />
        <div className="cin-work-inner">
          <h2 className="cin-work-heading">
            Recent <em>Thinking</em>
          </h2>
          <div className="cin-work-grid">
            {recentNotes.map((note) => (
              <Link href={`/writing/${note.slug}`} className="cin-card" key={note.slug}>
                <span className="cin-card-tag">{formatNoteDate(note.date)}</span>
                <p className="cin-card-title">{note.title}</p>
                <p className="cin-card-pitch">{note.description}</p>
                <span className="cin-card-cta">Read the field note</span>
              </Link>
            ))}
          </div>
          <div className="cin-work-more">
            <Link href="/writing" className="cin-btn cin-btn-ghost">
              Read all Field Notes
            </Link>
          </div>
        </div>
      </section>

      {/* ============ RECENT WORK ============ */}
      <section className="cin-stats" aria-label="Recent work">
        <div className="cin-stats-head">
          <span className="cin-kicker">Recent work</span>
        </div>
        <div className="cin-stats-grid cin-stats-grid--three">
          {STATS.map((s) => (
            <div className="cin-stat" key={s.label}>
              <div className="cin-stat-rule" aria-hidden="true" />
              <span className="cin-stat-number">
                {s.prefix}
                <span
                  data-count={s.value}
                  data-fmt={s.value >= 1000 ? "locale" : "plain"}
                >
                  0
                </span>
                {s.suffix && <span className="unit">{s.suffix}</span>}
              </span>
              <span className="cin-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="cin-stats-more">
          <a href="https://ocidm.io" rel="noopener" className="cin-card-cta">
            See the case narratives at OCIDM
          </a>
        </div>
      </section>

      {/* ============ FINALE ============ */}
      <section className="cin-finale" aria-label="Work with Nathan">
        <div className="cin-marquee" aria-hidden="true">
          AIMED WRONG · NOT BROKEN · AIMED WRONG · NOT BROKEN · AIMED WRONG · NOT BROKEN ·
        </div>
        <div className="cin-finale-inner">
          <h2 className="cin-finale-heading">
            Doing everything right and <em>still not compounding?</em>
          </h2>
          <p className="cin-finale-copy">
            The diagnostic and the engagement live at OCIDM. The scoping call is thirty minutes and
            it costs nothing.
          </p>
          <div className="cin-btn-row">
            <a href="#" data-arivio-widget="open" className="cin-btn cin-btn-solid">
              Work with me
            </a>
            <Link href="/writing" className="cin-btn cin-btn-ghost">
              Read the writing
            </Link>
          </div>
          <div className="cin-finale-socials">
            <a href="mailto:nathan@ocidm.com">nathan@ocidm.com</a>
            <a href="https://ocidm.io" rel="noopener">OCIDM.IO</a>
            <Link href="/about">About</Link>
            <Link href="/writing">Field Notes</Link>
            <Link href="/speaking">Speaking</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
