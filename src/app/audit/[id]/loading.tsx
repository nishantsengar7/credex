import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20 pt-10">
      {/* Background styling elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
      
      <div className="container max-w-5xl mx-auto px-4 md:px-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <h2 className="text-2xl font-bold text-foreground">Analyzing your stack...</h2>
          <p className="text-muted-foreground text-center max-w-md">
            We are crunching the numbers and generating your personalized AI executive summary. This should only take a few seconds.
          </p>
        </div>

        {/* Skeleton UI for Dashboard */}
        <div className="w-full mt-16 space-y-8 opacity-50 pointer-events-none">
          <div className="h-32 w-full max-w-2xl mx-auto bg-muted rounded-2xl animate-pulse"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-64 bg-muted rounded-2xl animate-pulse"></div>
            <div className="h-64 bg-muted rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
