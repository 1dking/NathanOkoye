"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/writing", label: "Writing" },
  { href: "/speaking", label: "Speaking" },
  { href: "/contact", label: "Work with me" },
];

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";
  const isAssessment = pathname === "/assessment";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Sticky header scroll-state. On the cinematic home the header stays
  // hidden for the entire hero intro and appears at the second section
  // (when the hero pin ends).
  useEffect(() => {
    function onScroll() {
      let threshold: number;
      if (isHome) {
        const hero = document.querySelector<HTMLElement>(".cin-hero");
        threshold = hero
          ? hero.offsetHeight - window.innerHeight
          : Math.max(window.innerHeight * 0.6, 320);
      } else {
        threshold = 8;
      }
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

  // Close the mobile menu on route change.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isCurrent = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`} id="siteHeader">
      <div className="container">
        <nav className="nav" aria-label="Primary">
          <Link href="/" className="nav-brand nav-brand--logo" aria-label="Nathan Okoye — home">
            <Image
              src="/images/logo.png"
              alt="Nathan Okoye"
              width={320}
              height={400}
              priority
              className="nav-brand-logo"
            />
          </Link>

          <ul className={`nav-links${isOpen ? " is-open" : ""}`}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  className="nav-link"
                  href={link.href}
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <a href="#" data-arivio-widget="open" className="btn btn-primary btn-sm hide-sm">
              Work with me
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
