import { AuditForm } from "@/components/audit-form";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "AI Spend Audit | SaaS Starter",
  description: "Track and analyze your organization's AI tool spend.",
};

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 selection:bg-primary/30">
      {/* Background glowing blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] opacity-50 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Audit</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            AI Tool Spend Audit
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {"Document and analyze your organization's expenditure on AI tools."} 
            Your progress is automatically saved to your browser locally.
          </p>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative bg-background/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 overflow-hidden">
            <div className="p-6 sm:p-10">
              <AuditForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
