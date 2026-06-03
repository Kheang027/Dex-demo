# Dex — AI Meeting Assistant

A front-end demo web app for **Dex**, an AI-powered meeting assistant designed for small businesses. Dex sits inside Microsoft Teams and answers business questions live during meetings by fetching real-time data from Xero and Shopify.

---

## Project Structure

```
Dex-demo/
├── index.html    — All HTML pages and structure
├── style.css     — All styles and CSS variables
├── script.js     — All interactivity and logic
└── README.md     — This file
```

---

## How to Run

No build tools, no frameworks, no installation required.

1. Open the `Dex-demo` folder
2. Double-click `index.html` to open it in your browser
3. That's it — the app runs fully in the browser

---

## Pages

The app has 5 pages navigated via the dot indicators at the bottom of the screen.

| Page | ID | Description |
|------|----|-------------|
| Landing | `p1` | Marketing landing page with hero, features, how it works, pricing, and footer |
| Sign Up | `p2` | Account creation form |
| Dashboard | `p3` | Overview stats, connected integrations, and meeting launcher |
| Live Meeting | `p4` | Full-screen meeting view with video grid, AI pipeline, and response panel |
| Summary | `p5` | Post-meeting Q&A log, pipeline recap, and stats |

---

## Key Features

### Navigation
- Fixed dot-bar at the bottom of the screen tracks the current page
- On app pages (Dashboard, Meeting, Summary), the Sign Up dot is hidden so users cannot navigate back to it
- The meeting page (page 4) hides the global dot-bar and uses its own inline dots instead

### Dashboard — Integration Selector
- Users must manually select **Xero**, **Shopify**, or both before starting a meeting
- The Start Meeting button is disabled (`opacity: 0.45, pointer-events: none`) until at least one source is selected
- Selecting a source enables the button and shows a confirmation hint

### Live Meeting — AI Pipeline Demo
Typing a question into the Dex panel and pressing **Ask** or **Enter** triggers a simulated 5-stage AI pipeline animation:

| Stage | Technology | Description |
|-------|-----------|-------------|
| 1 — ASR | Whisper | Speech recognised and transcribed |
| 2 — LLM | GPT-4 | Intent detected, query routed to correct data source |
| 3 — RAG | API Fetch | Live data fetched from Xero or Shopify API |
| 4 — MCP | Calculate | Derived metrics computed (growth %, runway days, avg order) |
| 5 — Reply | Teams | Answer delivered in the meeting |

### Keyword-Based Response Routing
Questions are matched by keyword to one of three demo responses:

| Keywords | Route | Response |
|----------|-------|----------|
| `revenue` (default) | Xero | $84,320 revenue, ▲ +12.4% vs March |
| `order`, `shopify` | Shopify | 1,204 orders, ▲ +8.2% vs March |
| `cash`, `runway` | Xero | $142,800 cash, 18 days runway |

### Meeting Timer
A live `HH:MM:SS` timer starts automatically when the meeting page is entered and resets each time.

---

## Tech Stack

| Technology | Usage |
|-----------|-------|
| HTML5 | Page structure and content |
| CSS3 | Styling, animations, CSS custom properties |
| Vanilla JavaScript | Navigation, interactivity, pipeline animation |
| Google Fonts | DM Sans (UI font), DM Mono (monospace/code labels) |

No frameworks. No libraries. No build step.

---

## CSS Architecture

All styles live in `style.css` using CSS custom properties defined in `:root`:

```css
--blue: #1a56a0;       /* Primary brand colour */
--blue-dk: #0f3d7a;    /* Darker blue for hover states */
--blue-lt: #e8f1fb;    /* Light blue for backgrounds */
--green: #16a34a;      /* Connected / success states */
--dark-deep: #0f0f1e;  /* Meeting page background */
--mono: "DM Mono", monospace;
```

Pages are shown/hidden using `.page { display: none }` and `.page.active { display: block }`. The Sign Up page (`#p2`) and Meeting page (`#p4`) use scoped ID selectors to override the default display with `flex` when active.

---

## JavaScript Functions

| Function | Description |
|----------|-------------|
| `go(n)` | Navigates to page `n`, updates dot states, manages nav-bar visibility, starts/stops timer |
| `toggleSource(id)` | Toggles a data source selection tile on the Dashboard, enables/disables the Start button |
| `startTimer()` | Starts the meeting duration counter |
| `stopTimer()` | Clears the meeting duration counter |
| `askDex()` | Reads the input, routes to the correct response, triggers pipeline animation and response display |
| `animatePipeline(r, cb)` | Steps through the 5 pipeline stages with 420ms delays, calls `cb` when complete |
| `resetPipeline()` | Clears all active/done states from pipeline steps |
| `initBars()` | Renders the mini bar chart inside the response box |

---

## Assignment Context

Built for **Foundation of AI — Assignment 3** (Bachelor Semester 2, 2025).

Dex demonstrates a practical application of the following AI concepts:
- **ASR** (Automatic Speech Recognition) — transcribing meeting speech in real time
- **LLM** (Large Language Model) — understanding question intent
- **RAG** (Retrieval-Augmented Generation) — fetching live data from external APIs
- **MCP** (Model Context Protocol) — running precise tool-based calculations
