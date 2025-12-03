"use client";

import type { ReactNode } from "react";

export type SwingCheckpoint = {
  label: string; // P1–P9
  phase: string; // e.g. Setup, Top, Impact
  status: "GREEN" | "YELLOW" | "RED";
  short?: string; // short coach note
  long?: string; // long coach note
  youtubeQuery?: string; // optional search query
};

export type SwingReportData = {
  player: {
    name: string;
    hand: string;
    eye: string;
    handicap: string | number;
  };
  // Story-style summary paragraph
  swingSummary: string;
  // Ratings block
  swingRatings?: {
    swing: string;
    power: string;
    consistency: string;
    readiness: string;
  };
  // Optional swing preview panel
  swingPreview?: {
    videoUrl?: string;
    checkpoints?: SwingCheckpoint[];
  };
  strengths: string[];
  priorityFixes: string[];
  powerLeaks: string[];
  checkpoints: SwingCheckpoint[];
  planBlocks: { title: string; text: string }[];
};

type Props = {
  report: SwingReportData;
};

export function SwingReport({ report }: Props) {
  const {
    player,
    swingSummary,
    swingRatings,
    swingPreview,
    strengths,
    priorityFixes,
    powerLeaks,
    checkpoints,
    planBlocks,
  } = report;

  const ratings = swingRatings ?? {
    swing: "A-",
    power: "B+",
    consistency: "A-",
    readiness: "Ready",
  };

  const previewCheckpoints =
    swingPreview?.checkpoints && swingPreview.checkpoints.length > 0
      ? swingPreview.checkpoints
      : checkpoints.slice(0, 4);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-900 via-slate-950 to-slate-950 text-slate-50 px-4 py-8 flex justify-center">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Virtual Coach AI — Swing Report
            </h1>
            <p className="text-sm text-emerald-200">
              Player: {player.name || "Player"} · Hand: {player.hand || "Right"}{" "}
              · Eye: {player.eye || "Unknown"} · Handicap:{" "}
              {player.handicap ?? "N/A"}
            </p>
          </div>
          <a
            href="/upload"
            className="text-xs px-3 py-1 rounded-full border border-emerald-300/60 bg-emerald-900/40 hover:bg-emerald-800 transition"
          >
            Analyze another swing
          </a>
        </header>

        {/* Main card */}
        <div className="rounded-3xl bg-slate-900/85 shadow-2xl border border-emerald-700/40 overflow-hidden">
          {/* Top summary strip */}
          <div className="grid gap-4 md:grid-cols-[2.1fr,1fr] bg-gradient-to-r from-amber-700 via-amber-600 to-emerald-700 p-6">
            {/* Story summary */}
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-amber-50 mb-2">
                AI SWING SUMMARY
              </h2>
              <p className="text-xs leading-relaxed text-amber-50/95">
                {swingSummary ||
                  "Smooth tempo observed in the swing with good rhythm and balanced setup. Ball flight patterns hint at a consistent motion that’s leaving a little speed and compression on the table — the kind of swing that’s close to dialed, but ready for a focused 14-day tune-up."}
              </p>
            </div>

            {/* Ratings panel */}
            <div className="grid grid-cols-2 gap-2 text-xs text-amber-50">
              <RatingCard
                label="Swing Rating"
                value={ratings.swing}
                note="Overall mechanics"
              />
              <RatingCard
                label="Power Rating"
                value={ratings.power}
                note="Speed & efficiency"
              />
              <RatingCard
                label="Consistency"
                value={ratings.consistency}
                note="Pattern reliability"
              />
              <RatingCard
                label="Readiness"
                value={ratings.readiness}
                note="To start 14-day plan"
              />
            </div>
          </div>

          {/* Swing preview row */}
          <section className="p-6 bg-slate-950/75 border-t border-emerald-800/40">
            <h3 className="text-xs font-semibold text-emerald-300 mb-2">
              Swing Preview — P1 to P9
            </h3>
            <p className="text-[11px] text-slate-300 mb-3">
              Quick tour of the swing checkpoints from setup to finish. Use the
              short description for the big picture, and the long note when
              you&apos;re coaching or reviewing video frame-by-frame.
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              {/* Video panel */}
              {swingPreview?.videoUrl && (
                <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3">
                  <p className="text-[11px] text-slate-300 mb-1">
                    Swing video
                  </p>
                  <video
                    src={swingPreview.videoUrl}
                    controls
                    className="w-full rounded-xl max-h-60 object-contain"
                  />
                  <p className="mt-2 text-[10px] text-slate-400">
                    Use this as your reference clip while you walk through each
                    checkpoint below.
                  </p>
                </div>
              )}

              {/* P1–P9 short tiles */}
              <div className="grid gap-2 sm:grid-cols-2">
                {previewCheckpoints.map((cp) => (
                  <div
                    key={cp.label}
                    className="rounded-2xl border border-slate-700 bg-slate-900/90 px-3 py-2"
                  >
                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                      {cp.label} · {cp.phase}
                    </p>
                    <p className="text-xs font-semibold text-slate-100 mt-1">
                      {cp.short || cp.long || "Checkpoint note"}
                    </p>
                    {cp.youtubeQuery && (
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                          cp.youtubeQuery
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[10px] text-emerald-300 hover:text-emerald-200"
                      >
                        View swing fix on YouTube →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Middle 3-column section */}
          <section className="grid gap-4 md:grid-cols-3 p-6 bg-slate-950/80 border-t border-emerald-800/40">
            <Panel title="GOOD SWING CHARACTERISTICS" tone="good">
              <BulletList items={strengths} />
            </Panel>
            <Panel title="TOP 3 PRIORITY FIXES" tone="focus">
              <OrderedList items={priorityFixes} />
            </Panel>
            <Panel title="TOP POWER LEAKS" tone="leaks">
              <BulletList items={powerLeaks} />
            </Panel>
          </section>

          {/* Checkpoint map */}
          <section className="p-6 bg-slate-950/90 border-t border-emerald-800/40">
            <h3 className="text-xs font-semibold text-emerald-300 mb-3">
              CHECKPOINT MAP (P1–P9)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="bg-slate-900/90">
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
                    <th className="text-left px-3 py-2 border-b border-slate-700/70">
                      Detail / Swing Fix
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {checkpoints.map((cp, idx) => (
                    <tr
                      key={`${cp.label}-${idx}`}
                      className={
                        idx % 2 === 0
                          ? "bg-slate-900/70"
                          : "bg-slate-900/40"
                      }
                    >
                      <td className="px-3 py-2 border-b border-slate-800">
                        {cp.label}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-800">
                        {cp.phase}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-800">
                        <StatusPill status={cp.status} />
                      </td>
                      <td className="px-3 py-2 border-b border-slate-800">
                        {cp.short || cp.long || "—"}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-800">
                        <div className="space-y-1">
                          <p className="text-[11px] text-slate-200">
                            {cp.long || "Detail coming soon."}
                          </p>
                          {cp.youtubeQuery && (
                            <a
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                                cp.youtubeQuery
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block text-[10px] text-emerald-300 hover:text-emerald-200"
                            >
                              Watch similar swing fix →
                            </a>
                          )}
                        </div>
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
              Focus the next 14 days on improving transition timing and
              downswing path, while reinforcing your already strong fundamentals.
              This balanced approach will refine power delivery and consistency.
            </p>
            <div className="grid gap-3 md:grid-cols-4 text-[11px]">
              {planBlocks.map((block, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-700 bg-slate-950/80 p-3 flex flex-col gap-1"
                >
                  <p className="font-semibold text-slate-100">
                    {block.title}
                  </p>
                  <p className="text-slate-300">{block.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Question prompt (non-AI for now) */}
          <section className="p-6 bg-slate-950/95 border-t border-emerald-800/40">
            <h3 className="text-xs font-semibold text-emerald-300 mb-1">
              Questions about this report?
            </h3>
            <p className="text-[11px] text-slate-300 mb-2">
              Ask about any part of this report — checkpoints, drills, or what
              to expect on the course. You can paste sections of this report
              into the VCA chat to go deeper on a specific piece.
            </p>
          </section>
        </div>

        <footer className="mt-4 text-[10px] text-slate-500 text-center">
          Latest report is stored in this browser. For a new swing, upload again
          from the VCA AI coach.
        </footer>
      </div>
    </main>
  );
}

/* ---------- Small helper components ---------- */

function RatingCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl bg-black/20 p-3">
      <p className="text-[10px] uppercase tracking-[0.12em] text-amber-200">
        {label}
      </p>
      <p className="text-xl font-bold leading-tight">{value}</p>
      <p className="text-[11px] mt-1 opacity-80">{note}</p>
    </div>
  );
}

function Panel({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "good" | "focus" | "leaks";
  children: ReactNode;
}) {
  const borderClass =
    tone === "good"
      ? "border-emerald-700/60"
      : tone === "focus"
      ? "border-amber-600/60"
      : "border-rose-600/60";

  const titleClass =
    tone === "good"
      ? "text-emerald-300"
      : tone === "focus"
      ? "text-amber-300"
      : "text-rose-300";

  return (
    <div className={`rounded-2xl bg-slate-900 p-4 border ${borderClass}`}>
      <h3 className={`text-xs font-semibold mb-2 ${titleClass}`}>{title}</h3>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (!items || items.length === 0) return <p className="text-xs">—</p>;
  return (
    <ul className="text-xs space-y-1 text-slate-200">
      {items.map((s, i) => (
        <li key={i}>• {s}</li>
      ))}
    </ul>
  );
}

function OrderedList({ items }: { items: string[] }) {
  if (!items || items.length === 0) return <p className="text-xs">—</p>;
  return (
    <ol className="text-xs space-y-1 text-slate-200 list-decimal list-inside">
      {items.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ol>
  );
}

function StatusPill({ status }: { status: SwingCheckpoint["status"] }) {
  const classes =
    status === "GREEN"
      ? "bg-emerald-800/70 text-emerald-200"
      : status === "YELLOW"
      ? "bg-amber-700/70 text-amber-200"
      : "bg-rose-700/70 text-rose-200";

  return (
    <span
      className={
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold " +
        classes
      }
    >
      {status}
    </span>
  );
}
