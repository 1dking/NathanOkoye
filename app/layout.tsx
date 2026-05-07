import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Tracker from "@/components/Tracker";

export const metadata: Metadata = {
  title: {
    default: "Nathan Okoye | Brand Strategist for Consultants",
    template: "%s | Nathan Okoye",
  },
  description:
    "Nathan Okoye helps established consultants close the gap between the reputation they've built and the brand that represents them. The CORE framework. Real results. 15 years of experience.",
  icons: {
    icon: "/images/nateceo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <Tracker />
        <Script src="https://arivio.io/widget.js" data-username="nate" strategy="afterInteractive" />
      </body>
    </html>
  );
}
