# Key Performance Metrics

This document outlines the core business and analytics metrics used to measure the success of the Credex AI Spend Audit platform as a high-intent B2B lead generation tool.

---

## 🎯 North Star Metric: Weekly Lead Capture Rate (LCR)
* **Definition:** The percentage of landing page visitors who successfully complete the audit form and submit their work email to generate their dashboard.
* **Why:** Because the AI Spend Audit is a free lead-generation tool, daily or weekly active user counts (DAU/MAU) are irrelevant. Users typically run an audit once and do not return. The primary goal is acquiring high-quality leads (founders, CTOs, and finance managers who want to reduce software burn) for the Credex corporate card pipeline. Maximizing LCR ensures we capture the maximum value from our traffic.

---

## 📈 Key Input Metrics
Three input metrics directly drive our North Star (LCR):
1. **Landing Page Bounce Rate (LPBR):** The percentage of visitors who leave the site without clicking "Start Free Audit" or inputting a tool. Reducing bounce rate ensures a larger pool enters the conversion funnel.
2. **Audit Wizard Completion Rate (AWCR):** The percentage of users who start inputting at least one tool row and successfully proceed to submit the final lead capture form (minimizing drop-off during data entry).
3. **Viral Share Invitation Rate (VSIR):** The percentage of users viewing their completed report dashboard who click the "Share Results" (Web Share API) or "Copy Report URL" buttons to share results with their CFOs or on social feeds. This drives organic referral loops.

---

## 🛠️ Analytics Instrumentation
To track these metrics, we instrument the following telemetry on launch:
* **Funnel Analytics (via PostHog):** We track the landing page hit, the first click to configure a tool, each additional tool row addition, the transition to the lead email card, and the final 200 response on `/api/audit`.
* **Share Event Listeners:** JavaScript event listeners on the dashboard share buttons to record clicks and determine which categories of savings (e.g., saving > $500/year) trigger the highest sharing rates.

---

## 🔄 Pivot Trigger Metrics
* **Pivot Trigger:** A **Lead Capture Rate (LCR) below 15%** or a **Viral Share Invitation Rate (VSIR) below 3%** over a 2-week period after capturing at least 500 unique landing page visitors.
* **The Pivot:** If the LCR is under 15%, it indicates that blocking the results dashboard behind an email lead form creates too much friction. We would pivot the UX from a "gateway lock" to a "freemium reveal": users would view their total calculated savings and comparative charts instantly without inputting an email, but the specific tool-by-tool recommendations (e.g., swapping to Cursor) and the Gemini executive summary would be locked behind the lead capture card.
