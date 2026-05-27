# LLM Prompts & Engineering

This document details the LLM prompts utilized in the Credex AI Spend Audit platform, the design decisions behind them, and the iterations that failed during development.

## The Prompt

The prompt is executed inside the serverless API handler via the `aiService` ([ai.ts](file:///c:/Users/Admin/OneDrive/Desktop/aiusage/saas-starter/src/services/ai.ts)), querying the `gemini-pro` model:

```text
You are an expert SaaS procurement analyst. 
Analyze the following AI tool spend audit report and generate a personalized, highly professional executive summary.

Company Context: [Company Name / Context]
Total Current Spend: $[Current Spend]/mo
Optimized Spend: $[Optimized Spend]/mo
Total Annual Savings: $[Annual Savings]

Tool Swaps & Logic:
[List of recommended swaps, e.g., "- Swapped ChatGPT for Cursor Pro (Pro). Reason: Cursor provides dedicated code workflow ROI..."]

Requirements:
- Exactly 1 paragraph.
- Maximum 100 words.
- Tone should be authoritative, helpful, and concise.
- Mention the overspending/current spend.
- Mention the optimization opportunities and the total annual savings.
- Briefly touch on the most impactful tool recommendation.
- Do NOT use markdown headers or lists. Just plain text.
```

---

## Why We Wrote It This Way

1. **System Persona:** Defining the model as an `"expert SaaS procurement analyst"` instantly forces a formal, numbers-first, business-oriented tone, avoiding casual filler words.
2. **Context Isolation:** Injecting variables directly from the deterministic Audit Engine (total current spend, optimized spend, and reasoning) ensures the AI doesn't hallucinate numbers and stays grounded in the actual mathematical recommendations.
3. **Strict Constraints:**
   - **Exactly 1 paragraph / Maximum 100 words:** Essential to prevent layout breaks in the results dashboard UI. If the summary is too long, it pushes the interactive Recharts charts below the fold.
   - **No Markdown Headers or Lists:** Prevents rendering conflicts. Since the output is injected into a pre-styled Shadcn card component, markdown titles or bullet points look cluttered and ruin typography alignment.

---

## What We Tried That Didn't Work

1. **Allowing Freeform Markdown:** Initially, the prompt had no formatting constraints. The model frequently generated nested markdown headings (`### Financial Summary`) and bullet points. These created excessive vertical spacing and broken styles within the dashboard card.
2. **Generating Raw JSON Structure:** We tried prompting the model to output a structured JSON object separating the "Executive Summary" from "Next Steps". However, during periods of high latency or rate limits, the response would occasionally return truncated JSON or parsing errors (such as unescaped quotes or trailing commas), crashing the API route. Reverting to plain text with a regex filter was much more resilient.
3. **Conversational Greeting:** Without defining the persona, the model would output conversational intros (e.g., *"Hello! I have analyzed your stack..."*). This degraded the premium feel of the dashboard and felt generic.
