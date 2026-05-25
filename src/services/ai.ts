import { GoogleGenerativeAI } from "@google/generative-ai";
import { AuditReport } from "@/audit-engine/types";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const aiService = {
  async generateAuditSummary(report: AuditReport, company?: string): Promise<string> {
    const fallbackSummary = generateFallbackSummary(report, company);

    if (!genAI) {
      console.warn("No Gemini API Key found. Using fallback summary.");
      return fallbackSummary;
    }

    try {
      // Use gemini-pro for stable text generation
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `
        You are an expert SaaS procurement analyst. 
        Analyze the following AI tool spend audit report and generate a personalized, highly professional executive summary.
        
        Company Context: ${company ? company : 'A tech company'}
        Total Current Spend: $${report.totalCurrentMonthlySpend}/mo
        Optimized Spend: $${report.totalNewMonthlySpend}/mo
        Total Annual Savings: $${report.totalAnnualSavings}
        
        Tool Swaps & Logic:
        ${report.results.map(r => `- Swapped ${r.toolName} for ${r.recommendedTool} (${r.recommendedPlan}). Reason: ${r.reasoning}`).join('\n')}

        Requirements:
        - Exactly 1 paragraph.
        - Maximum 100 words.
        - Tone should be authoritative, helpful, and concise.
        - Mention the overspending/current spend.
        - Mention the optimization opportunities and the total annual savings.
        - Briefly touch on the most impactful tool recommendation.
        - Do NOT use markdown headers or lists. Just plain text.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();

      // Ensure no markdown headers sneak in
      text = text.replace(/^#+ /gm, '');

      return text || fallbackSummary;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return fallbackSummary;
    }
  }
};

function generateFallbackSummary(report: AuditReport, company?: string): string {
  const cName = company ? `for ${company}` : "for your organization";
  if (report.totalAnnualSavings > 0) {
    const topSwap = report.results.find(r => r.annualSavings > 0);
    const swapText = topSwap ? ` For example, migrating to ${topSwap.recommendedTool} immediately reduces overhead.` : "";
    return `Our analysis indicates significant overspending ${cName}. By optimizing your current AI tool stack—currently costing $${report.totalCurrentMonthlySpend}/month—you can achieve $${report.totalAnnualSavings} in annual savings. These optimizations involve eliminating redundant licenses and adopting more cost-effective alternatives tailored to your specific workflows.${swapText} We recommend implementing these changes to maximize your software ROI without sacrificing capability.`;
  } else {
    return `Your AI tool stack ${cName} is currently highly optimized at $${report.totalCurrentMonthlySpend}/month. Based on your team size and use cases, you are utilizing the most cost-effective plans available. We recommend continuing to monitor usage as your team scales to ensure costs remain efficient.`;
  }
}
