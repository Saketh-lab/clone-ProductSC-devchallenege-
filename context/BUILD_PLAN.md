# Netflix Clone — Build Plan for Cursor

Paste this whole file into Cursor as context (or keep it open in a tab) before you start prompting. Follow the prompts in order — don't skip ahead, and actually run/look at each step before moving to the next.

---

## Scope decision (read this first)

Given the deadline, **skip real authentication**. A full auth system (hashed passwords, sessions, a database) is a multi-hour distraction that isn't in the rubric. Instead:

- "Login" = a simple form (email + password inputs) that doesn't actually check credentials against anything real — just validates the fields aren't empty, then routes you to `/profiles`.
- This still *shows* the login screen (real layout, real UI) which is what "recreation" requires, without burning your night on auth infra.
- If you have spare time at the end, upgrade to real auth (NextAuth.js) as extra credit — not before the core 3 requirements are done.

**Flow overview:**
```
/  (landing/"Get Started" page)
   → /login → /profiles → /home → (click title) → modal opens → (click play) → playing state
                                        ↑
                                  search bar filters rows (data view requirement)
```

---

## Landing page — what it actually is on the real site

Before you ever hit a login form, Netflix shows you a **marketing landing page** at the root URL. This is a separate thing from the login page, and it's worth recreating because it's the actual first screen someone lands on (which is literally what the assignment's minimum bar #1 asks for: "the main screen someone lands on").

**What's actually on it, structurally:**

1. **Top bar** — Netflix logo (top-left), and on the top-right: a language dropdown (e.g. "English ▾") and a red "Sign In" button. This bar sits on top of the hero, transparent background.

2. **Hero section** — full-bleed background image/video (dark, dramatic — a collage of show/movie stills works fine, or just a dark gradient + subtle background image), centered/left-aligned text block:
   - Large heading: "Unlimited movies, TV shows and more"
   - Subheading: "Starts at $X.XX. Cancel anytime."
   - Smaller line: "Ready to watch? Enter your email to create or restart your membership."
   - **The "Get Started" form**: an email input + a red "Get Started >" button, side by side (this is the "get started thing" you mentioned)

3. **Below the fold** (optional, do this only if time remains after the core flow works): a few alternating sections — "Enjoy on your TV," "Download shows to watch offline," "Watch everywhere," "Create profiles for kids" — each with a short heading, description, and image/icon. These are static marketing sections, not interactive, so they're low priority.

**The actual navigation logic (this is the part that matters for your flow):**

- Clicking the top-right **"Sign In"** button → goes straight to `/login`.
- Typing an email into the **"Get Started"** input and clicking the button → in the real product this checks if the email exists and branches to either sign-up or sign-in. For your clone, don't build that branching logic — just have it navigate to `/login` too (optionally, pass the typed email along via a query param or state so the login page can pre-fill it — a nice small touch, not required).
- So structurally: two different entry points on the same landing page, both converging on `/login`. That convergence itself is worth deliberately building (not an accident) — it shows you understood the real flow rather than just slapping a button anywhere.

**Where this fits in your file structure:**

- This landing page becomes your root route: `app/page.tsx` (instead of redirecting `/` straight to `/login`, like the earlier version of this plan said — update that).
- `/login` stays a separate route, as already planned.

---

---

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind
- shadcn/ui for Dialog (modal), Button, Input
- Lucide icons
- TMDB API for real movie data (free, instant API key, no approval wait: https://www.themoviedb.org/settings/api)
- React `useState` for all flow state — no backend, no database
- Deploy: Vercel (last step)

---

## Step 0 — Project setup (do this yourself, not via Cursor prompt)

```bash
npx create-next-app@latest netflix-clone --typescript --tailwind --app
cd netflix-clone
npx shadcn@latest init
npx shadcn@latest add dialog button input
npm install lucide-react
```

Sign up for a free TMDB API key now: https://www.themoviedb.org/settings/api — you'll need it in Step 4.

Create a `.env.local` file:
```
TMDB_API_KEY=your_key_here
```

---

## Step 1 — Login page

**Prompt to paste into Cursor Composer:**

> Create `app/login/page.tsx`: a Netflix-style login page. Full-bleed dark background image (use a dark gradient/black background for now), centered black semi-transparent form card with "Sign In" heading, email input, password input, a red "Sign In" button (Netflix red is #E50914), and a "New to Netflix? Sign up now" link at the bottom. On submit, don't validate against any backend — just check both fields are non-empty, then use Next.js router to navigate to `/profiles`. Use shadcn Input and Button components, styled to match Netflix's dark theme.

Check it renders and the button navigates. (Note: `/` is now the landing page, not a redirect — see the Landing Page section above. Build that as its own step when you're ready.)

---

## Step 2 — Profiles page

**Prompt:**

> Create `app/profiles/page.tsx`: Netflix's "Who's watching?" profile selection screen. Dark background, centered "Who's watching?" heading, a horizontal row of 3-4 profile avatars (colored squares/icons are fine — use placeholder avatar images or colored divs with initials), each with a name label underneath, and a "Manage Profiles" style pencil icon avatar at the end (non-functional is fine). Clicking any profile avatar navigates to `/home`.

---

## Step 3 — Home page shell (layout only, no real data yet)

**Prompt:**

> Create `app/home/page.tsx`: Netflix's home page layout. Top nav bar (fixed/sticky, transparent-to-black on scroll) with Netflix logo on the left, nav links (Home, TV Shows, Movies, New & Popular, My List), and a search icon + profile icon on the right. Below the nav, a full-width hero banner section (large background image, title, description text, "Play" and "More Info" buttons). Below the hero, several horizontally-scrollable rows of movie/show cards (each row has a title like "Trending Now", "Continue Watching" etc, with a horizontal scroll of card thumbnails). Use placeholder colored divs for card images for now — we'll wire real data next. Match Netflix's dark theme, card hover behavior: scale up slightly on hover.

Run it, look at it, sanity check it against a real Netflix screenshot before moving on.

---

## Step 4 — Wire in real data (TMDB API)

**Prompt:**

> Create a function in `lib/tmdb.ts` that fetches popular movies from TMDB's `/movie/popular` endpoint using the API key from `process.env.TMDB_API_KEY`. Also add a function to fetch movies by genre for different rows (e.g. Action, Comedy, Documentary). Update `app/home/page.tsx` to be a server component (or use a client-side fetch) that populates each row with real TMDB movie data instead of placeholders — use the `poster_path` for card images (prefix with `https://image.tmdb.org/t/p/w500`).

This is your **"data view" foundation** — real data is now on screen.

---

## Step 5 — Search/filter (this satisfies the "data interaction" requirement)

**Prompt:**

> Add a search bar to the nav bar in `app/home/page.tsx`. When the user types, filter the currently displayed movies across all rows by title match (case-insensitive, client-side) and show a single "Search Results" row instead of the normal rows. Clearing the search restores the normal row view. Use React state to manage the search query and filtered results.

---

## Step 6 — Click title → modal detail (the core flow, part 1)

**Prompt:**

> In `app/home/page.tsx`, add click handling to movie cards: clicking a card sets a `selectedMovie` state and opens a shadcn Dialog (modal) showing that movie's backdrop image, title, overview/description (from TMDB data), release year, and two buttons: a red "Play" button and a "More Info" style secondary button. Closing the modal (backdrop click or X) clears `selectedMovie` and closes it.

---

## Step 7 — Play state (the core flow, part 2)

**Prompt:**

> When "Play" is clicked inside the movie detail modal, transition the modal (or replace it with a full-screen overlay) into a "playing" state: show a black video-player-style view with the movie's backdrop image as a static "frozen frame," a play/pause icon button that toggles, a progress bar that visually fills over time (fake it with a `setInterval` incrementing a percentage), and an X button top-left to exit back to the home page. This doesn't need real video — just convincing player UI and state.

This completes your required "full interactive flow": browse → click title → modal → play state.

---

## Step 8 (optional, only if time remains) — Deploy

```bash
npm install -g vercel
vercel
```
Follow the prompts, add your `TMDB_API_KEY` as an environment variable in the Vercel dashboard. Free, easy extra credit.

---

## Step 9 (optional, only if time remains) — Real auth

If you get here with time to spare, swap the fake login check for NextAuth.js with a credentials provider, or Clerk/Auth.js. Not required — don't attempt this before Steps 1–7 are solid.

---

## Notes for you to keep updating as you build

(Keep this section growing as a "why I built it this way" log — useful if anyone asks you to walk through your code)

- Login: ___
- Profile state: ___
- Modal state (`selectedMovie`): ___
- Search filter logic: ___
- Play state / progress bar: ___
