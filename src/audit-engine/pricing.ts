import { ToolConfig } from "./types";

export const PRICING_DB: Record<string, ToolConfig> = {
  chatgpt: {
    name: "ChatGPT",
    category: "writing",
    plans: [
      { name: "Free", pricePerSeat: 0 },
      { name: "Plus", pricePerSeat: 20, maxSeats: 1 },
      { name: "Team", pricePerSeat: 25, minSeats: 2 },
      { name: "Enterprise", pricePerSeat: 60, minSeats: 150 }, // Estimated
    ],
  },
  claude: {
    name: "Claude",
    category: "writing",
    plans: [
      { name: "Free", pricePerSeat: 0 },
      { name: "Pro", pricePerSeat: 20 },
      { name: "Team", pricePerSeat: 30, minSeats: 5 },
    ],
  },
  cursor: {
    name: "Cursor",
    category: "coding",
    plans: [
      { name: "Free", pricePerSeat: 0 },
      { name: "Pro", pricePerSeat: 20 },
      { name: "Business", pricePerSeat: 40, minSeats: 1 },
    ],
  },
  githubcopilot: {
    name: "GitHub Copilot",
    category: "coding",
    plans: [
      { name: "Individual", pricePerSeat: 10 },
      { name: "Business", pricePerSeat: 19 },
      { name: "Enterprise", pricePerSeat: 39 },
    ],
  },
  windsurf: {
    name: "Windsurf",
    category: "coding",
    plans: [
      { name: "Free", pricePerSeat: 0 },
      { name: "Pro", pricePerSeat: 15 },
    ],
  },
};

export const getToolConfig = (toolName: string): ToolConfig | undefined => {
  const normalizedKey = toolName.toLowerCase().replace(/[\s-]/g, "");
  return PRICING_DB[normalizedKey];
};
