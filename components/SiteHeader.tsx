"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const CASE_STUDY_PATHS = [
  "/case-study-advisor",
  "/case-study-arts",
  "/case-study-institution",
  "/case-study-publisher",
];

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";
  const isAssessment = pathname === "/assessment";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Sticky header scroll-state, with a higher threshold on the dramatic
  // dark hero so the header stays transparent over the hero region.
  useEffect(() => {
    function onScroll() {
      const threshold = isHome ? Math.max(window.innerHeight * 0.6, 320) : 8;
      setIsScrolled(window.scrollY > threshold);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Body-level class for pages that paint a dark hero / dark page treatment.
  // CSS in globals.css keys off these classes for header recolouring.
  useEffect(() => {
    const body = document.body;
    if (isHome) body.classList.add("has-dark-hero");
    if (isAssessment) body.classList.add("is-assessment");
    return () => {
      body.classList.remove("has-dark-hero");
      body.classList.remove("is-assessment");
    };
  }, [isHome, isAssessment]);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isCurrent = (href: string) => pathname === href;
  const isCaseStudy = CASE_STUDY_PATHS.some((p) => pathname === p);

  return (
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`} id="siteHeader">
      <div className="container">
        <nav className="nav" aria-label="Primary">
          <Link href="/" className="nav-brand">
            Nathan Okoye
            <small>Brand Strategist</small>
          </Link>
          <ul className={`nav-links${isOpen ? " is-open" : ""}`}>
            <li>
              <Link className="nav-link" href="/about" aria-current={isCurrent("/about") ? "page" : undefined}>
                About
              </Link>
            </li>
            <li>
              <Link
                className="nav-link"
                href="/core-framework"
                aria-current={isCurrent("/core-framework") ? "page" : undefined}
              >
                CORE Framework
              </Link>
            </li>
            <li>
              <Link
                className="nav-link"
                href="/case-study-advisor"
                aria-current={isCaseStudy ? "page" : undefined}
              >
                Case Studies
              </Link>
            </li>
            <li>
              <Link
                className="nav-link"
                href="/work-with-nathan"
                aria-current={isCurrent("/work-with-nathan") ? "page" : undefined}
              >
                Work With Nathan
              </Link>
            </li>
          </ul>
          <div className="nav-actions">
            <Link href="/work-with-nathan" className="btn btn-primary btn-sm hide-sm">
              Book a Discovery Session
            </Link>
            <button
              type="button"
              className="nav-toggle show-sm"
              aria-label="Open menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((o) => !o)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
