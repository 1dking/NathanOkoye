import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">Nathan Okoye</p>
            <p className="footer-tagline">Strategist, Authority Architect</p>
          </div>
          <div>
            <p className="footer-heading">Site</p>
            <ul className="footer-list">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/writing">Writing</Link>
              </li>
              <li>
                <Link href="/speaking">Speaking</Link>
              </li>
              <li>
                <Link href="/contact">Work with me</Link>
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
                <a href="https://ocidm.io" rel="noopener">
                  ocidm.io
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
