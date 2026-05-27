# SaaS Unit Economics & Financial Projections
*Product: Credex AI Spend Audit*

This document breaks down the realistic unit economics for scaling the AI Spend Audit tool. Because this tool acts as a "Lead Magnet" (free to use in exchange for an email), the monetization model assumes we are upselling these qualified leads into a paid B2B SaaS platform (e.g., a continuous Spend Management dashboard at $99/mo).

---

## 🌪️ The Conversion Funnel

The Audit tool is engineered for high conversion by delaying the email gate until *after* the user has seen their hypothetical savings calculation optimistically, leveraging sunk-cost fallacy and curiosity.

| Funnel Stage | Metric | Conversion Rate | Notes |
| :--- | :--- | :--- | :--- |
| **Top of Funnel (Traffic)** | 10,000 Visitors | - | Driven via Social, Viral OG Images, SEO |
| **Began Audit (Intent)** | 4,000 Users | 40% | High conversion due to beautiful, instant UI |
| **Completed Audit (Lead)** | 1,200 Leads | 30% | Users who provided valid Email/Company info |
| **Sales Qualified Lead (SQL)** | 240 SQLs | 20% | Filtered: Startups with >10 employees |
| **Paid Customer (Closed)** | 24 Customers | 10% | Upsold to a $99/mo B2B SaaS subscription |

---

## 💰 Unit Economics (Per Lead & Customer)

### 1. Cost of Goods Sold (COGS) per Audit
- **Gemini API Cost:** ~$0.0005 per summary (using `gemini-pro` text generation).
- **Database & Hosting (Supabase/Vercel):** ~$0.001 per audit at scale.
- **Total COGS per Lead:** **$0.0015** (Practically zero).

### 2. Customer Acquisition Cost (CAC)
Assuming a blended acquisition model (Organic + Paid Ads on LinkedIn/Twitter at a $1.50 CPC).
- **Cost Per Click (CPC):** $1.50
- **Visits needed per Customer:** ~416 visits (10,000 / 24)
- **Blended CAC:** 416 * $1.50 = **$624**

### 3. Lifetime Value (LTV)
Assuming the upsold core SaaS product costs $99/month ($1,188/year).
- **Average Revenue Per User (ARPU):** $99 / mo
- **Monthly Churn Rate:** 3%
- **Average Lifespan:** ~33 Months (1 / 0.03)
- **LTV:** 33 * $99 = **$3,267**

### 4. LTV:CAC Ratio
- **Ratio:** $3,267 / $624 = **5.2x**
- *Insight:* A ratio > 3x is excellent for a B2B SaaS. Because the Audit Tool qualifies the leads heavily before they hit the sales pipeline, the closing rate is high, keeping the CAC well within profitable margins.

---

## 📊 12-Month ARR Projections (Spreadsheet Model)

*Assumptions: Traffic grows by 20% MoM due to the viral OpenGraph share loops. Conversion rates remain static.*

| Month | Unique Visitors | Leads Generated (12%) | New Customers (2% of Leads) | Cumulative Customers | MRR ($99/user) | ARR Run Rate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Month 1** | 5,000 | 600 | 12 | 12 | $1,188 | $14,256 |
| **Month 2** | 6,000 | 720 | 14 | 26 | $2,574 | $30,888 |
| **Month 3** | 7,200 | 864 | 17 | 43 | $4,257 | $51,084 |
| **Month 4** | 8,640 | 1,036 | 20 | 63 | $6,237 | $74,844 |
| **Month 5** | 10,368 | 1,244 | 24 | 87 | $8,613 | $103,356 |
| **Month 6** | 12,441 | 1,492 | 29 | 116 | $11,484 | $137,808 |
| ... | ... | ... | ... | ... | ... | ... |
| **Month 12** | ~37,000 | ~4,400 | ~88 | **~420** | **~$41,580** | **~$498,960** |

---

## 📈 Profitability Assumptions & Risks

### The "Free SaaS" Leverage
Because the marginal cost to run the Audit Engine and Gemini API is less than $0.01 per user, we can afford to leave the tool entirely free and ungated (no paywall). The financial viability of this model relies *entirely* on the back-end monetization (the $99/mo upsell). 

**The Lead Value:**
Even if a user does not convert to the $99/mo core product immediately, we acquire a highly qualified B2B email address for ~$5 (assuming paid ads). In B2B marketing, a verified email of a decision-maker (who just admitted they spend $5k+/mo on software) is routinely valued between $20 to $50.

### Scale Risks
1. **Gemini API Spikes:** If a viral post drives 50,000 audits in 24 hours, COGS temporarily spikes to ~$75, but rate limits will trigger. The architecture's deterministic fallback prevents the site from crashing, ensuring we still capture the leads even if the AI is throttled.
2. **Declining Share Rate:** The projections assume the viral loop holds steady. If the "Ego-Bait" of the OpenGraph images wears off, CAC will rise significantly as we have to rely more heavily on paid LinkedIn/Twitter ads.
