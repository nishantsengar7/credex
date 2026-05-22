export const calculateSavings = (currentSpend: number, newSpend: number): number => {
  const savings = currentSpend - newSpend;
  return savings > 0 ? savings : 0;
};

export const annualize = (monthlyAmount: number): number => {
  return monthlyAmount * 12;
};

export const normalizeString = (str: string): string => {
  return str.trim().toLowerCase();
};

export const parsePlanName = (plan: string): string => {
  const normalized = normalizeString(plan);
  if (normalized.includes("pro")) return "Pro";
  if (normalized.includes("plus")) return "Plus";
  if (normalized.includes("team")) return "Team";
  if (normalized.includes("enterprise") || normalized.includes("business")) return "Enterprise";
  if (normalized.includes("free")) return "Free";
  return "Standard"; // Fallback
};
