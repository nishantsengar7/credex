import * as z from "zod";

export const aiToolOptions = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "OpenAI API",
  "Anthropic API",
  "Gemini",
  "Windsurf",
] as const;

export const toolEntrySchema = z.object({
  toolName: z.string().min(1, "Tool name is required"),
  plan: z.string().min(1, "Plan is required"),
  monthlySpend: z.coerce.number().min(0, "Spend must be a positive number"),
  seats: z.coerce.number().min(1, "Must have at least 1 seat"),
  teamSize: z.coerce.number().min(1, "Team size must be at least 1"),
  primaryUseCase: z.string().min(1, "Use case is required"),
});

export const auditFormSchema = z.object({
  tools: z.array(toolEntrySchema).min(1, "Please add at least one tool to audit"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  role: z.string().optional(),
  companySize: z.coerce.number().min(1, "Company size must be at least 1").optional(),
  _contact_me_by_fax_only: z.string().optional(), // Honeypot field
});

export type ToolEntry = z.infer<typeof toolEntrySchema>;
export type AuditFormValues = z.infer<typeof auditFormSchema>;
