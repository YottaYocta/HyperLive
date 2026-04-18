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
      addMessage({ role: "assistant", content: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 max-w-2xl mx-auto w-full px-4 py-8 gap-6">
      {/* Table map */}
      <div>
        <p className="text-xs text-zinc-500 mb-2">
          Select your table{selectedTable ? ` — Table ${selectedTable} selected` : ""}
        </p>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${COLS.length}, 1fr)` }}>
          {ROWS.map((row) =>
            COLS.map((col) => {
              const id = `${row}${col}`;
              const selected = selectedTable === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedTable(selected ? null : id)}
                  className={`rounded border text-xs font-medium py-2 transition-colors ${
                    selected
                      ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:text-zinc-200"
                  }`}
                >
                  {id}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex items-center justify-center text-zinc-400 text-sm py-4">
            Describe what you need help with.
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-2 text-sm text-zinc-400">
              ...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
          placeholder="request help"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium disabled:opacity-40 transition hover:bg-zinc-700 dark:hover:bg-zinc-300"
        >
          Send
        </button>
      </form>
    </div>
  );
}
