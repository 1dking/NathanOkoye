"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "nate_bar_dismissed";

export default function StickyBar() {
  // Hidden by default to avoid flash before localStorage check resolves.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed =
        window.localStorage.getItem(DISMISS_KEY) === "true";
      if (!dismissed) setVisible(true);
    } catch {
      // localStorage blocked — show the bar anyway
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // best-effort
    }
  };

  return (
    <div className="sticky-bar" role="region" aria-label="Next step">
      <p>Ready to take the next step?</p>
      <a href="#" data-arivio-widget="open" className="btn sticky-bar-btn">
        Book a strategy call →
      </a>
      <button
        type="button"
        className="sticky-bar-dismiss"
        aria-label="Dismiss"
        onClick={handleDismiss}
      >
        ×
      </button>
    </div>
  );
}
