import { notFound } from "next/navigation";
import { dbService } from "@/services/db";
import { ResultsDashboard } from "@/components/results-dashboard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuditResultPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: AuditResultPageProps) {
  const { id } = await params;
  
  if (!id) return { title: "Audit Not Found" };

  const { success, data } = await dbService.getAuditByPublicId(id);
  
  if (!success || !data) return { title: "Audit Not Found" };

  const savings = data.summary.totalAnnualSavings;
  const title = `I saved $${savings.toLocaleString()} on AI Tools!`;
  const description = "Check out my personalized AI Tool Spend Audit. See how you can optimize your software stack and save thousands of dollars.";
  
  // Use the APP_URL for absolute image path, fallback to localhost for dev
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const imageUrl = `${appUrl}/audit/${id}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'AI Spend Audit Results'
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    }
  };
}

export default async function AuditResultPage({ params }: AuditResultPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  // Fetch the audit report from Supabase by public_id
  const { success, data, error } = await dbService.getAuditByPublicId(id);

  if (!success || !data) {
    console.error("Failed to load audit:", error);
    notFound();
  }

  const report = data.summary;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20 pt-10">
      {/* Background styling elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
      
      <div className="container max-w-5xl mx-auto px-4 md:px-6">
        <div className="mb-8">
          <Link href="/audit" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Create a New Audit
          </Link>
        </div>
        
        <ResultsDashboard report={report} />
      </div>
    </div>
  );
}
