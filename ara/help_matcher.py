import ara_sdk as ara


@ara.tool
def get_unhandled_help_requests() -> dict:
    """Fetch all unhandled help requests submitted by hackers."""
    import urllib.request, json
    ngrok_url = "https://breeding-eclair-fall.ngrok-free.dev"
    req = urllib.request.Request(
        f"{ngrok_url}/help-requests",
        headers={"ngrok-skip-browser-warning": "true"},
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return {"requests": json.loads(resp.read())}


@ara.tool
def get_team() -> dict:
    """Fetch the hackathon team members with their specializations and current table locations."""
    import urllib.request, json
    ngrok_url = "https://breeding-eclair-fall.ngrok-free.dev"
    req = urllib.request.Request(
        f"{ngrok_url}/team",
        headers={"ngrok-skip-browser-warning": "true"},
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return {"team": json.loads(resp.read())}


@ara.tool
def get_discord_channels() -> dict:
    """List Discord channels to find the best one to post help dispatch messages."""
    import urllib.request, json
    ngrok_url = "https://breeding-eclair-fall.ngrok-free.dev"
    guild_id = "1495129449165754508"
    req = urllib.request.Request(
        f"{ngrok_url}/channels/{guild_id}",
        headers={"ngrok-skip-browser-warning": "true"},
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        channels = json.loads(resp.read())
    return {"channels": [{"id": c["id"], "name": c["name"]} for c in channels]}


@ara.tool
def send_discord_message(channel_id: str, content: str) -> dict:
    """Post a message to a Discord channel."""
    import urllib.request, json
    ngrok_url = "https://breeding-eclair-fall.ngrok-free.dev"
    body = json.dumps({"channelId": channel_id, "content": content}).encode()
    req = urllib.request.Request(
        f"{ngrok_url}/send-message",
        data=body,
        headers={
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


@ara.tool
def mark_request_handled(request_id: int) -> dict:
    """Mark a help request as handled so it won't be dispatched again."""
    import urllib.request, json
    ngrok_url = "https://breeding-eclair-fall.ngrok-free.dev"
    req = urllib.request.Request(
        f"{ngrok_url}/help-request/{request_id}/handled",
        data=b"{}",
        headers={
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
        },
        method="PATCH",
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


ara.Automation(
    "help-matcher",
    system_instructions="""
You dispatch hackathon help requests to the right team members on Discord.

Steps every run:
1. Call get_unhandled_help_requests. If there are none, stop — do nothing.
2. Call get_team to get all team members with their specializations and current table.
3. Call get_discord_channels and pick the channel whose name most closely matches
   "help" — exact match first, then any channel containing "help", then the
   channel with the most characters in common with "help". Fall back to the first
   text channel only if nothing resembles "help" at all.
4. For each unhandled request:
   a. Read the prompt and table fields.
   b. Match 1–2 team members whose specializations best fit the prompt content.
      Use keyword overlap: e.g. "React" or "frontend" → Ben Nakamura;
      "hardware" or "circuit" → Alice Chen; "ML" or "model" → Carla Diaz, etc.
   c. Build a short Discord message (under 300 chars):
      - Bold each matched member's name using **Name**
      - State what the hacker needs (paraphrase the prompt in ≤10 words)
      - State where to go: "Table X" if the table field is set, else "check with organizers"
      Example: "**Ben Nakamura** **Eva Torres** — hacker needs React help → Table B3"
   d. Call send_discord_message with that message.
   e. Call mark_request_handled with the request's id.
5. After processing all requests, output a brief summary of what was dispatched.
""",
    tools=[
        get_unhandled_help_requests,
        get_team,
        get_discord_channels,
        send_discord_message,
        mark_request_handled,
    ],
)
