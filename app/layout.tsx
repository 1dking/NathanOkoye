import type { Metadata } from "next";
import Script from "next/script";
import { Anton, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./cinematic.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Tracker from "@/components/Tracker";
import CinematicFX from "@/components/cinematic/CinematicFX";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nathan Okoye | Brand Strategist for Consultants",
    template: "%s | Nathan Okoye",
  },
  description:
    "Nathan Okoye helps established consultants close the gap between the reputation they've built and the brand that represents them. The CORE framework. Real results. 15 years of experience.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/images/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${anton.variable} ${spaceGrotesk.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <CinematicFX />
        <Tracker />
        <Script src="https://arivio.io/widget.js" data-username="nate" strategy="afterInteractive" />
      </body>
    </html>
  );
}
