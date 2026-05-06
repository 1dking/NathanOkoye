export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        background: "#0E0C0A",
        color: "#F7F4ED",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
          fontWeight: 400,
          letterSpacing: "-0.02em",
          margin: 0,
          textAlign: "center",
        }}
      >
        Nathan Okoye — Coming Soon
      </h1>
    </main>
  );
}
