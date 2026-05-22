import { Recommendation, ToolInput } from "./types";
import { getToolConfig } from "./pricing";
import { normalizeString, parsePlanName } from "./utils";

export const evaluateSeatLogic = (input: ToolInput): Recommendation | null => {
  const config = getToolConfig(input.toolName);
  if (!config) return null;

  const currentPlanType = parsePlanName(input.plan);
  const seats = input.seats;

  // ChatGPT specific logic
  if (config.name === "ChatGPT") {
    if (currentPlanType === "Team" && seats <= 2) {
      return {
        recommendedTool: "ChatGPT",
        recommendedPlan: "Plus",
        reasoning: "ChatGPT Team requires a minimum of 2 seats and is generally designed for larger collaboration. With only 1-2 seats, ChatGPT Plus provides identical capabilities at a lower cost.",
        estimatedNewMonthlyCost: seats * 20, // Plus is $20
      };
    }
  }

  // Cursor specific logic
  if (config.name === "Cursor") {
    if (currentPlanType === "Enterprise" || currentPlanType === "Business") {
      if (seats < 5) {
        return {
          recommendedTool: "Cursor",
          recommendedPlan: "Pro",
          reasoning: "Cursor Business/Enterprise is overkill for teams smaller than 5. Cursor Pro offers the same AI features without the enterprise SSO overhead.",
          estimatedNewMonthlyCost: seats * 20, // Pro is $20
        };
      }
    }
  }

  return null;
};

export const evaluateAlternatives = (input: ToolInput): Recommendation | null => {
  const config = getToolConfig(input.toolName);
  const useCase = normalizeString(input.primaryUseCase);
  
  if (useCase.includes("code") || useCase.includes("development")) {
    if (config && config.name !== "Cursor" && config.name !== "Windsurf") {
      return {
        recommendedTool: "Cursor",
        recommendedPlan: "Pro",
        reasoning: "For heavy coding workflows, dedicated AI IDEs like Cursor or Windsurf provide significantly higher ROI than general chatbots like ChatGPT or Claude.",
        estimatedNewMonthlyCost: input.seats * 20,
      };
    }
  }

  if (useCase.includes("write") || useCase.includes("copy")) {
    if (config && config.name === "ChatGPT") {
      return {
        recommendedTool: "Claude",
        recommendedPlan: "Pro",
        reasoning: "Claude 3.5 Sonnet/Opus consistently outperforms ChatGPT in long-form writing, tone adherence, and copywriting tasks.",
        estimatedNewMonthlyCost: input.seats * 20,
      };
    }
  }

  return null;
};

export const generateRecommendation = (input: ToolInput): Recommendation => {
  // Priority 1: Check seat/tier logic for immediate downgrades
  const seatRecommendation = evaluateSeatLogic(input);
  if (seatRecommendation) {
    // Ensure we are actually saving money
    if (seatRecommendation.estimatedNewMonthlyCost < input.monthlySpend) {
      return seatRecommendation;
    }
  }

  // Priority 2: Check for better alternative tools based on use case
  const alternativeRecommendation = evaluateAlternatives(input);
  if (alternativeRecommendation) {
    if (alternativeRecommendation.estimatedNewMonthlyCost <= input.monthlySpend) {
       return alternativeRecommendation;
    }
  }

  // Fallback: No better recommendation found or optimized already
  return {
    recommendedTool: input.toolName,
    recommendedPlan: input.plan,
    reasoning: "Current setup appears optimized for this tier and team size.",
    estimatedNewMonthlyCost: input.monthlySpend,
  };
};
