// instructionsData.ts (your separate source)
import type { Instruction } from "./instructions";

export const INSTRUCTIONS: Instruction[] = [
  {
    title: "How to Use This Program",
    steps: [
      "Don't overthink it, just follow the program.",
      "Progress load or reps weekly while keeping form strict.",
    ],
  },
  {
    title: "Nutrition Targets",
    html: `
      <ul class="bullet">
        <li>Protein: 2–3 g/kg lean bodyweight</li>
        <li>Calories: Start at calculated TDEE; adjust based on goals</li>
        <li>Hydration: 30–40 ml/kg daily; more in hot climates</li>
      </ul>
    `,
    note: "Consult a dietitian if you have medical conditions.",
  },
];
