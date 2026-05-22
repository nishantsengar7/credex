import { AuditResult, ToolInput, AuditReport } from "./types";
import { generateRecommendation } from "./rules";
import { annualize, calculateSavings } from "./utils";

export const analyzeToolSpend = (input: ToolInput): AuditResult => {
  const recommendation = generateRecommendation(input);
  
  const currentSpend = input.monthlySpend;
  const newSpend = recommendation.estimatedNewMonthlyCost;
  
  const monthlySavings = calculateSavings(currentSpend, newSpend);
  const annualSavings = annualize(monthlySavings);

  return {
    toolName: input.toolName,
    currentSpend,
    recommendedPlan: recommendation.recommendedPlan,
    recommendedTool: recommendation.recommendedTool,
    monthlySavings,
    annualSavings,
    reasoning: recommendation.reasoning,
  };
};

export const analyzeAllTools = (inputs: ToolInput[]): AuditReport => {
  let totalCurrentMonthlySpend = 0;
  let totalNewMonthlySpend = 0;
  
  const results = inputs.map((input) => {
    const result = analyzeToolSpend(input);
    
    totalCurrentMonthlySpend += result.currentSpend;
    totalNewMonthlySpend += (result.currentSpend - result.monthlySavings);
    
    return result;
  });

  const totalMonthlySavings = calculateSavings(totalCurrentMonthlySpend, totalNewMonthlySpend);
  const totalAnnualSavings = annualize(totalMonthlySavings);

  return {
    totalCurrentMonthlySpend,
    totalNewMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    results,
  };
};
