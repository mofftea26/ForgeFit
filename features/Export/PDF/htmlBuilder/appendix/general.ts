// ./appendix/general.ts
import { safe } from "../helpers";

export function renderGeneralInfoAppendix(
  iconDataUrl: string,
  title = "General Training Information"
): string {
  return `
<section class="appendix page">
  <header class="appendix-header">
    <h1 class="appendix-title">${safe(title)}</h1>
  </header>

  <!-- Warm-Up -->
  <article class="appendix-card elevated card avoid-break">
    <h2>Warm-Up</h2>
    <ul class="bullet">
      <li><strong>10 minutes</strong> of light cardio to raise core temperature.</li>
      <li>Dynamic mobility: <em>move the working muscles’ joints</em> through their ranges to activate them.</li>
      <li>Perform <strong>1–2 warm-up sets</strong> of the first movement before working sets.</li>
    </ul>
  </article>

  <!-- Tempo & Contractions -->
  <article class="appendix-card elevated card avoid-break">
    <h2>Tempo & Muscle Actions</h2>
    <p class="small muted">Tempo is usually written as <span class="code">Eccentric – Pause (bottom) – Concentric – Pause (top)</span> (e.g., <span class="code">3–1–1–0</span>).</p>
    <ul class="bullet">
      <li><strong>Eccentric</strong>: the lowering/lengthening phase (e.g., lowering the bar in a bench press).</li>
      <li><strong>Bottom pause</strong>: optional hold at the stretched position to control rebound and improve stability.</li>
      <li><strong>Concentric</strong>: the lifting/shortening phase (e.g., pressing the bar up).</li>
      <li><strong>Top pause</strong>: optional lockout hold to reinforce control and positioning.</li>
    </ul>
    <div class="divider"></div>
    <ul class="bullet">
      <li><strong>Contraction types</strong>:
        <ul class="bullet">
          <li><strong>Eccentric</strong> – muscle lengthens under load.</li>
          <li><strong>Concentric</strong> – muscle shortens to produce movement.</li>
          <li><strong>Isometric</strong> – muscle holds tension without changing length (pauses/holds).</li>
        </ul>
      </li>
    </ul>
  </article>

  <!-- Rest Intervals -->
  <article class="appendix-card elevated card avoid-break">
    <h2>Rest Between Sets</h2>
    <ul class="bullet">
      <li>Isolation/accessory work: ~<strong>60–90s</strong>.</li>
      <li>Compound lifts (moderate/heavy): ~<strong>90–180s</strong>.</li>
      <li>Metabolic circuits/finishers: ~<strong>30–60s</strong> as tolerated.</li>
    </ul>
    <p class="small muted"><strong>Rule:</strong> always follow the rests indicated in the program. If recovery feels insufficient, add ~<strong>30 seconds</strong> more.</p>
  </article>

  <!-- Recovery Basics -->
  <article class="appendix-card elevated card avoid-break">
    <h2>Recovery Basics</h2>
    <ul class="bullet">
      <li><strong>Sleep</strong>: target 7–9 hours nightly.</li>
      <li><strong>Steps</strong>: keep daily movement consistent (e.g., 6–10k steps/day).</li>
      <li><strong>Deload</strong>: schedule a lighter week every 6–10 weeks (or as needed).</li>
    </ul>
    <div class="divider"></div>
    <ul class="bullet">
      <li><strong>Recovery triad</strong>: <em>Sleep – Diet – Good Workout</em>. Nail all three for steady progress.</li>
    </ul>
  </article>

  <!-- Safety -->
  <article class="appendix-card elevated card avoid-break">
    <h2>Safety</h2>
    <ul class="bullet">
      <li>Prioritize <strong>form</strong>, full and appropriate <strong>range of motion</strong>, and prescribed <strong>tempo</strong> — <em>skill &gt; ego lifting</em>.</li>
      <li>Use safeties/spotters on heavy barbell movements and set equipment correctly.</li>
    </ul>
  </article>

  <!-- Programming Notes -->
  <article class="appendix-card elevated card avoid-break">
    <h2>Programming Notes</h2>
    <ul class="bullet">
      <li>A <strong>combination of different rep ranges</strong> fatigues different muscle fiber types, supporting better hypertrophy and performance gains.</li>
      <li>If there are <strong>trainer’s notes</strong>, read them carefully and make sure to act on them.</li>
      <li>For any information or questions, don’t hesitate to contact the <strong>designer of the program</strong>.</li>
    </ul>
  </article>
</section>
`;
}
