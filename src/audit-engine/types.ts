export interface ToolInput {
  toolName: string;
  plan: string;
  monthlySpend: number;
  seats: number;
  teamSize: number;
  primaryUseCase: string;
}

export interface PlanConfig {
  name: string;
  pricePerSeat: number;
  maxSeats?: number;
  minSeats?: number;
}

export interface ToolConfig {
  name: string;
  plans: PlanConfig[];
  category: string;
}

export interface Recommendation {
  recommendedPlan: string;
  recommendedTool: string;
  reasoning: string;
  estimatedNewMonthlyCost: number;
}

export interface AuditResult {
  toolName: string;
  currentSpend: number;
  recommendedPlan: string;
  recommendedTool: string;
  monthlySavings: number;
  annualSavings: number;
  reasoning: string;
}

export interface AuditReport {
  totalCurrentMonthlySpend: number;
  totalNewMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  results: AuditResult[];
  aiSummary?: string;
}
