"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CASE_STUDIES = [
  { href: "/case-study-origin", label: "The Origin Story" },
  { href: "/case-study-advisor", label: "Senior Advisor" },
  { href: "/case-study-institution", label: "Civic Institution" },
  { href: "/case-study-publisher", label: "Subject-Matter Expert" },
  { href: "/case-study-arts", label: "Performing Arts" },
];

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";
  const isAssessment = pathname === "/assessment";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [caseDropdownOpen, setCaseDropdownOpen] = useState(false);
  const caseRef = useRef<HTMLLIElement | null>(null);

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

  // Close the mobile menu and case-studies dropdown on route change.
  useEffect(() => {
    setIsOpen(false);
    setCaseDropdownOpen(false);
  }, [pathname]);

  // Close the case-studies dropdown on outside click / Escape.
  useEffect(() => {
    if (!caseDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (caseRef.current && !caseRef.current.contains(e.target as Node)) {
        setCaseDropdownOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setCaseDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [caseDropdownOpen]);

  const isCurrent = (href: string) => pathname === href;
  const isCaseStudy = CASE_STUDIES.some((c) => c.href === pathname);

  return (
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`} id="siteHeader">
      <div className="container">
        <nav className="nav" aria-label="Primary">
          <Link href="/" className="nav-brand nav-brand--logo" aria-label="Nathan Okoye — home">
            <Image
              src="/images/logo.svg"
              alt="Nathan Okoye"
              width={200}
              height={40}
              priority
              className="nav-brand-logo"
            />
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
                href="/playbook"
                aria-current={isCurrent("/playbook") ? "page" : undefined}
              >
                Playbook
              </Link>
            </li>
            <li className="nav-dropdown" ref={caseRef}>
              <button
                type="button"
                className="nav-link nav-dropdown-trigger"
                aria-haspopup="true"
                aria-expanded={caseDropdownOpen}
                aria-current={isCaseStudy ? "page" : undefined}
                onClick={() => setCaseDropdownOpen((o) => !o)}
              >
                Case Studies
                <span className="nav-dropdown-caret" aria-hidden="true">▾</span>
              </button>
              <ul className={`nav-dropdown-menu${caseDropdownOpen ? " is-open" : ""}`} role="menu">
                {CASE_STUDIES.map((c) => (
                  <li key={c.href} role="none">
                    <Link
                      className="nav-dropdown-item"
                      role="menuitem"
                      href={c.href}
                      aria-current={isCurrent(c.href) ? "page" : undefined}
                      onClick={() => setCaseDropdownOpen(false)}
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
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
            <a href="#" data-arivio-widget="open" className="btn btn-primary btn-sm hide-sm">
              Book a Discovery Session
            </a>
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
