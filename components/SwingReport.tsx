export type SwingCheckpointStatus = "GREEN" | "YELLOW" | "RED" | string;

export type SwingCheckpoint = {
  label: string; // P1–P9
  phase: string;
  status: SwingCheckpointStatus;
  note: string; // main description
};

export type SwingPlanBlock = {
  title: string;
  text: string;
};

export type SwingPreviewItem = {
  label: string;                     // P1
  phase: string;                     // Setup, Backswing, etc.
  short: string;                     // Short description
  long?: string;                     // Longer explanation
  status?: SwingCheckpointStatus;    // GREEN / YELLOW / RED
  youtubeQuery?: string;            // optional custom query
};

export type SwingReportData = {
  playerName: string;
  hand: string;
  eye: string;
  handicap: number | string;
  summary: string[];           // sentences we’ll turn into a narrative
  strengths: string[];
  priorityFixes: string[];
  powerLeaks: string[];
  checkpoints: SwingCheckpoint[];
  planBlocks: SwingPlanBlock[];
  swingPreview?: SwingPreviewItem[]; // optional rich preview data
  videoUrl?: string;                 // optional swing video for the report
};

type Props = {
  report: SwingReportData;
};

// Static descriptions of what P1–P9 actually are
const P_META: Record<
  string,
  {
    label: string;
    phaseHint: string;
    description: string;
  }
> = {
  P1: {
    label: "P1 – Setup",
    phaseHint: "Address",
    description: "Address position: posture, ball position, grip and alignment before the club moves.",
  },
  P2: {
    label: "P2 – Takeaway",
    phaseHint: "Club parallel",
    description: "Club roughly parallel to the ground in the takeaway, shaft around waist height.",
  },
  P3: {
    label: "P3 – Early backswing",
    phaseHint: "Mid-backswing",
    description: "Lead arm around horizontal, club starting to load and wrist hinge developing.",
  },
  P4: {
    label: "P4 – Top of backswing",
    phaseHint: "Top",
    description: "Fully loaded position at the top before transition, with coil built and club set.",
  },
  P5: {
    label: "P5 – Early downswing",
    phaseHint: "Lead arm parallel",
    description: "Lead arm parallel on the way down; transition, shaft shallow/sharp and weight starting to move.",
  },
  P6: {
    label: "P6 – Delivery",
    phaseHint: "Club parallel",
    description: "Club back to parallel before impact, shaft leaning, body opening, hands leading.",
  },
  P7: {
    label: "P7 – Impact",
    phaseHint: "Strike",
    description: "Moment of truth – face, path, low point, and shaft lean when the club meets the ball.",
  },
  P8: {
    label: "P8 – Early release",
    phaseHint: "Post-impact",
    description: "Post-impact position where arms extend and body keeps turning toward the target.",
  },
  P9: {
    label: "P9 – Finish",
    phaseHint: "Finish",
    description: "Balanced finish position, chest at target, weight mostly into lead side.",
  },
};

function statusClasses(status?: SwingCheckpointStatus) {
  if (status === "GREEN") {
    return "bg-emerald-800/70 text-emerald-200";
  }
  if (status === "YELLOW") {
    return "bg-amber-700/70 text-amber-200";
  }
  if (status === "RED") {
    return "bg-rose-700/70 text-rose-200";
  }
  return "bg-slate-700/70 text-slate-200";
}

export function SwingReport({ report }: Props) {
  // Story-style narrative for summary
  const narrative =
    report.summary && report.summary.length > 0
      ? report.summary.join(" ")
      : "This swing report is missing a detailed summary, but the checkpoints, strengths, and practice plan below still give you a clear roadmap for improvement.";

  // Build preview items – prefer rich swingPreview if present,
  // otherwise derive from checkpoints so nothing breaks.
  const previewItems: SwingPreviewItem[] =
    report.swingPreview && report.swingPreview.length > 0
      ? report.swingPreview
      : report.checkpoints.map((cp) => ({
          label: cp.label,
          phase: cp.phase,
          short: cp.note,
          long: cp.note,
          status: cp.status,
        }));

  return (
    <div className="rounded-3xl bg-slate-900/85 shadow-2xl border border-emerald-700/40 overflow-hidden">
      {/* Top summary strip */}
      <div className="grid gap-4 md:grid-cols-[2.2fr,1fr] bg-gradient-to-r from-amber-700 via-amber-600 to-emerald-700 p-6">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-amber-50 mb-2">
            AI SWING SUMMARY
          </h2>
          <p className="text-[11px] text-amber-200/90 mb-1">
            Player: {report.playerName} · Hand: {report.hand} · Eye:{" "}
            {report.eye} · Handicap: {report.handicap || "N/A"}
          </p>
          <p className="text-xs leading-relaxed text-amber-50/95">
            {narrative}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-amber-50">
          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-amber-200">
              Swing Rating
            </p>
            <p className="text-xl font-bold leading-tight">A-</p>
            <p className="text-[11px] mt-1 opacity-80">Overall mechanics</p>
          </div>
          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-amber-200">
              Power Rating
            </p>
            <p className="text-xl font-bold leading-tight">B+</p>
            <p className="text-[11px] mt-1 opacity-80">Speed &amp; efficiency</p>
          </div>
          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-amber-200">
              Consistency
            </p>
            <p className="text-xl font-bold leading-tight">A-</p>
            <p className="text-[11px] mt-1 opacity-80">Pattern reliability</p>
          </div>
          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-amber-200">
              Readiness
            </p>
            <p className="text-xl font-bold leading-tight">Ready</p>
            <p className="text-[11px] mt-1 opacity-80">To start 14-day plan</p>
          </div>
        </div>
      </div>

      {/* Swing preview + video */}
      <section className="p-6 bg-slate-950/80 border-t border-emerald-800/40">
        <h3 className="text-xs font-semibold text-emerald-300 mb-2">
          Swing Preview — P1 to P9
        </h3>
        <p className="text-[11px] text-slate-300 mb-3">
          Quick tour of the swing checkpoints from setup to finish. The top
          line tells you what each P position is. The traffic light shows if
          it&apos;s a strength (green), watch area (yellow), or a priority leak
          (red). Each card also links out to a YouTube “swing fix” search for
          similar patterns.
        </p>

        <div className="grid gap-4 lg:grid-cols-[1.3fr,2fr]">
          {/* Video panel, if we have a video URL */}
          {report.videoUrl && (
            <div className="rounded-2xl border border-slate-700 bg-slate-900/95 p-3 flex flex-col gap-2">
              <p className="text-[11px] text-slate-200 mb-1">Swing video</p>
              <video
                src={report.videoUrl}
                controls
                className="w-full rounded-xl max-h-64 object-contain"
              />
              <p className="text-[10px] text-slate-400">
                Use this clip side-by-side with the P1–P9 notes to spot matchups
                and see how the fixes line up with your motion.
              </p>
            </div>
          )}

          {/* P1–P9 cards */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {previewItems.map((item) => {
              const meta = P_META[item.label] ?? null;
              const baseQuery =
                item.youtubeQuery ||
                `${item.phase} golf swing fix ${item.label} checkpoint`;
              const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
                `golf swing fix ${baseQuery}`
              )}`;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-700 bg-slate-900/95 p-3 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-[11px] font-semibold text-emerald-300">
                        {meta ? meta.label : item.label}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {item.phase}
                        {meta && meta.phaseHint ? ` • ${meta.phaseHint}` : ""}
                      </p>
                    </div>
                    <span
                      className={
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold " +
                        statusClasses(item.status)
                      }
                    >
                      {item.status || "INFO"}
                    </span>
                  </div>

                  {meta && (
                    <p className="text-[10px] text-slate-400 leading-snug mb-1">
                      {meta.description}
                    </p>
                  )}

                  <p className="text-[11px] font-semibold text-slate-100">
                    {item.short}
                  </p>

                  {item.long && item.long !== item.short && (
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {item.long}
                    </p>
                  )}

                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 text-[10px] text-emerald-300 hover:text-emerald-200 underline underline-offset-2"
                  >
                    View similar swing fixes on YouTube ↗
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Middle 3-column section */}
      <section className="grid gap-4 md:grid-cols-3 p-6 bg-slate-950/60 border-t border-emerald-800/40">
        <div className="rounded-2xl bg-slate-900 p-4 border border-emerald-700/40">
          <h3 className="text-xs font-semibold text-emerald-300 mb-2">
            GOOD SWING CHARACTERISTICS
          </h3>
          <ul className="text-xs space-y-1 text-slate-200">
            {report.strengths.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-slate-900 p-4 border border-amber-600/50">
          <h3 className="text-xs font-semibold text-amber-300 mb-2">
            TOP 3 PRIORITY FIXES
          </h3>
          <ol className="text-xs space-y-1 text-slate-200 list-decimal list-inside">
            {report.priorityFixes.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl bg-slate-900 p-4 border border-rose-600/50">
          <h3 className="text-xs font-semibold text-rose-300 mb-2">
            TOP POWER LEAKS
          </h3>
          <ul className="text-xs space-y-1 text-slate-200">
            {report.powerLeaks.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Checkpoint map */}
      <section className="p-6 bg-slate-950/70 border-t border-emerald-800/40">
        <h3 className="text-xs font-semibold text-emerald-300 mb-3">
          CHECKPOINT MAP (P1–P9)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-900">
                <th className="text-left px-3 py-2 border-b border-slate-700/70">
                  Label
                </th>
                <th className="text-left px-3 py-2 border-b border-slate-700/70">
                  Phase
                </th>
                <th className="text-left px-3 py-2 border-b border-slate-700/70">
                  Status
                </th>
                <th className="text-left px-3 py-2 border-b border-slate-700/70">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {report.checkpoints.map((cp, idx) => (
                <tr
                  key={cp.label + cp.phase}
                  className={
                    idx % 2 === 0 ? "bg-slate-900/70" : "bg-slate-900/40"
                  }
                >
                  <td className="px-3 py-2 border-b border-slate-800">
                    {cp.label}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-800">
                    {cp.phase}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-800">
                    <span
                      className={
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold " +
                        statusClasses(cp.status)
                      }
                    >
                      {cp.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b border-slate-800">
                    {cp.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 14-day plan */}
      <section className="p-6 bg-slate-900 border-t border-emerald-800/40">
        <h3 className="text-xs font-semibold text-emerald-300 mb-1">
          14-DAY PRACTICE PLAN — OVERVIEW
        </h3>
        <p className="text-[11px] text-slate-300 mb-3">
          Focus the next 14 days on improving transition timing and downswing
          path, while reinforcing your already strong fundamentals. This
          balanced approach will refine power delivery and consistency.
        </p>
        <div className="grid gap-3 md:grid-cols-4 text-[11px]">
          {report.planBlocks.map((block, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-700 bg-slate-950/80 p-3 flex flex-col gap-1"
            >
              <p className="font-semibold text-slate-100">{block.title}</p>
              <p className="text-slate-300">{block.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
export type SwingCheckpointStatus = "GREEN" | "YELLOW" | "RED" | string;

export type SwingCheckpoint = {
  label: string; // P1–P9
  phase: string;
  status: SwingCheckpointStatus;
  note: string; // main description
};

export type SwingPlanBlock = {
  title: string;
  text: string;
};

export type SwingPreviewItem = {
  label: string;                     // P1
  phase: string;                     // Setup, Backswing, etc.
  short: string;                     // Short description
  long?: string;                     // Longer explanation
  status?: SwingCheckpointStatus;    // GREEN / YELLOW / RED
  youtubeQuery?: string;            // optional custom query
};

export type SwingReportData = {
  playerName: string;
  hand: string;
  eye: string;
  handicap: number | string;
  summary: string[];           // sentences we’ll turn into a narrative
  strengths: string[];
  priorityFixes: string[];
  powerLeaks: string[];
  checkpoints: SwingCheckpoint[];
  planBlocks: SwingPlanBlock[];
  swingPreview?: SwingPreviewItem[]; // optional rich preview data
  videoUrl?: string;                 // optional swing video for the report
};

type Props = {
  report: SwingReportData;
};

// Static descriptions of what P1–P9 actually are
const P_META: Record<
  string,
  {
    label: string;
    phaseHint: string;
    description: string;
  }
> = {
  P1: {
    label: "P1 – Setup",
    phaseHint: "Address",
    description: "Address position: posture, ball position, grip and alignment before the club moves.",
  },
  P2: {
    label: "P2 – Takeaway",
    phaseHint: "Club parallel",
    description: "Club roughly parallel to the ground in the takeaway, shaft around waist height.",
  },
  P3: {
    label: "P3 – Early backswing",
    phaseHint: "Mid-backswing",
    description: "Lead arm around horizontal, club starting to load and wrist hinge developing.",
  },
  P4: {
    label: "P4 – Top of backswing",
    phaseHint: "Top",
    description: "Fully loaded position at the top before transition, with coil built and club set.",
  },
  P5: {
    label: "P5 – Early downswing",
    phaseHint: "Lead arm parallel",
    description: "Lead arm parallel on the way down; transition, shaft shallow/sharp and weight starting to move.",
  },
  P6: {
    label: "P6 – Delivery",
    phaseHint: "Club parallel",
    description: "Club back to parallel before impact, shaft leaning, body opening, hands leading.",
  },
  P7: {
    label: "P7 – Impact",
    phaseHint: "Strike",
    description: "Moment of truth – face, path, low point, and shaft lean when the club meets the ball.",
  },
  P8: {
    label: "P8 – Early release",
    phaseHint: "Post-impact",
    description: "Post-impact position where arms extend and body keeps turning toward the target.",
  },
  P9: {
    label: "P9 – Finish",
    phaseHint: "Finish",
    description: "Balanced finish position, chest at target, weight mostly into lead side.",
  },
};

function statusClasses(status?: SwingCheckpointStatus) {
  if (status === "GREEN") {
    return "bg-emerald-800/70 text-emerald-200";
  }
  if (status === "YELLOW") {
    return "bg-amber-700/70 text-amber-200";
  }
  if (status === "RED") {
    return "bg-rose-700/70 text-rose-200";
  }
  return "bg-slate-700/70 text-slate-200";
}

export function SwingReport({ report }: Props) {
  // Story-style narrative for summary
  const narrative =
    report.summary && report.summary.length > 0
      ? report.summary.join(" ")
      : "This swing report is missing a detailed summary, but the checkpoints, strengths, and practice plan below still give you a clear roadmap for improvement.";

  // Build preview items – prefer rich swingPreview if present,
  // otherwise derive from checkpoints so nothing breaks.
  const previewItems: SwingPreviewItem[] =
    report.swingPreview && report.swingPreview.length > 0
      ? report.swingPreview
      : report.checkpoints.map((cp) => ({
          label: cp.label,
          phase: cp.phase,
          short: cp.note,
          long: cp.note,
          status: cp.status,
        }));

  return (
    <div className="rounded-3xl bg-slate-900/85 shadow-2xl border border-emerald-700/40 overflow-hidden">
      {/* Top summary strip */}
      <div className="grid gap-4 md:grid-cols-[2.2fr,1fr] bg-gradient-to-r from-amber-700 via-amber-600 to-emerald-700 p-6">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-amber-50 mb-2">
            AI SWING SUMMARY
          </h2>
          <p className="text-[11px] text-amber-200/90 mb-1">
            Player: {report.playerName} · Hand: {report.hand} · Eye:{" "}
            {report.eye} · Handicap: {report.handicap || "N/A"}
          </p>
          <p className="text-xs leading-relaxed text-amber-50/95">
            {narrative}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-amber-50">
          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-amber-200">
              Swing Rating
            </p>
            <p className="text-xl font-bold leading-tight">A-</p>
            <p className="text-[11px] mt-1 opacity-80">Overall mechanics</p>
          </div>
          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-amber-200">
              Power Rating
            </p>
            <p className="text-xl font-bold leading-tight">B+</p>
            <p className="text-[11px] mt-1 opacity-80">Speed &amp; efficiency</p>
          </div>
          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-amber-200">
              Consistency
            </p>
            <p className="text-xl font-bold leading-tight">A-</p>
            <p className="text-[11px] mt-1 opacity-80">Pattern reliability</p>
          </div>
          <div className="rounded-2xl bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-amber-200">
              Readiness
            </p>
            <p className="text-xl font-bold leading-tight">Ready</p>
            <p className="text-[11px] mt-1 opacity-80">To start 14-day plan</p>
          </div>
        </div>
      </div>

      {/* Swing preview + video */}
      <section className="p-6 bg-slate-950/80 border-t border-emerald-800/40">
        <h3 className="text-xs font-semibold text-emerald-300 mb-2">
          Swing Preview — P1 to P9
        </h3>
        <p className="text-[11px] text-slate-300 mb-3">
          Quick tour of the swing checkpoints from setup to finish. The top
          line tells you what each P position is. The traffic light shows if
          it&apos;s a strength (green), watch area (yellow), or a priority leak
          (red). Each card also links out to a YouTube “swing fix” search for
          similar patterns.
        </p>

        <div className="grid gap-4 lg:grid-cols-[1.3fr,2fr]">
          {/* Video panel, if we have a video URL */}
          {report.videoUrl && (
            <div className="rounded-2xl border border-slate-700 bg-slate-900/95 p-3 flex flex-col gap-2">
              <p className="text-[11px] text-slate-200 mb-1">Swing video</p>
              <video
                src={report.videoUrl}
                controls
                className="w-full rounded-xl max-h-64 object-contain"
              />
              <p className="text-[10px] text-slate-400">
                Use this clip side-by-side with the P1–P9 notes to spot matchups
                and see how the fixes line up with your motion.
              </p>
            </div>
          )}

          {/* P1–P9 cards */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {previewItems.map((item) => {
              const meta = P_META[item.label] ?? null;
              const baseQuery =
                item.youtubeQuery ||
                `${item.phase} golf swing fix ${item.label} checkpoint`;
              const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
                `golf swing fix ${baseQuery}`
              )}`;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-700 bg-slate-900/95 p-3 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-[11px] font-semibold text-emerald-300">
                        {meta ? meta.label : item.label}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {item.phase}
                        {meta && meta.phaseHint ? ` • ${meta.phaseHint}` : ""}
                      </p>
                    </div>
                    <span
                      className={
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold " +
                        statusClasses(item.status)
                      }
                    >
                      {item.status || "INFO"}
                    </span>
                  </div>

                  {meta && (
                    <p className="text-[10px] text-slate-400 leading-snug mb-1">
                      {meta.description}
                    </p>
                  )}

                  <p className="text-[11px] font-semibold text-slate-100">
                    {item.short}
                  </p>

                  {item.long && item.long !== item.short && (
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {item.long}
                    </p>
                  )}

                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 text-[10px] text-emerald-300 hover:text-emerald-200 underline underline-offset-2"
                  >
                    View similar swing fixes on YouTube ↗
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Middle 3-column section */}
      <section className="grid gap-4 md:grid-cols-3 p-6 bg-slate-950/60 border-t border-emerald-800/40">
        <div className="rounded-2xl bg-slate-900 p-4 border border-emerald-700/40">
          <h3 className="text-xs font-semibold text-emerald-300 mb-2">
            GOOD SWING CHARACTERISTICS
          </h3>
          <ul className="text-xs space-y-1 text-slate-200">
            {report.strengths.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-slate-900 p-4 border border-amber-600/50">
          <h3 className="text-xs font-semibold text-amber-300 mb-2">
            TOP 3 PRIORITY FIXES
          </h3>
          <ol className="text-xs space-y-1 text-slate-200 list-decimal list-inside">
            {report.priorityFixes.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl bg-slate-900 p-4 border border-rose-600/50">
          <h3 className="text-xs font-semibold text-rose-300 mb-2">
            TOP POWER LEAKS
          </h3>
          <ul className="text-xs space-y-1 text-slate-200">
            {report.powerLeaks.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Checkpoint map */}
      <section className="p-6 bg-slate-950/70 border-t border-emerald-800/40">
        <h3 className="text-xs font-semibold text-emerald-300 mb-3">
          CHECKPOINT MAP (P1–P9)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-900">
                <th className="text-left px-3 py-2 border-b border-slate-700/70">
                  Label
                </th>
                <th className="text-left px-3 py-2 border-b border-slate-700/70">
                  Phase
                </th>
                <th className="text-left px-3 py-2 border-b border-slate-700/70">
                  Status
                </th>
                <th className="text-left px-3 py-2 border-b border-slate-700/70">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {report.checkpoints.map((cp, idx) => (
                <tr
                  key={cp.label + cp.phase}
                  className={
                    idx % 2 === 0 ? "bg-slate-900/70" : "bg-slate-900/40"
                  }
                >
                  <td className="px-3 py-2 border-b border-slate-800">
                    {cp.label}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-800">
                    {cp.phase}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-800">
                    <span
                      className={
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold " +
                        statusClasses(cp.status)
                      }
                    >
                      {cp.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b border-slate-800">
                    {cp.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 14-day plan */}
      <section className="p-6 bg-slate-900 border-t border-emerald-800/40">
        <h3 className="text-xs font-semibold text-emerald-300 mb-1">
          14-DAY PRACTICE PLAN — OVERVIEW
        </h3>
        <p className="text-[11px] text-slate-300 mb-3">
          Focus the next 14 days on improving transition timing and downswing
          path, while reinforcing your already strong fundamentals. This
          balanced approach will refine power delivery and consistency.
        </p>
        <div className="grid gap-3 md:grid-cols-4 text-[11px]">
          {report.planBlocks.map((block, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-700 bg-slate-950/80 p-3 flex flex-col gap-1"
            >
              <p className="font-semibold text-slate-100">{block.title}</p>
              <p className="text-slate-300">{block.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
