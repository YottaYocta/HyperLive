# HyperLive

Real-time operations platform for hackathons and live tech events.

---

## Screenshots

### App — Hero

![HyperLive hero](../web/HyperliveHero.jpg)

### App — Dashboard

![HyperLive dashboard demo](../web/Hyperlive%20demo.jpg)

### Help Request

![Help request page](../helprequest.png)

### Discord — Help Dispatch

![Discord help dispatch](../help.png)

### Connectivity — App View

![Connectivity dashboard](../appconnectivity.png)

### Connectivity — Discord Alert

![Discord connectivity alert](../connectivity.png)

### Admin — Team View

![Admin team view](../team.png)

---

## Demo Script

**The problem.**
Running a hackathon means hundreds of people in one room — participants stuck on problems, mentors scattered around, organizers with no visibility into what's breaking or who needs help. Everything is reactive, manual, and too slow.

**What HyperLive does.**
HyperLive is a real-time operations layer for live events. Participants open the dashboard, select their table, and describe what they need. That request is immediately stored and broadcast. An AI agent running on a cron job reads the queue, matches each request to the right mentor by expertise, and posts a targeted Discord message — by name, with the table number — so the right person knows exactly where to go. Meanwhile, a second agent continuously probes internet connectivity across all rooms in the venue, detects degraded connections, and posts automatic warnings to Discord before anyone has to notice and report it.

**The tech.**
- **Next.js** frontend with a shared React context store — state persists across tabs without a database.
- **Express** Discord bot exposing a REST API: help request queue, team roster, channel messaging, and connectivity data — all tunnelled publicly via ngrok.
- **Ara** AI agents: two automations running on cron schedules. One scans and dispatches help requests using tool calls to fetch the queue, match mentors, post to Discord, and mark requests handled. The other probes five URLs per room, computes average latency, and flags strain patterns in plain English.
- **WebGL shader pipeline** (Sequenza) renders an animated FBM noise field with pixellation and gradient mapping as the live background.
