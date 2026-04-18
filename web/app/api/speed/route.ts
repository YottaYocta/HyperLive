const DISCORD_SERVICE_URL = process.env.DISCORD_SERVICE_URL ?? "http://localhost:3000";

export async function GET() {
  const res = await fetch(`${DISCORD_SERVICE_URL}/speed`, { cache: "no-store" });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
