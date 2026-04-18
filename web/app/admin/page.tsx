import { staff, events } from "@/app/ts/db";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-xs font-semibold tracking-wide uppercase text-[--color-muted] mb-3">
          Staff
        </h2>
        <div className="flex flex-col gap-1.5">
          {staff.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-4 bg-zinc-100  rounded-xl px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{u.name}</span>
                  <span className="text-xs bg-zinc-200 text-zinc-500 px-2 py-0.5 rounded-full capitalize font-medium">
                    {u.type}
                  </span>
                </div>
                <p className="text-xs text-[--color-muted] mt-0.5 truncate">
                  {u.specializations}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold tracking-wide uppercase text-[--color-muted] mb-3">
          Events
        </h2>
        <div className="flex flex-col gap-1.5">
          {events.map((e) => (
            <div
              key={e.id}
              className="bg-zinc-100 rounded-xl px-4 py-3 text-sm font-medium"
            >
              {e.name}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
