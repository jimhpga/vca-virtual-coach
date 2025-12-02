"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SwingReport, SwingReportData } from "../../components/SwingReport";

export default function UploadPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<SwingReportData | null>(null);

  const [name, setName] = useState("");
  const [handicap, setHandicap] = useState("");
  const [club, setClub] = useState("");
  const [hand, setHand] = useState("Right");
  const [notes, setNotes] = useState("");
  const [ballFlight, setBallFlight] = useState("");

  // Swing video file + preview
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setReport(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("handicap", handicap);
      formData.append("club", club);
      formData.append("hand", hand);
      formData.append("notes", notes);
      formData.append("ballFlight", ballFlight);

      const file = fileInputRef.current?.files?.[0] || null;
      if (file) {
        formData.append("swingVideo", file);
      }

      const res = await fetch("/api/report", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Report request failed");

      const data = await res.json();
      if (!data.report) {
        throw new Error("No report returned from server");
      }

      const reportData = data.report as SwingReportData;

      // update local preview (optional now that we redirect)
      setReport(reportData);

      // stash report for /report page
      try {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(
            "vca-latest-report",
            JSON.stringify(reportData)
          );
        }
      } catch (err) {
        console.error("Failed to store report in sessionStorage:", err);
      }

      // go to full report page
      router.push("/report");
    } catch (err) {
      console.error(err);
      alert(
        "Something went wrong generating your swing report. Check the dev console for details."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleRecording() {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      setVoiceStatus("Processing voice note...");
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Voice notes are not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];
        stream.getTracks().forEach((t) => t.stop());

        try {
          const formData = new FormData();
          formData.append("audio", blob, "swing-note.webm");

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            console.error("Transcription failed", await res.text());
            setVoiceStatus("Transcription failed.");
            return;
          }

          const data = await res.json();
          const text = (data.text as string) || "";

          if (text.trim()) {
            setBallFlight((prev) =>
              prev ? `${prev.trim()}\n\nVoice note: ${text}` : text
            );
            setVoiceStatus("Voice note added to description.");
          } else {
            setVoiceStatus("Couldn’t hear anything clear. Try again.");
          }
        } catch (err) {
          console.error(err);
          setVoiceStatus("Error transcribing voice note.");
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setVoiceStatus("Recording… talk through what your swing is doing.");
    } catch (err) {
      console.error(err);
      alert("Could not access microphone. Check browser permissions.");
    }
  }

  function handleVideoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;

    if (fileInputRef.current) {
      // keep the file stored on the input
      fileInputRef.current.files = e.target.files as FileList;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-slate-50 flex justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid gap-6 md:grid-cols-[3fr,2fr]">
        {/* Left: upload form */}
        <section className="rounded-3xl bg-slate-900/95 border border-emerald-700/50 shadow-2xl p-6 flex flex-col gap-4">
          <header>
            <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-300">
              Virtual Coach AI
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Upload Your Swing
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Upload a face-on or down-the-line swing and tell me how the ball
              flies. I&apos;ll build a P1–P9 style swing report and a 14-day
              practice plan.
            </p>
          </header>

          {/* Swing video */}
          <div className="rounded-2xl border border-emerald-600/70 bg-emerald-950/40 p-4 text-xs text-emerald-100">
            <p className="font-semibold mb-1">1. Choose your swing video</p>
            <p className="text-emerald-200/90 mb-2">
              Face-on or down-the-line. A clean single-swing clip (setup → finish)
              works best. MP4 / MOV recommended.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={handleVideoChange}
              className="block w-full text-[11px] text-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-950 hover:file:bg-emerald-400"
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 text-xs mt-1"
          >
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-300">
                  Your name (optional)
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-300">
                  Handicap / level
                </label>
                <input
                  value={handicap}
                  onChange={(e) => setHandicap(e.target.value)}
                  placeholder="e.g. 2, 12, beginner"
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-300">Club used</label>
                <input
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  placeholder="Driver, 7-iron, wedge..."
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-300">
                  Handedness
                </label>
                <select
                  value={hand}
                  onChange={(e) => setHand(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Right">Right-handed</option>
                  <option value="Left">Left-handed</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-300">
                Anything specific you want me to look at?
              </label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. driver consistency, low point, face control..."
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-slate-300">
                  Describe your typical ball flight with this swing
                </label>
                <button
                  type="button"
                  onClick={handleToggleRecording}
                  className={
                    "ml-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] border " +
                    (isRecording
                      ? "border-rose-400 bg-rose-500/20 text-rose-200"
                      : "border-emerald-400 bg-emerald-500/10 text-emerald-200")
                  }
                >
                  <span>{isRecording ? "Stop voice note" : "Speak description"}</span>
                </button>
              </div>
              <textarea
                value={ballFlight}
                onChange={(e) => setBallFlight(e.target.value)}
                rows={3}
                placeholder="Start line, curve, height, contact pattern, main miss..."
                className="mt-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {voiceStatus && (
                <p className="text-[10px] text-slate-400 mt-1">{voiceStatus}</p>
              )}
            </div>

            <div className="flex items-center justify-between mt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-semibold shadow-md disabled:opacity-60"
              >
                {isLoading ? "Analyzing swing..." : "Upload & Analyze Swing"}
              </button>
              <a
                href="/"
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >
                ← Back to VCA Coach
              </a>
            </div>
          </form>
        </section>

        {/* Right: video preview + live report */}
        <section className="rounded-3xl bg-slate-950/90 border border-slate-700/70 shadow-xl p-4 flex flex-col gap-3">
          {previewUrl && (
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3">
              <p className="text-[11px] text-slate-300 mb-2">Swing preview</p>
              <video
                src={previewUrl}
                controls
                className="w-full rounded-xl max-h-56 object-contain"
              />
            </div>
          )}

          <h2 className="text-xs font-semibold text-slate-200">Live Preview</h2>
          {!report && (
            <div className="flex-1 rounded-2xl border border-slate-700 bg-slate-900/80 flex items-center justify-center text-center text-xs text-slate-400 px-4">
              <p>
                No report yet. Pick a swing and fill out the form on the left,
                then hit{" "}
                <span className="font-semibold text-emerald-300">
                  Upload &amp; Analyze Swing
                </span>{" "}
                to see your Virtual Coach AI swing report here.
              </p>
            </div>
          )}
          {report && (
            <div className="flex-1 overflow-y-auto pr-1">
              <SwingReport report={report} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
