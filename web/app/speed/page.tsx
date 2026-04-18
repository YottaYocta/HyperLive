"use client";

import { useEffect, useState } from "react";
import type { RoomSpeed, ProbeResult } from "@/app/ts/speed";

function speedStyle(ms: number | null, ok: boolean): { bar: string; text: string } {
  if (!ok || ms === null) return { bar: "bg-red-400", text: "text-red-500" };
  if (ms < 250) return { bar: "bg-zinc-400 dark:bg-zinc-500", text: "text-zinc-600 dark:text-zinc-400" };
  if (ms < 500) return { bar: "bg-amber-400", text: "text-amber-600 dark:text-amber-400" };
  return { bar: "bg-red-400", text: "text-red-500" };
}

function avgMs(results: ProbeResult[]): number | null {
  const ok = results.filter((r) => r.ok && r.ms !== null);
  if (!ok.length) return null;
  return Math.round(ok.reduce((sum, r) => sum + (r.ms as number), 0) / ok.length);
}

function avgStyle(ms: number | null): string {
  if (ms === null) return "text-red-500";
  if (ms < 250) return "text-zinc-800 dark:text-zinc-200";
  if (ms < 500) return "text-amber-500";
  return "text-red-500";
}

export default function SpeedPage() {
  const [rooms, setRooms] = useState<RoomSpeed[]>([]);

  useEffect(() => {
    async function poll() {
      try {
        const res = await fetch("/api/speed");
        setRooms(await res.json());
      } catch {}
    }
    poll();
    const id = setInterval(poll, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8">
      <h2 className="text-base font-semibold mb-6">Connectivity</h2>

      {rooms.length === 0 ? (
        <p className="text-sm text-zinc-400">Measuring...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {rooms.map((room) => {
            const metrics = room.connectivityMetrics;
            const avg = metrics ? avgMs(metrics.results) : null;
            const maxMs = metrics
              ? Math.max(...metrics.results.filter((r) => r.ok && r.ms !== null).map((r) => r.ms as number), 1)
              : 1;

            return (
              <div
                key={room.room}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 flex flex-col gap-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                    Room {room.room}
                  </span>
                  {metrics && (
                    <span className="text-xs text-zinc-400">
                      {new Date(metrics.measuredAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>

                {/* Average */}
                <div className="flex flex-col items-center justify-center py-2">
                  {avg !== null ? (
                    <>
                      <span className={`text-4xl font-semibold tabular-nums ${avgStyle(avg)}`}>
                        {avg}
                      </span>
                      <span className="text-xs text-zinc-400 mt-1">ms avg</span>
                    </>
                  ) : (
                    <span className="text-sm text-zinc-400">pending...</span>
                  )}
                </div>

                {/* Bar grid */}
                {metrics && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {metrics.results.map((r: ProbeResult) => {
                      const style = speedStyle(r.ms, r.ok);
                      return (
                        <div key={r.url} className="flex flex-col gap-0.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-400 truncate">
                              {r.url.replace("https://", "").replace("www.", "")}
                            </span>
                            <span className={`tabular-nums ${style.text} ml-1 shrink-0`}>
                              {r.ok ? `${r.ms}` : "—"}
                            </span>
                          </div>
                          <div className="h-1 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                              style={{ width: r.ok ? `${((r.ms ?? 0) / maxMs) * 100}%` : "100%" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
