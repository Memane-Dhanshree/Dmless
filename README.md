<<<<<<< HEAD
# DmLess – Recruiter Dashboard

A production-ready React frontend for the DmLess SaaS recruiter management platform. Recruiters can manage jobs (Internships / Full-Time), hackathons, referrals, talent pool, and analytics.

## Tech Stack

- **React 18+** with Vite
- **TailwindCSS** (pastel color palette)
- **React Router v6**
- **React Context** for state
- **React Hook Form + Yup** for forms and validation
- **Recharts** for analytics (donut, line, bar)
- **TanStack React Table** for talent pool
- **Lucide React** for icons
- **react-hot-toast** for notifications

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Use the **Login** page with any email and password (min 8 characters) to enter the dashboard.

## Build

```bash
npm run build
npm run preview
```

## Features

- **Dashboard**: Jobs (Internships / Full-Time), Hackathons, Referrals card groups with summary metrics; cards are clickable and navigate to list pages.
- **Header**: Logo (→ Dashboard), notification bell with dropdown, profile dropdown (My Profile, Logout).
- **Sidebar**: Collapsible; Jobs (Internships, Full-Time), Hackathons, Referrals, Analytics, Talent Pool, Settings; Create → New Job, New Hackathon.
- **Jobs**: List with job cards, tabs (Shortlisted / Knockout / Analytics), copy link, Edit/Delete; Create Job 5-step flow with validation.
- **Hackathons**: List with tabs (Participants / Submissions / Analytics); Create Hackathon 3-step flow.
- **Referrals**: List with tabs (Total Referrals / Selected / Rejected); no public referral creation.
- **Analytics**: Jobs, Hackathons, Referrals overall and per-campaign (donut, trends).
- **Talent Pool**: Filters (Section, Position, Search), candidate table, Add to Campaign.
- **Settings**: Company Info, Email Templates, Billing.
- **Profile**: Name, Email (read-only), Phone, Change Password (current, new, confirm) with validation.

All dynamic data is driven by placeholder data and context; replace with real API calls as needed.
=======
# Dmless
Dmless Recruiter Dashboard (Frontend)
>>>>>>> 4bd02b340b63a6e9f32d860031cc3b3a4aeb6dc9
