# Landing Page Copy

## Hero Headline
Stop Wasting Cash on AI Seats You Don't Use

## Subheadline
Instantly calculate duplicate seats, discover higher ROI alternatives, and generate a personalized SaaS spend audit in 30 seconds.

## Primary CTA
Start Free Audit

---

## Social Proof
*Note: The following customer testimonials are mocked for display demonstration purposes.*

> "We ran our 40-person engineering team's stack through this audit. Found out we were paying for duplicate Copilot and Cursor seats. Saved $3,200 a year in 1 click."
> — **Devendra S.**, CTO at ByteSync

> "Our marketing team was sitting on three unused ChatGPT Team licenses. This tool instantly caught the seat waste. Highly recommended."
> — **Neha P.**, Head of Operations at Kora AI

---

## Frequently Asked Questions (FAQ)

### 1. How does the calculation engine actually work?
Our engine is entirely rule-based. It matches your input tool names, active seats, and primary use cases against our verified database of major AI providers (like OpenAI, Claude, Cursor, and Copilot). It evaluates seat limits (e.g., downgrading ChatGPT Team to Plus if you have fewer than 2 users) and use cases (e.g., suggesting Cursor instead of general chatbots for engineering teams) to calculate your optimal monthly costs.

### 2. Is my company's data kept private?
Absolutely. We separate viral public dashboards from your private leads database using Supabase Row-Level Security (RLS). When you share a results link, the dashboard only exposes anonymous metrics (the tool categories, current spend, and calculated savings), keeping your personal name, role, and email strictly confidential and locked behind database read policies.

### 3. Do you use a third-party AI to calculate my savings?
No. The financial calculations and tool optimization logic are calculated deterministically on our server to ensure 100% accuracy. We only use Gemini AI to generate the plain-text personalized executive summary. If the Gemini API fails, rate-limits, or times out, we use a robust, pre-written mathematical fallback summary so you still get your results instantly.

### 4. Why do you ask for active seats and company size separately?
Startups often buy team plans with seat minimums (e.g., ChatGPT Team requires at least 2 seats; Cursor Business is best optimized at larger teams). Knowing your total company size alongside active seats helps our engine determine whether downgrading to a personal/individual tier makes sense or if your team size is too small for the SSO and enterprise overhead you're paying for.

### 5. How is my progress saved if I accidentally refresh the page?
We implement local storage auto-saving directly inside the audit wizard form. As you type, your selections are continuously saved to your browser's local cache. If you reload or lose internet access mid-form, all your configured tools will instantly restore when you reopen the page.
