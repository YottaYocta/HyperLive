"use client";

import { useEffect, useState } from "react";
import type { RoomSpeed, ProbeResult } from "@/app/ts/speed";

function speedStyle(ms: number | null, ok: boolean): { bar: string; text: string } {
  if (!ok || ms === null) return { bar: "bg-red-400", text: "text-red-500" };
  if (ms < 250) return { bar: "bg-zinc-300", text: "text-zinc-500" };
  if (ms < 500) return { bar: "bg-amber-400", text: "text-amber-600" };
  return { bar: "bg-red-400", text: "text-red-500" };
}

function avgMs(results: ProbeResult[]): number | null {
  const ok = results.filter((r) => r.ok && r.ms !== null);
  if (!ok.length) return null;
  return Math.round(ok.reduce((sum, r) => sum + (r.ms as number), 0) / ok.length);
}

function avgColor(ms: number | null): string {
  if (ms === null) return "text-red-500";
  if (ms < 250) return "text-zinc-800";
  if (ms < 500) return "text-amber-500";
  return "text-red-500";
}

function statusLabel(ms: number | null): { label: string; dot: string } {
  if (ms === null) return { label: "unreachable", dot: "bg-red-400" };
  if (ms < 250) return { label: "good", dot: "bg-emerald-400" };
  if (ms < 500) return { label: "moderate", dot: "bg-amber-400" };
  return { label: "degraded", dot: "bg-red-400" };
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
    <div className="flex flex-col gap-6">
      <h2 className="text-xs font-semibold tracking-wide uppercase text-[--color-muted]">
        Connectivity
      </h2>

      {rooms.length === 0 ? (
        <p className="text-sm text-[--color-muted]">Measuring…</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {rooms.map((room) => {
            const metrics = room.connectivityMetrics;
            const avg = metrics ? avgMs(metrics.results) : null;
            const maxMs = metrics
              ? Math.max(...metrics.results.filter((r) => r.ok && r.ms !== null).map((r) => r.ms as number), 1)
              : 1;
            const status = statusLabel(avg);

            return (
              <div
                key={room.room}
                className="bg-zinc-50 rounded-2xl p-5 flex flex-col gap-5"
              >
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wide uppercase text-[--color-muted]">
                    Room {room.room}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[--color-muted]">
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>

                {/* Average */}
                <div className="flex flex-col items-center py-1">
                  {avg !== null ? (
                    <>
                      <span className={`text-5xl font-semibold tabular-nums leading-none ${avgColor(avg)}`}>
                        {avg}
                      </span>
                      <span className="text-xs text-[--color-muted] mt-2">ms avg</span>
                    </>
                  ) : (
                    <span className="text-sm text-[--color-muted]">pending…</span>
                  )}
                </div>

                {/* Bars */}
                {metrics && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {metrics.results.map((r: ProbeResult) => {
                      const s = speedStyle(r.ms, r.ok);
                      return (
                        <div key={r.url} className="flex flex-col gap-1">
                          <div className="flex justify-between items-baseline text-xs">
                            <span className="text-[--color-muted] truncate">
                              {r.url.replace("https://", "").replace("www.", "")}
                            </span>
                            <span className={`tabular-nums ml-1 shrink-0 font-medium ${s.text}`}>
                              {r.ok ? `${r.ms}` : "—"}
                            </span>
                          </div>
                          <div className="h-1 rounded-full bg-zinc-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${s.bar}`}
                              style={{ width: r.ok ? `${((r.ms ?? 0) / maxMs) * 100}%` : "100%" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Timestamp */}
                {metrics && (
                  <p className="text-xs text-[--color-muted] text-right">
                    {new Date(metrics.measuredAt).toLocaleTimeString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
