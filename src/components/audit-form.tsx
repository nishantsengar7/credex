"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  DollarSign, 
  Users, 
  Briefcase, 
  Cpu, 
  Tag, 
  Calculator,
  ArrowRight
} from "lucide-react";

import { auditFormSchema, type AuditFormValues, aiToolOptions } from "@/lib/validations/audit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/utils";

const STORAGE_KEY = "ai-spend-audit-form";

export function AuditForm() {
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  const form = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema) as any,
    defaultValues: {
      tools: [
        { toolName: "", plan: "", monthlySpend: 0, seats: 1, teamSize: 1, primaryUseCase: "" },
      ],
      _contact_me_by_fax_only: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "tools",
    control: form.control,
  });

  // Watch for changes to calculate total spend
  const watchedTools = form.watch("tools");
  const totalMonthlySpend = useMemo(() => {
    return watchedTools.reduce((acc, tool) => {
      const spend = Number(tool.monthlySpend) || 0;
      return acc + spend;
    }, 0);
  }, [watchedTools]);

  // Load from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        form.reset(parsed);
      } catch (e) {
        console.error("Failed to parse saved audit form data", e);
      }
    }
  }, [form]);

  const router = useRouter();

  // Save to localStorage when form values change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = form.watch((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: AuditFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit audit');
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Clear form and localStorage after successful submission
      localStorage.removeItem(STORAGE_KEY);
      
      // Redirect to the public shareable URL
      router.push(`/audit/${result.publicId}`);
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      alert("Failed to save audit. Please try again.");
    }
  };

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 relative">
        
        {/* Total Spend Summary Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-primary/10 via-background to-background rounded-2xl p-8 border border-primary/20 shadow-lg shadow-primary/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>

          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
              <Calculator className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-1">Estimated Total Spend</h2>
              <div className="text-4xl md:text-5xl font-black tracking-tighter text-foreground flex items-baseline">
                ${totalMonthlySpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-lg font-medium text-muted-foreground ml-2">/ mo</span>
              </div>
            </div>
          </div>
          <div className="text-right sm:text-left bg-background/60 p-5 rounded-xl border border-border/50 backdrop-blur-md shadow-sm min-w-[200px]">
            <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Annual Projection</span>
            <span className="text-2xl font-bold text-foreground">
              ${(totalMonthlySpend * 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </motion.div>

        <div className="space-y-8">
          <AnimatePresence>
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className={cn(
                  "relative border transition-all duration-300 ease-in-out group",
                  "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 bg-background overflow-hidden"
                )}>
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  
                  <CardHeader className="pb-4 border-b border-border/50 bg-muted/20 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md">
                          {index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-lg tracking-tight">AI Tool Configuration</CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">Define usage and cost parameters</p>
                        </div>
                      </div>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors rounded-full"
                          onClick={() => remove(index)}
                          title="Remove Tool"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 relative z-10">
                    <FormField
                      control={form.control}
                      name={`tools.${index}.toolName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <Cpu className="w-4 h-4 text-primary" /> Tool Name
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background h-12 text-base transition-all hover:border-primary/50 focus:ring-primary/20">
                                <SelectValue placeholder="Select an AI tool" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {aiToolOptions.map((tool) => (
                                <SelectItem key={tool} value={tool} className="cursor-pointer">
                                  {tool}
                                </SelectItem>
                              ))}
                              <SelectItem value="Other">Other (Custom)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`tools.${index}.plan`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <Tag className="w-4 h-4 text-primary" /> Plan Tier
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Pro, Enterprise, Pay-as-you-go" className="bg-background h-12 text-base transition-all hover:border-primary/50 focus:ring-primary/20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`tools.${index}.monthlySpend`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <DollarSign className="w-4 h-4 text-primary" /> Total Monthly Spend
                          </FormLabel>
                          <FormControl>
                            <div className="relative group/input">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium group-focus-within/input:text-primary transition-colors">$</span>
                              <Input type="number" min="0" step="0.01" placeholder="0.00" className="pl-8 bg-background h-12 text-base transition-all hover:border-primary/50 focus:ring-primary/20" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`tools.${index}.seats`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <Users className="w-4 h-4 text-primary" /> Active Seats
                          </FormLabel>
                          <FormControl>
                            <Input type="number" min="1" className="bg-background h-12 text-base transition-all hover:border-primary/50 focus:ring-primary/20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`tools.${index}.teamSize`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Users className="w-4 h-4" /> Total Team Size
                          </FormLabel>
                          <FormControl>
                            <Input type="number" min="1" className="bg-background h-12 text-base transition-all hover:border-primary/50 focus:ring-primary/20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`tools.${index}.primaryUseCase`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <Briefcase className="w-4 h-4 text-primary" /> Primary Use Case
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Code generation, Copywriting" className="bg-background h-12 text-base transition-all hover:border-primary/50 focus:ring-primary/20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lead Capture Section */}
        <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Where should we send your results?</h3>
            <p className="text-sm text-muted-foreground">Enter your details to generate your customized audit report.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Work Email <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@company.com" className="bg-background h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corp" className="bg-background h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Your Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CTO, Engineering Manager" className="bg-background h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Total Company Size</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" placeholder="e.g. 50" className="bg-background h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Honeypot Field - Hidden from humans, traps bots */}
          <FormField
            control={form.control}
            name="_contact_me_by_fax_only"
            render={({ field }) => (
              <FormItem className="hidden absolute -z-50 opacity-0 pointer-events-none" aria-hidden="true">
                <FormLabel>Fax Number</FormLabel>
                <FormControl>
                  <Input autoComplete="off" tabIndex={-1} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-8 pt-4"
        >
          <Button
            type="button"
            variant="outline"
            className="w-full h-16 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground text-base rounded-2xl group"
            onClick={() => append({ toolName: "", plan: "", monthlySpend: 0, seats: 1, teamSize: 1, primaryUseCase: "" })}
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
              <Plus className="w-5 h-5 group-hover:text-primary" />
            </div>
            Add Another AI Tool
          </Button>

          <div className="flex justify-end pt-6 border-t border-border/40">
            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting} 
              className={cn(
                "w-full sm:w-auto h-14 px-10 text-base shadow-xl transition-all duration-300 rounded-xl",
                isSuccess ? "bg-green-500 hover:bg-green-600 shadow-green-500/20" : "shadow-primary/25 hover:scale-[1.02] hover:-translate-y-1"
              )}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : isSuccess ? (
                <Save className="w-5 h-5 mr-3" />
              ) : (
                <ArrowRight className="w-5 h-5 mr-3" />
              )}
              {isSubmitting ? "Finalizing Audit..." : isSuccess ? "Saved Successfully!" : "Submit Audit Report"}
            </Button>
          </div>
        </motion.div>
      </form>
    </Form>
  );
}
