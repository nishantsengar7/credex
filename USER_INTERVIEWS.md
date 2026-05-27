# User Interview Notes

This document contains notes from three casual customer discovery conversations conducted with college friends running side projects and early startups.

---

## Interview 1: Sam (Co-Founder, 3-person student startup building a study-planner app)
* **Context:** College friend running a student side project. We chatted casually for 10 minutes over a Discord call.
* **Direct Quotes:**
  * *"Dude, we're literally broke, but we ended up paying $50 a month for ChatGPT Team because we thought we needed it to work together. Turns out we don't even use the team workspace sharing things."*
  - *"If I see a form that asks for corporate finance data, I'm closing the tab immediately. We're just three guys in a dorm, we don't have a 'VP of Operations'."*
  - *"Honestly, if your tool can tell me exactly how to get the same API credits without paying the flat $20 user subscription fee, I'd use it every day."*
* **Most Surprising Thing:** Sam admitted that to save $20, they actually share a single ChatGPT Plus account password between two of them, even though it constantly logs one of them out due to simultaneous session limits.
* **What It Changed In Design:** This made me realize the input form shouldn't look like a corporate enterprise tool. I updated the Zod schema in `validations/audit.ts` to make the `company`, `role`, and `companySize` fields entirely optional, allowing student hackers to run the audit with just their tool list and an email.

---

## Interview 2: Alex (Solo developer building a SaaS analytics side project)
* **Context:** Former college class project partner. We did a quick 10-minute catch-up on Discord.
* **Direct Quotes:**
  * *"I'm paying for both Copilot and Cursor Pro right now because I forgot to cancel Copilot after switching. It's literally just sitting there charging my card every month."*
  - *"I don't care about nice-looking PDF reports. Just give me a quick list of what to cancel or downgrade and show me the total yearly savings in giant text."*
  - *"If a tool is free, don't show it as a recommendation to downgrade, because that's just annoying noise."*
* **Most Surprising Thing:** Alex was paying for two identical coding assistants (GitHub Copilot and Cursor Pro) at the same time simply because of auto-renewal forgetfulness.
* **What It Changed In Design:** I made the "Annual Savings" amount the primary, giant visual counter on the results dashboard. I also structured `rules.ts` so that if a tool has $0 savings (like a tool that is already on a free tier or optimal plan), it doesn't clutter the main recommendations feed.

---

## Interview 3: Priya (Developer at a 6-person student agency doing freelance web dev)
* **Context:** CS classmate who runs a small web dev agency with other graduates. We caught up over a coffee.
* **Direct Quotes:**
  * *"We have a shared 'company' card, but everyone just buys whatever AI subscription they want and expends it. It's a complete mess to track."*
  - *"I hate when tools tell me to switch from ChatGPT to Claude just because of writing. Our agency workflow is locked into OpenAI's API. A generic swap recommendation won't work for us."*
  - *"We have 6 people, but only 2 of us do actual coding. Recommending Cursor for the whole team is a waste of money."*
* **Most Surprising Thing:** Priya noted that even in a tiny 6-person team, different roles have completely different tool needs, and recommending a blanket "everyone swap to X" is a dealbreaker.
* **What It Changed In Design:** I ensured that the Audit Engine evaluates each tool row independently based on its specific `primaryUseCase` input, instead of applying a blanket company-wide recommendation. This allows them to keep Cursor for the 2 developers and Claude for the content creators.
