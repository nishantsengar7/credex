"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  ArrowUpRight, 
  CheckCircle, 
  Copy, 
  Share2, 
  TrendingDown, 
  Zap,
  Lightbulb,
  Building,
  Sparkles,
  Loader2
} from "lucide-react";
import dynamic from 'next/dynamic';

// Lazy load heavy charting library
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

import { AuditReport } from "@/audit-engine/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/utils";

interface ResultsDashboardProps {
  report: AuditReport;
  onReset?: () => void;
}

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const spring = useSpring(0, { mass: 1, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => 
    `${prefix}${current.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}${suffix}`
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function ResultsDashboard({ report, onReset }: ResultsDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.href = "/audit";
    }
  };

  const handleNativeShare = async () => {
    const text = `I just saved $${report.totalAnnualSavings.toLocaleString()} a year on AI tools!\n\nGet your personalized AI spend audit via Credex here:`;
    const url = window.location.href;
    const imageUrl = `${url}/opengraph-image`;
    
    if (navigator.share) {
      setIsSharing(true);
      try {
        // Fetch the generated OG image as a blob
        const imageRes = await fetch(imageUrl);
        const blob = await imageRes.blob();
        const file = new File([blob], 'audit-results.png', { type: 'image/png' });

        const shareData: ShareData = {
          title: "AI Spend Audit Results",
          text: text,
          url: url,
        };

        // If the browser supports sharing files, attach the image directly!
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }

        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled or failed:", err);
      } finally {
        setIsSharing(false);
      }
    } else {
      // Fallback to copy link if native share isn't supported
      handleCopyLink();
    }
  };

  const chartData = [
    { name: "Current Spend", value: report.totalCurrentMonthlySpend, color: "#94a3b8" }, // muted
    { name: "Optimized Spend", value: report.totalNewMonthlySpend, color: "#22c55e" }, // green
  ];

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Hero Savings Section */}
      <section className="text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="inline-flex items-center justify-center p-3 bg-green-500/10 rounded-full mb-2"
        >
          <TrendingDown className="w-8 h-8 text-green-500" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          You can save <span className="text-green-500">
            <AnimatedCounter value={report.totalAnnualSavings} prefix="$" />
          </span> a year.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We analyzed your AI stack. By switching to optimized tiers and better alternatives, you can drastically reduce costs without losing capabilities.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Button variant="outline" onClick={handleCopyLink} className="gap-2" aria-label="Copy Report URL">
            {copied ? <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
            {copied ? "Copied!" : "Copy Report URL"}
          </Button>
          <Button variant="default" onClick={handleNativeShare} disabled={isSharing} className="gap-2" aria-label="Share Results">
            {isSharing ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Share2 className="w-4 h-4" aria-hidden="true" />}
            {isSharing ? "Preparing..." : "Share Results"}
          </Button>
        </div>
      </section>

      {/* AI Executive Summary */}
      {report.aiSummary && (
        <section>
          <Card className="bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> AI Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed text-lg font-medium">
                {report.aiSummary}
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Overview Cards & Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <Card className="bg-gradient-to-br from-green-500/5 to-transparent border-green-500/20 shadow-lg shadow-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Monthly Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-500">
                <AnimatedCounter value={report.totalMonthlySavings} prefix="$" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Current Monthly Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                <AnimatedCounter value={report.totalCurrentMonthlySpend} prefix="$" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Spend Comparison</CardTitle>
              <CardDescription>Visualizing your current vs optimized monthly expenditure</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }} 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #333', background: '#fff', color: '#000' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Credex CTA */}
      {report.totalAnnualSavings > 500 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-primary-foreground shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500">
            <Building className="w-48 h-48" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-yellow-300" /> Massive Savings Detected
            </div>
            <h2 className="text-3xl font-bold mb-4">Want to unlock these savings instantly?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Join Credex to automatically optimize your SaaS stack, issue virtual cards, and track expenses without lifting a finger.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg font-semibold">
              Get Started with Credex <ArrowUpRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {report.totalAnnualSavings < 100 && (
        <div className="bg-muted rounded-2xl p-6 text-center border border-border">
          <Lightbulb className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your stack is highly optimized!</h3>
          <p className="text-muted-foreground">
            {"You're already making great choices with your AI tools. Check Credex out if you ever need to scale your team's software procurement."}
          </p>
        </div>
      )}

      {/* Tool-by-Tool Breakdown */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Tool-by-Tool Breakdown</h2>
        <div className="grid gap-6">
          {report.results.map((result, i) => (
            <Card key={i} className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow">
              <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">{result.toolName}</h3>
                    <div className="bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
                      Current: ${result.currentSpend}/mo
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <div className="font-medium text-foreground line-through opacity-60">
                      {result.toolName}
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary" />
                    <div className="font-bold text-primary flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {result.recommendedTool} ({result.recommendedPlan})
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    <span className="font-semibold text-foreground">Why: </span>
                    {result.reasoning}
                  </p>
                </div>

                <div className="md:w-48 flex flex-col items-start md:items-end md:text-right shrink-0">
                  <span className="text-sm text-muted-foreground uppercase font-medium tracking-wide mb-1">Annual Savings</span>
                  <span className={cn(
                    "text-3xl font-bold", 
                    result.annualSavings > 0 ? "text-green-500" : "text-muted-foreground"
                  )}>
                    ${result.annualSavings}
                  </span>
                  {result.annualSavings > 0 && (
                    <span className="text-xs text-green-500/80 font-medium mt-1 bg-green-500/10 px-2 py-1 rounded-md">
                      -${result.monthlySavings}/mo
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <div className="pt-8 text-center border-t border-border/50">
        <Button variant="ghost" onClick={handleReset} className="text-muted-foreground">
          ← Back to Audit Form
        </Button>
      </div>
    </div>
  );
}
