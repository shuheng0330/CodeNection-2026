import type { DecisionDemo } from "@/lib/seed/decisionDemo";

export type PreviewChoice = "accept" | "decline";

export function previewOutcome(demo: DecisionDemo, choice: PreviewChoice) {
  const week = demo.price.landing;
  const hours = demo.candidate.hours;
  return {
    before: week ? Math.round(week.ratioBefore * 100) : null,
    selected: week ? Math.round((choice === "accept" ? week.ratioAfter : week.ratioBefore) * 100) : null,
    week: week?.label ?? null,
    hoursText: `${hours} ${hours === 1 ? "hour" : "hours"} ${choice === "accept" ? "added" : "kept free"}`,
  };
}
