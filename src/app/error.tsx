"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="inline-flex p-4 rounded-full bg-destructive/10 mb-4">
          <AlertTriangle className="w-12 h-12 text-destructive" aria-hidden="true" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
        
        <p className="text-muted-foreground">
          {"We encountered an unexpected error. Don't worry, our team has been notified."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            variant="default" 
            onClick={() => reset()}
            className="w-full sm:w-auto"
          >
            Try again
          </Button>
          <Link href="/" passHref className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              Go back home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
