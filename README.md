# Credex AI Spend Audit

**Live Demo:** [https://credex-jade.vercel.app/](https://credex-jade.vercel.app/)


A modern, production-ready SaaS application designed to help businesses audit, analyze, and optimize their spending on AI tools. By ingesting a company's current software stack, the proprietary Audit Engine identifies seat inefficiencies, recommends powerful alternatives, and uses Gemini AI to generate a personalized executive summary of potential savings.

## 🚀 Project Overview

The **AI Spend Audit** is a B2B SaaS tool built to capture high-value leads by offering immediate, data-driven value. Users input their current AI tool subscriptions (ChatGPT, Cursor, Claude, Midjourney, etc.), and the application instantly calculates potential annual savings by recommending optimized tiers or entirely different toolsets tailored to their specific workflows. 

The application features a viral growth loop: generating unique, private URLs for every audit, complete with dynamic OpenGraph images showcasing the user's total dollar savings to encourage social sharing.

## ✨ Key Features

- **Dynamic Form Engine:** Built with `react-hook-form` and `zod` for robust, type-safe lead capture and infinite-row tool inputs.
- **Deterministic Audit Engine:** A pure TypeScript logic engine that evaluates pricing models, team sizes, and use cases to mathematically determine the highest ROI toolset.
- **AI Executive Summary:** Integrates with the Google Gemini API (gemini-3.5-flash) to generate personalized executive summaries with graceful deterministic fallbacks.
- **Transactional Emails:** Automatically dispatches customized confirmation emails to leads upon submission using the Resend SDK.
- **Abuse Protection:** Features a hidden honeypot field and in-memory IP rate limiting to block automated bots without impacting real user UX.
- **Secure Data Persistence:** Backed by Supabase PostgreSQL. Row-Level Security (RLS) ensures lead data (emails, company names) remains strictly private.
- **Viral Social Sharing:** Next.js 15 Edge-rendered OpenGraph images (`next/og`) dynamically generate personalized 1200x630 social cards displaying the user's exact savings.
- **Automated Test Suite:** Comprehensive Vitest coverage for all core engine pricing calculations and recommendation logic.

## 📸 Screenshots

| Landing Page | Audit Form | Results Dashboard | Dynamic OG Image |
| :---: | :---: | :---: | :---: |
| ![Landing Page Placeholder](./docs/landing-placeholder.png) | ![Form Placeholder](./docs/form-placeholder.png) | ![Results Placeholder](./docs/results-placeholder.png) | ![OG Placeholder](./docs/og-placeholder.png) |

*(Note: Replace placeholders with actual UI screenshots)*

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui, Framer Motion
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **AI Generation:** Google Gemini (`@google/generative-ai`)
- **State Management:** Zustand (Client state), React Hook Form
- **Validation:** Zod
- **Testing:** Vitest

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/saas-starter.git
   cd saas-starter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add the following keys:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Gemini API
   GEMINI_API_KEY=your_gemini_api_key

   # Resend Email API
   RESEND_API_KEY=re_your_resend_key

   # Base URL (for absolute OG Image generation and email links)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Initialize Database:**
   Run the provided SQL schema in your Supabase SQL Editor to create the `audits` and `leads` tables with proper RLS policies. The SQL script can be found in `docs/supabase_schema.sql` (if saved) or generated during development.

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## ☁️ Deployment Guide

This project is optimized for deployment on Vercel.

1. Push your code to a GitHub repository.
2. Import the project into your Vercel dashboard.
3. Configure the following Environment Variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (Set this to your production domain, e.g., `https://audit.credex.com`)
4. Deploy! Next.js will automatically optimize the server components and the edge-rendered OpenGraph image route.

## 🏗️ Architecture Summary

- **Client Layer:** Rich interactive components (forms, animated charts, counters) are isolated as Client Components using `"use client"`.
- **Server Layer:** The API route (`/api/audit/route.ts`) handles the orchestration of the deterministic Audit Engine, the asynchronous Gemini API call, and the transactional Supabase database insert. 
- **Database Layer:** A strictly normalized structure separating `audits` (anonymous, public via UUID) and `leads` (private, linked via foreign key). RLS policies strictly enforce this boundary.

## ⚖️ Key Tradeoffs

- **Client vs Server State:** The initial audit calculation is performed optimistically on the client using the Audit Engine to provide instant UI feedback, while the API route re-calculates it securely on the server to prevent manipulation before database insertion. This duplicates logic execution but ensures both snappy UX and absolute data integrity.
- **Gemini AI vs Deterministic Fallback:** To ensure 100% reliability, the AI summary generation has a hardcoded timeout and fallback mechanism. If the Gemini API fails, rate-limits, or takes longer than 5 seconds, the system falls back to a deterministic string. Tradeoff: Some users may receive a slightly less personalized summary, but the core business metric (lead capture completion) is never blocked by a third-party LLM outage.
- **Edge OG Images:** The `/audit/[id]/opengraph-image.tsx` uses Node.js runtime instead of Edge runtime. Tradeoff: Slightly higher cold-start time for image generation, but guarantees absolute compatibility with the Supabase JS SDK and complex number formatting libraries without Edge polyfill headaches.
