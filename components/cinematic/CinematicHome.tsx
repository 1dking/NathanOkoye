"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/* Hero orbit frame sequence (extracted from the Seedance orbit clip). */
const FRAME_COUNT = 160;
const framePath = (i: number) =>
  `/sequence/hero/frame_${String(i + 1).padStart(4, "0")}.webp`;

type Props = {
  heroCtaLabel: string;
};

const STATS = [
  { prefix: "$", value: 75, suffix: "M+", format: (v: number) => String(Math.round(v)), label: "Advisory engagement acquired through positioning alone" },
  { prefix: "", value: 15000, suffix: "", format: (v: number) => Math.round(v).toLocaleString("en-US"), label: "People showed up for a brand built from nothing" },
  { prefix: "$", value: 39378, suffix: "", format: (v: number) => Math.round(v).toLocaleString("en-US"), label: "Revenue unlocked by repositioning one expert product" },
  { prefix: "", value: 15, suffix: "yrs", format: (v: number) => String(Math.round(v)), label: "Of practice forged into the CORE framework" },
];

const PILLARS = [
  {
    index: "01",
    title: "The CORE Discovery Session",
    desc: "The entry point for every client, without exception. A paid, standalone session that identifies exactly where your brand gap is and what it is costing you.",
  },
  {
    index: "02",
    title: "The CORE Brand Build",
    desc: "A custom-scoped engagement built from what the Discovery Session reveals — positioning framework, live platform, website. Built from the inside out, never from templates.",
  },
  {
    index: "03",
    title: "The Ongoing Partnership",
    desc: "For clients who want the momentum to continue: monthly strategic support and execution as the brand grows. Maximum three clients at a time.",
  },
];

const WORK = [
  {
    href: "/case-study-advisor",
    tag: "Senior Advisor",
    metric: "$75M+",
    pitch: "Decades of credibility, invisible brand. Six months of repositioning — a $75M+ engagement found her.",
  },
  {
    href: "/case-study-institution",
    tag: "Civic Institution",
    metric: "15,000",
    pitch: "No audience, no history, no brand equity. We built all three — fifteen thousand people showed up.",
  },
  {
    href: "/case-study-arts",
    tag: "Performing Arts",
    metric: "SOLD OUT",
    pitch: "The first sold-out event in 15 years, unlocked by two months of repositioned content.",
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

export default function CinematicHome({ heroCtaLabel }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [activePillar, setActivePillar] = useState(0);

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

      // --- STATS: count up on entry ---
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

      // --- WORK: cards rise in ---
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
            <span className="cin-hero-eyebrow">Available for select engagements</span>
            <HeroName />
            <p className="cin-hero-sub">
              Brand strategist for consultants and advisors —{" "}
              <strong>I close the gap between the expertise you&apos;ve built and the brand that represents it.</strong>
            </p>
          </div>
          <div className={`cin-hero-loader${loaded ? " is-done" : ""}`} aria-hidden="true">
            <span>NO&hellip;</span>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="cin-stats" aria-label="Results">
        <div className="cin-stats-grid">
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
      </section>

      {/* ============ PILLARS — over The Builder ============ */}
      <section className="cin-pillars" aria-label="How we work together">
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
            <span className="cin-kicker">Three ways in — one entry point</span>
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

      {/* ============ WORK — over The Closer ============ */}
      <section className="cin-work" aria-label="Selected work">
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
            Selected <em>Work</em>
          </h2>
          <div className="cin-work-grid">
            {WORK.map((w) => (
              <Link href={w.href} className="cin-card" key={w.href}>
                <span className="cin-card-tag">{w.tag}</span>
                <p className="cin-card-metric">{w.metric}</p>
                <p className="cin-card-pitch">{w.pitch}</p>
                <span className="cin-card-cta">Read the case study</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINALE ============ */}
      <section className="cin-finale" aria-label="Work with Nathan">
        <div className="cin-marquee" aria-hidden="true">
          CLOSE THE GAP — CLOSE THE GAP — CLOSE THE GAP — CLOSE THE GAP — CLOSE THE GAP —
        </div>
        <div className="cin-finale-inner">
          <h2 className="cin-finale-heading">
            Ready to <em>close the gap?</em>
          </h2>
          <p className="cin-finale-copy">
            The first step is a conversation, not a pitch. If you are a consultant or advisor whose
            brand does not yet reflect the work you do, this is where that changes.
          </p>
          <div className="cin-btn-row">
            <a href="#" data-arivio-widget="open" className="cin-btn cin-btn-solid">
              {heroCtaLabel}
            </a>
            <Link href="/case-study-advisor" className="cin-btn cin-btn-ghost">
              Read the case studies
            </Link>
          </div>
          <div className="cin-finale-socials">
            <a href="mailto:nathan@ocidm.com">nathan@ocidm.com</a>
            <a href="https://ocidm.com" rel="noopener">OCIDM</a>
            <Link href="/about">About</Link>
            <Link href="/core-framework">CORE Framework</Link>
            <Link href="/work-with-nathan">Work With Nathan</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
