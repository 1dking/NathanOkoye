/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Old positioning (brand strategist / CORE framework era) — fully
      // replaced by the Authority Architect site. The engagement and the
      // case narratives live at ocidm.io.
      { source: "/work-with-nathan", destination: "/contact", permanent: true },
      { source: "/core-framework", destination: "/writing", permanent: true },
      { source: "/playbook", destination: "/writing", permanent: true },
      { source: "/case-study-origin", destination: "/about", permanent: true },
      { source: "/case-study-advisor", destination: "https://ocidm.io", permanent: true },
      { source: "/case-study-institution", destination: "https://ocidm.io", permanent: true },
      { source: "/case-study-publisher", destination: "https://ocidm.io", permanent: true },
      { source: "/case-study-arts", destination: "https://ocidm.io", permanent: true },
    ];
  },
};

export default nextConfig;
