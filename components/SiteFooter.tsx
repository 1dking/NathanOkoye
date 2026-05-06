import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">Nathan Okoye</p>
            <p className="footer-tagline">
              Brand strategist for established consultants whose work is stronger than their pipeline. Built from 15
              years of hard-won experience.
            </p>
          </div>
          <div>
            <p className="footer-heading">Site</p>
            <ul className="footer-list">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/core-framework">CORE Framework</Link>
              </li>
              <li>
                <Link href="/work-with-nathan">Work With Nathan</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="footer-heading">Case Studies</p>
            <ul className="footer-list">
              <li>
                <Link href="/case-study-advisor">Senior Advisor</Link>
              </li>
              <li>
                <Link href="/case-study-institution">Civic Institution</Link>
              </li>
              <li>
                <Link href="/case-study-publisher">Subject-Matter Expert</Link>
              </li>
              <li>
                <Link href="/case-study-arts">Performing Arts</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="footer-heading">Contact</p>
            <ul className="footer-list">
              <li>
                <a href="mailto:nathan@ocidm.com">nathan@ocidm.com</a>
              </li>
              <li>
                <a href="https://ocidm.com" rel="noopener">
                  OCIDM
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {year} Nathan Okoye. All rights reserved.</span>
          <span>Toronto, Canada</span>
        </div>
      </div>
    </footer>
  );
}
