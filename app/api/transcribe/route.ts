import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI(); // uses process.env.OPENAI_API_KEY

export async function POST(req: NextRequest) {
  try {
    const { report, question } = await req.json();

    if (!question || !report) {
      return NextResponse.json(
        { error: "Missing report or question" },
        { status: 400 }
      );
    }

    const summaryText = Array.isArray(report.summary)
      ? report.summary.join(" ")
      : String(report.summary ?? "");

    const strengthsText = (report.strengths || []).join(" | ");
    const fixesText = (report.priorityFixes || []).join(" | ");
    const leaksText = (report.powerLeaks || []).join(" | ");

    const checkpointsText = (report.checkpoints || [])
      .map(
        (cp: any) =>
          `${cp.label} (${cp.phase}) [${cp.status}]: ${cp.note ?? ""}`
      )
      .join("\n");

    const planText = (report.planBlocks || [])
      .map((b: any) => `${b.title}: ${b.text}`)
      .join("\n");

    const context = `
Player: ${report.playerName}
Hand: ${report.hand}
Eye: ${report.eye}
Handicap: ${report.handicap}

SUMMARY:
${summaryText}

STRENGTHS:
${strengthsText}

TOP PRIORITY FIXES:
${fixesText}

POWER LEAKS:
${leaksText}

CHECKPOINTS (P1–P9):
${checkpointsText}

14-DAY PRACTICE PLAN:
${planText}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a golf coach giving clear, practical answers about a swing report. Use range-ready language, no jargon unless you explain it. If the golfer asks about priorities, always come back to ONE key priority first, then second steps. Keep answers focused on THIS report, not generic golf tips.",
        },
        {
          role: "user",
          content: `Here is the swing report:\n${context}\n\nThe golfer's question about this report is:\n${question}\n\nAnswer directly, in a few short paragraphs, and if helpful, include 1–2 simple range feels or checkpoints.`,
        },
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const answer =
      completion.choices[0]?.message?.content ??
      "I couldn't generate an answer. Try asking again in a different way.";

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("Error in /api/report-chat:", err);
    return NextResponse.json(
      { error: err?.message ?? "Error generating answer" },
      { status: 500 }
    );
  }
}
