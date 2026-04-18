import ara_sdk as ara


@ara.tool
def get_connectivity_data() -> dict:
    """Fetch the latest connectivity metrics for all rooms from the ngrok tunnel."""
    import os, urllib.request, json
    ngrok_url = "https://breeding-eclair-fall.ngrok-free.dev"
    headers = {"ngrok-skip-browser-warning": "true"}
    req = urllib.request.Request(f"{ngrok_url}/speed", headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        return {"rooms": json.loads(resp.read())}


@ara.tool
def get_discord_channels() -> dict:
    """List all Discord channels so you can find the one closest to 'connectivity'."""
    import urllib.request, json
    ngrok_url = "https://breeding-eclair-fall.ngrok-free.dev"
    guild_id = "1495129449165754508"
    headers = {"ngrok-skip-browser-warning": "true"}
    req = urllib.request.Request(f"{ngrok_url}/channels/{guild_id}", headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        channels = json.loads(resp.read())
    return {"channels": [{"id": c["id"], "name": c["name"]} for c in channels]}


@ara.tool
def send_discord_message(channel_id: str, content: str) -> dict:
    """Post a message to the given Discord channel."""
    import urllib.request, json
    ngrok_url = "https://breeding-eclair-fall.ngrok-free.dev"
    body = json.dumps({"channelId": channel_id, "content": content}).encode()
    req = urllib.request.Request(
        f"{ngrok_url}/send-message",
        data=body,
        headers={"ngrok-skip-browser-warning": "true", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


ara.Automation(
    "connectivity-monitor",
    system_instructions="""
You monitor hackathon venue connectivity and alert the team on Discord.

Steps every run:
1. Call get_connectivity_data to fetch latency metrics for all rooms.
2. Call get_discord_channels to get the channel list, then pick the channel
   whose name most closely matches "connectivity" (exact or partial match first,
   otherwise closest string similarity).
3. Analyze the room data:
   - Compute each room's average latency across all probe URLs.
   - Flag any room where avg latency > 500ms or any probe is unreachable as HIGH strain.
   - Flag 300–500ms avg as MODERATE strain.
   - Note rooms with consistently slow single targets (potential site-specific issues).
4. Post ONE concise message to that channel summarising:
   - A status line per room (✅ ok / ⚠️ moderate / 🔴 high strain) with avg ms.
   - Any notable patterns (e.g. "Room 3: all sites slow — likely local network issue").
   - Overall venue health in one sentence.

Keep the message under 400 characters. Use plain text, no markdown headers.
""",
    tools=[get_connectivity_data, get_discord_channels, send_discord_message],
)
