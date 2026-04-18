"use client";

import { useEffect, useState } from "react";
import type { RoomSpeed, ProbeResult } from "@/app/ts/speed";

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
    <div className="max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
      <h2 className="text-base font-semibold">Connectivity</h2>

      {rooms.length === 0 ? (
        <p className="text-sm text-zinc-400">Measuring...</p>
      ) : (
        rooms.map((room) => {
          const metrics = room.connectivityMetrics;
          const maxMs = metrics
            ? Math.max(...metrics.results.filter((r) => r.ok && r.ms !== null).map((r) => r.ms as number), 1)
            : 1;

          return (
            <div key={room.room}>
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-sm font-medium">Room {room.room}</span>
                {metrics && (
                  <span className="text-xs text-zinc-400">
                    {new Date(metrics.measuredAt).toLocaleTimeString()}
                  </span>
                )}
              </div>

              {!metrics ? (
                <p className="text-xs text-zinc-400">pending...</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {metrics.results.map((r: ProbeResult) => (
                    <div key={r.url} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500 truncate">{r.url.replace("https://", "")}</span>
                        <span className={r.ok ? "tabular-nums text-zinc-900 dark:text-zinc-100" : "text-red-500"}>
                          {r.ok ? `${r.ms}ms` : "unreachable"}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${r.ok ? "bg-zinc-900 dark:bg-zinc-100" : "bg-red-400"}`}
                          style={{ width: r.ok ? `${((r.ms ?? 0) / maxMs) * 100}%` : "100%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
