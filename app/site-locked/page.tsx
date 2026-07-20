import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private",
  robots: { index: false, follow: false },
};

export default function SiteLockedPage({
  searchParams,
}: {
  searchParams: { redirect?: string; error?: string };
}) {
  const redirect = searchParams.redirect ?? "/";
  const hasError = searchParams.error === "1";

  return (
    <div className="lock-screen">
      <div className="lock-card">
        <span className="lock-kicker">Nathan Okoye</span>
        <h1 className="lock-title">Private</h1>
        <p className="lock-copy">This site isn&apos;t public yet. Enter the password to continue.</p>
        <form className="lock-form" method="post" action="/api/site-unlock">
          <input type="hidden" name="redirect" value={redirect} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            required
            className="lock-input"
          />
          <button type="submit" className="lock-submit">
            Enter →
          </button>
        </form>
        {hasError && <p className="lock-error">That password isn&apos;t right — try again.</p>}
      </div>
    </div>
  );
}
