import type { Metadata } from "next";
import AssessmentClient from "./AssessmentClient";

export const metadata: Metadata = {
  title: "The Strategic Authenticity Assessment",
  description:
    "A 10-statement self-assessment that reveals where your brand is actually working and where the gap between your expertise and your public presence is costing you. Built around the CORE framework.",
};

export default function AssessmentPage() {
  return <AssessmentClient />;
}
