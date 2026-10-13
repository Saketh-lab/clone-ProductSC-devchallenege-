# PortPulse — Cross-Port Intelligence Dashboard

**Module 3 / Deliverable 4** sample dashboard design (ILLUSTRATIVE synthetic data).

Answers three questions across **11 ports**:

1. **Where do we stand?** — Network overview tiles, map, port table  
2. **What changed?** — Asset history, condition trends, side-by-side / profile  
3. **What happens next?** — Priority panel & review queue with explanations  

## Principles

- **One database** (`lib/data/store.ts`) — every screen reads the same stored fields so numbers never disagree.
- **Status and warnings are stored fields**, not recalculated in the UI.
- **Role switcher** demos Port engineer, Inspection team, Management, Platform admin capabilities.
- **Filters carry across screens** (port, berth, class, dates, status, severity, confidence).

## Screens

| Route | Screen |
|-------|--------|
| `/` | Network overview |
| `/ports` | Port & asset (elevation + evidence) |
| `/history` | Asset history |
| `/review` | Review queue |
| `/data-quality` | Data-quality centre |
| `/priorities` | Priority panel |
| `/reports` | Reports, alerts, audit |

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

Next.js (App Router) · TypeScript · Tailwind · Lucide · shadcn/ui primitives
