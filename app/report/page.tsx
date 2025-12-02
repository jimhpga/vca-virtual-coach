"use client";

import { FormEvent, useEffect, useState } from "react";
import { SwingReport, SwingReportData } from "../../components/SwingReport";

const fallbackReport: SwingReportData = {
  playerName: "Player",
  hand: "Right",
  eye: "Right",
  handicap: 1,
  summary: [
    "Solid fundamentally sound mid-iron swing with slight room for refinement in transition and low point control.",
    "Strong and stable setup supporting a powerful coil.",
    "Good wrist hinge creating width and leverage through the backswing.",
    "Consistent clubface control leading to accurate start direction.",
    "Minor weight shift timing issues affecting low point consistency.",
    "Swing path generally on plane but can improve shallow entry angle.",
  ],
  strengths: [
    "Athletic and balanced setup promoting an efficient coil.",
    "Strong connection to the lower body during backswing.",
    "Effective use of wrist hinge for width and power.",
    "Good control of clubface orientation through impact.",
    "Consistent takeaway path aligned with target line.",
  ],
  priorityFixes: [
    "Improve weight shift timing — work on syncing lower body transition slightly earlier to promote better low-point control and more consistent ball-first contact.",
    "Shorten and smooth the top of backswing — focus on slightly reducing arm travel at the top to keep the club in front of you.",
    "Refine exit path — feel the handle working more left through impact to prevent blocks and high right shots.",
  ],
  powerLeaks: [
    "Low launch angle due to deceleration through impact.",
    "Slight casting of the hands on transition reducing stored leverage.",
    "Early extension causing some loss of speed and power.",
    "Minor steepness on downswing limiting compression.",
  ],
  checkpoints: [
    {
      label: "P1",
      phase: "Setup",
      status: "GREEN",
      note: "Balanced athletic posture with proper spine and ball position.",
    },
    {
      label: "P2",
      phase: "Takeaway",
      status: "GREEN",
      note: "Smooth one-piece takeaway keeping clubhead low and on target line.",
    },
    {
      label: "P3",
      phase: "Top of backswing",
      status: "GREEN",
      note: "Full rotation with strong body coil and wide arc.",
    },
    {
      label: "P4",
      phase: "Transition",
      status: "YELLOW",
      note: "Slight delay in lower body initiation affecting rhythm and low point.",
    },
    {
      label: "P5",
      phase: "Downswing",
      status: "YELLOW",
      note: "Good leg drive but sometimes steep club path reducing strike quality.",
    },
    {
      label: "P6",
      phase: "Impact",
      status: "GREEN",
      note: "Consistent square clubface with solid compression and divot control.",
    },
    {
      label: "P7",
      phase: "Release",
      status: "GREEN",
      note: "Smooth release with hands ahead of the clubhead at impact.",
    },
    {
      label: "P8",
      phase: "Finish",
      status: "GREEN",
      note: "Balanced full finish facing the target with good rotation.",
    },
    {
      label: "P9",
      phase: "Setup to start line",
      status: "GREEN",
      note: "Excellent alignment and path control leading to consistent ball flight.",
    },
  ],
  planBlocks: [
    {
      title: "Days 1–2: Transition Timing",
      text: "Shorten transition and sync lower body earlier. Use slow-motion reps focusing on lead hip starting down first. Blend into 9-to-3 swings before going full speed.",
    },
    {
      title: "Days 3–5: Downswing Plane",
      text: "Rehearse shallower downswing with trail elbow staying more in front. Use alignment sticks to guide path and rehearse hitting from the inside without getting stuck.",
    },
    {
      title: "Days 6–7: Weight Shift & Low Point",
      text: "Low-point ladder drill with mid-iron. Progressively move divot a ball ahead of the previous mark while keeping chest over the ball and not hanging back.",
    },
    {
      title: "Days 8–14: Integrate & Transfer",
      text: "Blend new feels into full routine: pre-shot, start line, and finish. Alternate block practice (same target) with random practice (different targets) to lock in changes.",
    },
  ],
};

export default function SwingReportPage() {
  const [report, setReport] = useState<SwingReportData | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem("vca-latest-report");
      if (stored) {
        setReport(JSON.parse(stored));
      } else {
        setReport(fallbackReport);
      }
    } catch (e) {
      console.error("Error loading report from sessionStorage:", e);
      setReport(fallbackReport);
    }
  }, []);

  async function handleAsk(e: FormEvent) {
    e.preventDefault();
    if (!question.trim() || !report) return;

    setIsAsking(true);
    setAnswer("");

    try {
      const res = await fetch("/api/report-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report,
          question: question.trim(),
        }),
      });

      if (!res.ok) {
        console.error("report-chat error:", await res.text());
        setAnswer("Sorry, something went wrong answering that question.");
        return;
      }

      const data = await res.json();
      setAnswer(data.answer ?? "No answer returned.");
    } catch (err) {
      console.error(err);
      setAnswer("Error talking to the coach. Try again in a moment.");
    } finally {
      setIsAsking(false);
    }
  }

  if (!report) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-300">Loading swing report…</p>
      </main>
    );
  }

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
              Player: {report.playerName} · Hand: {report.hand} · Eye:{" "}
              {report.eye} · Handicap: {report.handicap}
            </p>
          </div>
          <a
            href="/upload"
            className="text-xs px-3 py-1 rounded-full border border-emerald-300/60 bg-emerald-900/40 hover:bg-emerald-800 transition"
          >
            Analyze another swing
          </a>
        </header>

        {/* Main swing report card */}
        <SwingReport report={report} />

        {/* Q&A panel */}
        <section className="mt-6 rounded-3xl bg-slate-900/90 border border-slate-700/70 shadow-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-emerald-300">
              Questions about this report?
            </h2>
            <p className="text-[11px] text-slate-400">
              Ask follow-ups like:{" "}
              <span className="italic">
                &quot;What does P5 yellow actually mean for my ball flight?&quot;
              </span>
            </p>
          </div>

          <form onSubmit={handleAsk} className="flex flex-col gap-2 text-xs">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="Ask about any part of this report — checkpoints, drills, or what to expect on the course..."
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isAsking || !question.trim()}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-semibold shadow-md disabled:opacity-60"
              >
                {isAsking ? "Coach is thinking..." : "Ask Coach About This Report"}
              </button>
              {answer && (
                <span className="text-[11px] text-slate-400">
                  Answer appears below.
                </span>
              )}
            </div>
          </form>

          {answer && (
            <div className="mt-2 rounded-2xl border border-slate-700 bg-slate-950/80 p-3 text-xs text-slate-100">
              <p className="text-[11px] font-semibold text-emerald-300 mb-1">
                Coach’s answer
              </p>
              <p className="whitespace-pre-wrap leading-relaxed">{answer}</p>
            </div>
          )}
        </section>

        <footer className="mt-4 text-[10px] text-slate-500 text-center">
          Latest report is stored in this browser. For a new swing, upload again
          from the VCA AI coach.
        </footer>
      </div>
    </main>
  );
}
