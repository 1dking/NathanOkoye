"use client";

import { useEffect, useState } from "react";

interface ActivityItem {
  id: string;
  event_type: string;
  page: string | null;
  section: string | null;
  email: string | null;
  created_at: string;
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.round(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

export default function ActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchOnce() {
      try {
        const res = await fetch("/api/admin/activity", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { items: ActivityItem[] };
        if (!cancelled) {
          setItems(data.items);
          setLoading(false);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load activity.");
          setLoading(false);
        }
      }
    }
    fetchOnce();
    const id = setInterval(fetchOnce, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (loading) return <p className="admin-muted">Loading…</p>;
  if (error) return <p className="admin-muted">{error}</p>;
  if (!items.length) return <p className="admin-muted">No activity yet.</p>;

  return (
    <ul className="admin-activity-list">
      {items.map((item) => (
        <li key={item.id} className="admin-activity-item">
          <span className="admin-activity-event">{item.event_type}</span>
          <span className="admin-activity-page">{item.page}</span>
          <span className="admin-activity-email">
            {item.email ?? "anonymous visitor"}
          </span>
          <span className="admin-activity-time">{timeAgo(item.created_at)}</span>
        </li>
      ))}
    </ul>
  );
}
