import { cookies } from "next/headers";
import CinematicHome from "@/components/cinematic/CinematicHome";

type Tier = "low" | "medium" | "high";

function readTier(): Tier {
  const v = cookies().get("nate_tier")?.value;
  return v === "medium" || v === "high" ? v : "low";
}

export default function HomePage() {
  const tier = readTier();

  const heroCtaLabel =
    tier === "high" ? "Book The CORE Discovery Session →" : "Work with Nathan →";

  return <CinematicHome heroCtaLabel={heroCtaLabel} />;
}
