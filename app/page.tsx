"use client";

import { useState, FormEvent } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          data.content ??
          "Sorry, I couldn’t come up with a response. Try rephrasing your question.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "Request to the server failed. Check that the dev server is running and try again.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-900 text-slate-100 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-800 p-4 shadow-lg flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">VCA Virtual Coach</h1>
        <p className="text-sm text-slate-300 text-center">
          Tell me your handicap, main miss, and what club you&apos;re
          struggling with. I&apos;ll give you one clear priority and drills.
        </p>

        <div className="h-[400px] border border-slate-700 rounded-xl p-3 overflow-y-auto bg-slate-900">
          {messages.length === 0 && (
            <p className="text-sm text-slate-400">
              Example: &quot;I&apos;m a 15 handicap, big slice with driver, thin
              wedges.&quot;
            </p>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`mb-2 ${
                m.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-2xl text-sm ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-50"
                }`}
              >
                {m.content}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="I'm a 15 handicap, big slice with driver..."
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl px-4 py-2 text-sm font-semibold bg-blue-500 disabled:opacity-60"
          >
            {isLoading ? "Coaching..." : "Send"}
          </button>
        </form>

        <div className="mt-3 text-[11px] text-slate-400 text-center">
          Want to see a full swing report layout?{" "}
          <a
            href="/report"
            className="underline text-emerald-300 hover:text-emerald-200"
          >
            View demo swing report
          </a>
        </div>
      </div>
    </main>
  );
}
