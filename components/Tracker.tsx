"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/tracker";
import { getOrCreateVisitorToken } from "@/lib/visitor";

const SECTION_IDS = [
  "hero",
  "proof-bar",
  "case-studies",
  "core-framework",
  "about",
  "cta",
  "work-with-nathan",
  "assessment-form",
];

const VISIT_GAP_MS = 60 * 60 * 1000;
const TIME_ON_PAGE_INTERVAL_MS = 30 * 1000;

export default function Tracker() {
  const pathname = usePathname();

  // Per-pathname fired-once flags. Reset whenever pathname changes so
  // scroll/section thresholds re-arm on each navigation.
  const firedRef = useRef({
    scroll50: false,
    scroll90: false,
    sections: new Set<string>(),
  });

  useEffect(() => {
    firedRef.current = {
      scroll50: false,
      scroll90: false,
      sections: new Set(),
    };
  }, [pathname]);

  // Mirror the visitor token to a cookie so middleware can read it
  // server-side without an extra DB call.
  useEffect(() => {
    try {
      const token = getOrCreateVisitorToken();
      const isProd = process.env.NODE_ENV === "production";
      document.cookie =
        `nate_visitor=${encodeURIComponent(token)}` +
        `; path=/; max-age=31536000; samesite=lax` +
        (isProd ? "; secure" : "");
    } catch {
      // cookie write blocked — middleware will default to 'low' tier
    }
  }, []);

  // page_view + case_study_open on every (re)navigation.
  useEffect(() => {
    if (!pathname) return;
    track("page_view", { page: pathname });
    if (pathname.startsWith("/case-study-")) {
      const slug = pathname.replace("/case-study-", "");
      track("case_study_open", { metadata: { slug } });
    }
  }, [pathname]);

  // return_visit detection — fires once per session start when count > 1.
  useEffect(() => {
    try {
      const now = Date.now();
      const lastRaw = window.localStorage.getItem("nate_last_visit_at");
      const countRaw = window.localStorage.getItem("nate_visit_count");
      const lastAt = lastRaw ? parseInt(lastRaw, 10) : 0;
      const count = countRaw ? parseInt(countRaw, 10) : 0;
      const isNewSession = now - lastAt > VISIT_GAP_MS;
      if (isNewSession) {
        const nextCount = count + 1;
        window.localStorage.setItem("nate_visit_count", String(nextCount));
        if (nextCount > 1) {
          track("return_visit", { value: nextCount });
        }
      }
      window.localStorage.setItem("nate_last_visit_at", String(now));
    } catch {
      // localStorage blocked — skip
    }
  }, []);

  // scroll_50 / scroll_90 (per pathname).
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight;
      if (total <= window.innerHeight) return;
      const pct = ((window.scrollY + window.innerHeight) / total) * 100;
      if (!firedRef.current.scroll50 && pct >= 50) {
        firedRef.current.scroll50 = true;
        track("scroll_50", { value: 50 });
      }
      if (!firedRef.current.scroll90 && pct >= 90) {
        firedRef.current.scroll90 = true;
        track("scroll_90", { value: 90 });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // time_on_page — every 30s while document is visible.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      track("time_on_page", { value: TIME_ON_PAGE_INTERVAL_MS / 1000 });
    }, TIME_ON_PAGE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [pathname]);

  // section_view via IntersectionObserver.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).id;
          if (!id || firedRef.current.sections.has(id)) continue;
          firedRef.current.sections.add(id);
          track("section_view", { section: id });
        }
      },
      { threshold: 0.25 },
    );
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [pathname]);

  // external_link_click — captures mailto/tel + cross-origin http(s) clicks.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const a = target.closest("a") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (!href) return;
      const isMailto = href.startsWith("mailto:");
      const isTel = href.startsWith("tel:");
      const isExternalHttp =
        /^https?:\/\//i.test(href) && a.host !== window.location.host;
      if (!isMailto && !isTel && !isExternalHttp) return;
      track("external_link_click", {
        metadata: {
          href,
          text: (a.textContent ?? "").trim().slice(0, 120),
        },
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
