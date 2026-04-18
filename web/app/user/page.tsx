"use client";

import { useState } from "react";
import { useStore } from "@/app/store";

const ROWS = ["A", "B", "C", "D", "E", "F"];
const COLS = [1, 2, 3, 4, 5];

export default function UserPage() {
  const { messages, addMessage, selectedTable, setSelectedTable } = useStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || loading) return;

    const userContent = selectedTable
      ? `[Table ${selectedTable}] ${prompt}`
      : prompt;
    addMessage({ role: "user", content: userContent });
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, table: selectedTable }),
      });
      const data = await res.json();
      addMessage({ role: "assistant", content: data.message });
    } catch {
      addMessage({
        role: "assistant",
        content: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Table map */}
      <section className="bg-zinc-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-[--color-muted]">
            Your Table
          </h2>
          {selectedTable && (
            <span className="text-sm font-semibold bg-black text-white px-2.5 py-0.5 rounded-full">
              Table {selectedTable}
            </span>
          )}
        </div>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${COLS.length}, 1fr)` }}
        >
          {ROWS.map((row) =>
            COLS.map((col) => {
              const id = `${row}${col}`;
              const selected = selectedTable === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedTable(selected ? null : id)}
                  className={`rounded-lg text-xs font-semibold py-2.5 transition-all duration-150 ${
                    selected
                      ? "bg-black text-white shadow-sm scale-95"
                      : "bg-white text-zinc-400 hover:text-black hover:bg-zinc-100"
                  }`}
                >
                  {id}
                </button>
              );
            }),
          )}
        </div>
      </section>

      {/* Chat */}
      <section className="bg-zinc-100 rounded-2xl flex flex-col overflow-hidden">
        <div className="flex flex-col gap-3 p-6 min-h-55">
          {messages.length === 0 && (
            <div className="flex flex-1 items-center justify-center text-[--color-muted] text-sm py-8">
              Describe what you need help with.
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-black text-white rounded-br-sm"
                    : "bg-white text-zinc-800 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-[--color-muted]">
                <span className="inline-flex gap-1">
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  >
                    ·
                  </span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  >
                    ·
                  </span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  >
                    ·
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 pt-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10 transition placeholder:text-[--color-muted]"
              placeholder="request help"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-black text-white px-5 py-2.5 text-sm font-semibold disabled:opacity-30 hover:bg-zinc-800 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
