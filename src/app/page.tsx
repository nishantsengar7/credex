import { ArrowRight, CheckCircle, Layout, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "Credex AI Spend Audit | Save Thousands on SaaS",
  description: "Identify wasted seats, discover cheaper alternatives, and generate an AI-powered executive summary of your software spend.",
  openGraph: {
    title: "Credex AI Spend Audit",
    description: "Identify wasted seats and discover cheaper alternatives for your AI software stack.",
    type: "website",
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)] bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

          <div className="container mx-auto px-4 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium mb-8 bg-muted/50 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Credex AI Audit Engine v2.0
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Stop overpaying for <br className="hidden md:block" />
              <span className="text-primary">AI software tools.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              Identify wasted seats, discover cheaper alternatives, and generate a personalized executive summary of your software spend in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/audit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
              >
                Start Free Audit
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-background border border-border px-8 py-4 rounded-lg font-medium hover:bg-muted transition-colors"
              >
                View Features
              </Link>
            </div>

            <div className="mt-16 text-sm text-muted-foreground flex items-center justify-center flex-wrap gap-6 opacity-70">
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" /> Deterministic Math</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" /> Gemini AI Engine</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" /> Absolute Privacy</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Actionable insights in seconds</h2>
              <p className="text-muted-foreground text-lg">{"Don't guess on SaaS spend. We mathematically calculate your optimal stack."}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="w-6 h-6 text-yellow-500" aria-hidden="true" />}
                title="Instant Analysis"
                description="Our local engine evaluates your stack instantly before you even submit your email."
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6 text-green-500" aria-hidden="true" />}
                title="Secure & Private"
                description="Your company data is strictly isolated using Supabase Row-Level Security."
              />
              <FeatureCard
                icon={<Layout className="w-6 h-6 text-blue-500" aria-hidden="true" />}
                title="Shareable Reports"
                description="Get a beautiful, dynamic dashboard with OpenGraph images to share with your CFO."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40 bg-background text-center md:text-left">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                S
              </div>
              <span className="font-semibold">Credex</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto md:mx-0">
              The ultimate tool for optimizing your software spend.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
              <li><Link href="/audit" className="hover:text-foreground">Start Audit</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border/40 text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} Credex. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-6 rounded-2xl border border-border bg-background hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-6 border border-border/50 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
