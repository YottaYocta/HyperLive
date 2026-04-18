import { staff, events } from "@/app/ts/db";

const DISCORD_SERVICE_URL = process.env.DISCORD_SERVICE_URL ?? "http://localhost:3000";
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID ?? "";

async function getFirstChannelId(): Promise<string | null> {
  if (!DISCORD_GUILD_ID) return null;
  try {
    const res = await fetch(`${DISCORD_SERVICE_URL}/channels/${DISCORD_GUILD_ID}`);
    const channels = await res.json();
    return channels.find((c: { id: string; type: number }) => c.type === 0)?.id ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const { prompt, table } = await request.json();

  const channelId = await getFirstChannelId();
  if (channelId) {
    const location = table ? ` at Table ${table}` : "";
    try {
      await fetch(`${DISCORD_SERVICE_URL}/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId,
          content: `hacker has requested help${location}`,
        }),
      });
    } catch {
      // Discord notification is best-effort; don't fail the request
    }
  }

  // Future: query ara.so with prompt + table + staff/events context
  void prompt;
  void table;
  void staff;
  void events;

  return Response.json({ message: "help requested" });
}
