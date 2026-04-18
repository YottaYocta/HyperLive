import { staff, events } from "@/app/ts/db";

export default function AdminPage() {
  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
      <section>
        <h2 className="text-base font-semibold mb-3">Staff</h2>
        <div className="flex flex-col gap-2">
          {staff.map((u) => (
            <div
              key={u.id}
              className="flex items-start gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm"
            >
              <div className="flex-1">
                <span className="font-medium">{u.name}</span>
                <span className="ml-2 text-xs text-zinc-500 capitalize">{u.type}</span>
                <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">{u.specializations}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-3">Events</h2>
        <div className="flex flex-col gap-2">
          {events.map((e) => (
            <div
              key={e.id}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm"
            >
              {e.name}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
