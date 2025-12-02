import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI(); // uses process.env.OPENAI_API_KEY

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let player: any = {};

    if (contentType.includes("multipart/form-data")) {
      // Coming from /upload with swing video + fields
      const form = await req.formData();

      player = {
        name: form.get("name")?.toString() || "",
        handicap: form.get("handicap")?.toString() || "",
        club: form.get("club")?.toString() || "",
        hand: form.get("hand")?.toString() || "Right",
        notes: form.get("notes")?.toString() || "",
        ballFlight: form.get("ballFlight")?.toString() || "",
      };

      const swingFile = form.get("swingVideo") as File | null;

      // We’re not decoding frames yet, but we DO tell the model this is a real swing clip.
      if (swingFile) {
        player.swingInfo = `Swing video uploaded: ${swingFile.name}, approx ${Math.round(
          swingFile.size / 1024
        )} KB. Treat this as a single-swing clip matching the description.`;
      } else {
        player.swingInfo =
          "No video file attached; treat description as main source.";
      }
    } else {
      // Fallback for JSON callers
      const body = await req.json();
      player = body.player || {};
      if (!player.swingInfo) {
        player.swingInfo =
          "No video file attached; treat description as main source.";
      }
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are a virtual golf coach using the VCA system.

Given a player's info, swing video context, and ball-flight description, generate a structured swing report to feed our UI.

Respond ONLY with valid JSON with this shape (no markdown, no extra text):

{
  "report": {
    "playerName": string,
    "hand": string,
    "eye": string,
    "handicap": string | number,
    "summary": string[],
    "strengths": string[],
    "priorityFixes": string[],
    "powerLeaks": string[],
    "checkpoints": [
      {
        "label": string,
        "phase": string,
        "status": "GREEN" | "YELLOW" | "RED",
        "note": string
      }
    ],
    "planBlocks": [
      { "title": string, "text": string }
    ]
  }
}

Use simple, range-ready language. Make it feel like it's based on THIS swing, not generic tips.
        `.trim(),
        },
        {
          role: "user",
          content: `
Player info:
- Name: ${player?.name || "Player"}
- Handicap / level: ${player?.handicap || "N/A"}
- Handedness: ${player?.hand || "Right"}
- Club used: ${player?.club || "N/A"}

Swing context:
- Swing video: ${player?.swingInfo || "N/A"}

Coach focus:
- Notes / goals: ${player?.notes || "N/A"}

Ball flight description:
- ${player?.ballFlight || "N/A"}
          `.trim(),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { report: null };
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("Error in /api/report:", err);
    return NextResponse.json(
      {
        report: null,
        error:
          err?.message ||
          "Unknown error generating swing report. Check server logs.",
      },
      { status: 500 }
    );
  }
}

