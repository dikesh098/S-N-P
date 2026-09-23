# Shri Sharda Maa Navratri Mahotsav — Community Platform

A complete, **₹0-cost** website and admin dashboard for a colony's Sharda Maa Navratri
celebration: festival history, yearly archive, daily programme, darshan, gallery, video
gallery, committee, volunteer registration, contributions, and announcements — all editable
from a private admin dashboard, no coding required after setup.

Built with **React + TypeScript + Vite + Tailwind CSS**, **Supabase** (free tier) for the
database/auth/storage, and deployed for free on **Vercel**.

---

## 1. What you get

- Public website in **English, Hindi and Marathi**
- Homepage with countdown, today's darshan, journey timeline, announcements, gallery teaser
- Full Navratri day-by-day schedule, cultural programs, photo & video gallery, committee,
  community activities, volunteer form, contribution page (UPI QR, no payment gateway), contact form
- `/qr` — a minimal page designed to be opened from a printed QR code at the pandal
- `/admin` — password-protected dashboard to manage every piece of content and view
  volunteer/contact submissions (never shown publicly)
- Zero paid services required to run the core site

---

## 2. Prerequisites (all free)

- A computer with internet access
- [Node.js](https://nodejs.org) 18 or newer
- A free [GitHub](https://github.com) account
- A free [Supabase](https://supabase.com) account
- A free [Vercel](https://vercel.com) account
- [VS Code](https://code.visualstudio.com) (recommended, optional)

---

## 3. Step-by-step setup

### Step 1 — Install Node.js
Download and install the LTS version from https://nodejs.org. Verify with:
```bash
node -v
npm -v
```

### Step 2 — Get the project onto your computer
If you received this as a folder, open a terminal inside it. If it's in GitHub:
```bash
git clone <your-repo-url>
cd sharda-navratri-platform
```

### Step 3 — Install dependencies
```bash
npm install
```

### Step 4 — Create a Supabase project
1. Go to https://supabase.com → **New project** (free tier is enough).
2. Once it's created, open **Project Settings → API**. You'll need the **Project URL**
   and the **anon public key** in the next step.

### Step 5 — Run the database schema
1. In Supabase, open the **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this project, copy the entire file, paste it into the
   editor, and click **Run**. This creates every table, storage bucket, and security policy.
   It's safe to re-run if needed.

### Step 6 — Configure environment variables
1. Copy `.env.example` to a new file named `.env`.
2. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Step 4.
   **Never** put the Supabase *service_role* key here — only the public *anon* key belongs
   in a frontend app.

### Step 7 — Start the development server
```bash
npm run dev
```
Open the printed local URL (usually `http://localhost:5173`) in your browser. Until you add
real content, you'll see clearly-marked sample/placeholder data — this is expected.

### Step 8 — Connect GitHub (for deployment)
```bash
git init
git add .
git commit -m "Initial commit"
```
Create a new empty repository on GitHub, then follow GitHub's instructions to push:
```bash
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

### Step 9 — Deploy to Vercel
1. Go to https://vercel.com → **Add New → Project** → import your GitHub repository.
2. Vercel auto-detects the Vite framework. Before deploying, open **Environment Variables**
   and add the same two variables from your `.env` file (`VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`).
3. Click **Deploy**. Your site will be live at `your-project.vercel.app` within a minute.

### Step 10 — Configure Supabase for your live URL
In Supabase → **Authentication → URL Configuration**, add your Vercel URL (and
`http://localhost:5173` for local development) to the allowed redirect URLs.

### Step 11 — Create your admin account
1. In Supabase → **Authentication → Users → Add user**, create yourself an account with
   an email and password (or send yourself a magic link — either works for logging in
   with email + password on the `/admin/login` page, as long as a password is set).
2. Back in **SQL Editor**, run this one line (with your real email), found at the bottom
   of `supabase/schema.sql`:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
3. Visit `/admin/login` on your site and sign in.

### Step 12 — Add your first festival year
In the dashboard, go to **Festival Years → Add Year**, enter the current year, a title,
the start/end dates, and tick "Mark as current year." This is what makes the homepage
countdown and today's programme work.

### Step 13 — Upload your first gallery photos
Go to **Gallery**, choose a year and category, and select photos to upload — they're
automatically resized and compressed so they stay well within Supabase's free storage.

### Step 14 — Publish your first event and announcement
Add entries under **Events** and **Announcements** — they appear on the site immediately.

You're done! From here, everything — festival years, daily programme, events,
announcements, gallery, videos, committee, community activities — is managed entirely
from `/admin`, in all three languages, without touching code.

---

## 4. Free core features vs. optional paid features later

**Everything below works at zero cost, indefinitely, on the free tiers used here:**
website hosting, database, authentication, image storage, the volunteer/contact forms,
the QR page, multilingual content, and the admin dashboard.

**Optional, only if you choose to add them later (not required):**
- A custom domain (e.g. `yourorg.org`) instead of `your-project.vercel.app`
- WhatsApp Business API for automated messaging (a simple click-to-chat link is included
  today, at no cost)
- A payment gateway for online contributions (this project intentionally displays UPI/bank
  details instead, with no gateway)
- Paid email delivery for form notifications (submissions are stored in Supabase and
  viewed from the dashboard instead)

Anthropic/Anthropic-hosted services, AI features, and any paid third-party API are
deliberately **not** part of the core platform.

---

## 5. Project structure

```
src/
  admin/       Admin dashboard pages and shared admin UI
  components/  Shared UI (navbar, footer, ornaments, cards, lightbox…)
  context/     Settings + auth React context
  lib/         Supabase client, API layer, demo data, i18n, utilities
  locales/     en.json / hi.json / mr.json — interface translations
  pages/       Public website pages
supabase/
  schema.sql   Full database schema, RLS policies, and storage bucket setup
```

## 6. Notes on free-tier limits

- Images are automatically resized (max ~1600px) and converted to WebP before upload.
- Gallery thumbnails are generated separately from full images to keep pages fast.
- Public list queries are paginated and cached briefly in the browser to reduce the
  number of requests against Supabase's free-tier limits.
- Videos are YouTube embeds only — no video files are stored in Supabase.

## 7. Common commands

```bash
npm run dev        # start local development server
npm run build       # type-check and build for production
npm run preview     # preview the production build locally
```
