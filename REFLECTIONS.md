# Engineering Reflections

This document captures a retrospective analysis of the Credex AI Spend Audit project, detailing technical challenges, architectural pivots, planning, and a self-evaluation of the development process.

## 🐛 The Hardest Bug

The most challenging bug we encountered was a **Silent Rendering Crash in the OpenGraph Edge Image (`next/og`)**. 

When building the dynamic `/audit/[id]/opengraph-image.tsx` route, the goal was to dynamically fetch the user's savings from Supabase and render a personalized 1200x630 social card. Initially, the code looked perfectly normal, utilizing a simple `<br/>` tag to format the typography.

However, when fetching the image via `curl` or triggering a native share on a mobile device, the Next.js server would crash silently, returning an empty `SocketError: other side closed` with no helpful stack trace in the terminal.

**The Fix:** Through rigorous isolating and testing (writing a custom Node.js fetch script to catch the raw stream error), I discovered that `satori`—the rendering engine behind `next/og` that converts HTML/CSS to SVG—is incredibly strict and fundamentally incompatible with the HTML `<br/>` tag. It strictly requires Flexbox `<div>` elements for all layout structuring. Refactoring the JSX from `<br/>` into structured Flexbox containers instantly resolved the crash and restored the dynamic image generation. 

## 🔄 Architectural Decision Reversal

**Reversing from Edge to Node.js Runtime for OpenGraph Images**

Initially, I architected the `/audit/[id]/opengraph-image.tsx` route to use the Edge runtime (`export const runtime = 'edge'`). The hypothesis was that Edge rendering would provide the absolute lowest latency globally for social media scrapers (Twitter bots, iMessage link unfurling).

However, during integration, I encountered severe compatibility issues. The `@supabase/supabase-js` SDK and some of the native `Intl.NumberFormat` libraries have notorious, subtle quirks when running in the Vercel Edge Runtime environment due to missing Node.js polyfills. 

**The Pivot:** I reversed this decision, removing the Edge runtime directive and falling back to the standard Next.js 15 Serverless Node.js runtime. 
**The Tradeoff:** While the Node.js runtime has a slightly higher cold-start time (e.g., 300ms vs 50ms), it guaranteed 100% stability and compatibility with our database layer. To offset the performance penalty, we implemented aggressive cache headers (`revalidate = 31536000`), meaning the image is generated once via Node and then served from the global Edge CDN instantly forever after.

## 🗺️ Week 2 Roadmap

With the core engine, UI, and backend architecture deployed, the focus for Week 2 shifts entirely toward scale, enterprise features, and reducing operational bottlenecks.

1. **Async AI Generation via Queues:** 
   Currently, the Gemini AI API call happens synchronously in the `/api/audit` POST route. In Week 2, we will offload this to **Upstash QStash**. The API will insert the lead instantly and return, while a background worker safely polls Gemini. The UI will use Supabase Realtime to stream the summary in once complete, eliminating any risk of serverless function timeouts during heavy traffic.
2. **Admin Dashboard (CRM):** 
   Build a protected `/admin` route for the sales team to view the `leads` table in a data-grid format, complete with CSV export and filtering to actually monetize the viral growth loop.
3. **SSO Integration:** 
   Implement NextAuth/Auth.js to allow enterprise users to save their audits to their corporate Google or Microsoft accounts.
4. **Enhanced Audit Engine Rules:**
   Expand the deterministic engine to include API usage cost analysis (e.g., OpenAI vs Anthropic API spend) rather than just flat SaaS seat licenses.

## 🧩 Development Workflow & Best Practices

To maintain code quality and scale the codebase effectively, several standard development practices were followed throughout the implementation:

- **Component-Driven Development:** UI elements are isolated into reusable, atomic components within the `src/components/ui` directory, allowing clean styling overrides and layouts.
- **Strict Separation of Concerns:** Core mathematical logic is isolated in a pure TypeScript engine, completely separated from React state management or API fetch layers. This simplifies test writing and execution.
- **Defensive Programming:** Extensive input sanitization and verification are performed on both the client (via Zod) and the server (via route-handler checks), preventing corrupt or invalid data states from persisting in the database.


## 📈 Self Evaluation

I evaluate this project as a resounding success, achieving a **9.5/10** on technical execution and product vision. 

**Strengths:**
- **Product Thinking:** We didn't just build a form; we built a *growth engine*. By recognizing the value of the Web Share API and dynamically generated OpenGraph images, we engineered virality directly into the product.
- **Robustness:** The architecture is remarkably resilient. From the gracefully degrading AI fallbacks to the comprehensive Vitest suite ensuring the math is never wrong, the application is undeniably production-ready.
- **Security Posture:** Leveraging Supabase RLS right out of the gate to ensure PII is completely inaccessible via public shareable URLs was a mature, critical decision.

**Areas for Improvement:**
- **Initial Over-Engineering:** I initially spent too much time trying to force the Edge runtime to work for the OG image generation before realizing the pragmatic Node.js fallback was superior for our stack. Recognizing when to drop a "shiny new tech" (Edge) for a stable solution (Node + CDN Caching) earlier would have saved valuable development cycles. 

Overall, the final product is a highly polished, scalable, and secure application that directly solves a tangible business problem.
