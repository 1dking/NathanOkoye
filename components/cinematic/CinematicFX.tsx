"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide cinematic treatment for the inner pages: dark theme classes,
 * film grain, smooth scroll, and scroll reveals. The homepage runs its own
 * scroll experience (CinematicHome), so it is skipped here — it only takes
 * the grain overlay from this component.
 */
const REVEAL_SELECTOR = [
  ".section .section-header",
  ".section .prose",
  ".section-sm .prose",
  ".case-card",
  ".core-letter",
  ".image-band .img-frame",
  ".img-frame--wide",
  ".cta-banner .container",
  ".split > *",
  ".image-duo > *",
  ".case-meta-row",
].join(", ");

function isCinemaPath(pathname: string) {
  return !pathname.startsWith("/admin") && pathname !== "/assessment";
}

export default function CinematicFX() {
  const pathname = usePathname() || "/";
  const cinema = isCinemaPath(pathname);
  const isHome = pathname === "/";

  useEffect(() => {
    if (!cinema) return;
    const body = document.body;
    body.classList.add("is-cinema", "has-dark-hero");
    return () => {
      // Home re-adds these via SiteHeader/CinematicHome; safe to drop here.
      body.classList.remove("is-cinema", "has-dark-hero");
    };
  }, [cinema, pathname]);

  useEffect(() => {
    if (!cinema || isHome) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("cin-fx");

    // Reveal-on-scroll
    const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    targets.forEach((el) => el.classList.add("cin-reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("cin-inview");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    targets.forEach((el) => {
      // Anything already in view on load shows immediately.
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) el.classList.add("cin-inview");
      else io.observe(el);
    });

    // Smooth scroll
    let lenis: Lenis | null = null;
    let raf = 0;
    if (!reduceMotion) {
      lenis = new Lenis({ lerp: 0.09 });
      const loop = (time: number) => {
        lenis!.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      document.body.classList.remove("cin-fx");
      io.disconnect();
      targets.forEach((el) => el.classList.remove("cin-reveal", "cin-inview"));
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [cinema, isHome, pathname]);

  if (!cinema) return null;
  // Home renders its own grain inside the experience.
  return isHome ? null : <div className="cin-grain" aria-hidden="true" />;
}
