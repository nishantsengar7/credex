import { NextResponse } from 'next/server';
import { dbService } from '@/services/db';
import { analyzeAllTools } from '@/audit-engine/engine';
import { auditFormSchema } from '@/lib/validations/audit';
import { aiService } from '@/services/ai';

import { ZodError } from 'zod';
import { sendAuditConfirmationEmail } from '@/lib/email';

// Simple In-Memory Rate Limiter (Note: In a serverless environment like Vercel, this memory is per-instance, but still provides basic bot protection).
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_MAX = 5; // 5 requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export async function POST(request: Request) {
  try {
    // 0. Basic Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const rateData = rateLimitMap.get(ip);
    
    if (rateData) {
      if (now > rateData.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      } else {
        rateData.count++;
        if (rateData.count > RATE_LIMIT_MAX) {
          return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
          );
        }
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    const body = await request.json();
    
    // Validate input using Zod
    const validatedData = auditFormSchema.parse(body);

    // 0.5 Honeypot Check (Bot Protection)
    if (validatedData._contact_me_by_fax_only) {
      console.warn(`Honeypot triggered by IP: ${ip}`);
      // Return a fake success to fool the bot without saving to DB
      return NextResponse.json({ success: true, publicId: 'honeypot-trap-id' });
    }

    // 1. Generate Audit Report via engine
    const reportSummary = analyzeAllTools(validatedData.tools);

    // 2. Generate personalized AI summary
    const aiSummary = await aiService.generateAuditSummary(reportSummary, validatedData.company);
    reportSummary.aiSummary = aiSummary;

    // 2. Prepare lead data
    const leadData = {
      email: validatedData.email,
      company: validatedData.company,
      role: validatedData.role,
      teamSize: validatedData.companySize, // Map companySize to teamSize in db
    };

    // 3. Save to Supabase
    const result = await dbService.saveAuditAndLead({
      auditData: validatedData.tools,
      summary: reportSummary,
      lead: leadData,
    });

    if (!result.success) {
      console.error("Database save failed:", result.error);
      return NextResponse.json(
        { error: 'Failed to save audit to database.' },
        { status: 500 }
      );
    }

    // 4. Send Confirmation Email
    const hasHighSavings = reportSummary.totalAnnualSavings >= 5000;
    if (validatedData.email) {
      await sendAuditConfirmationEmail(validatedData.email, result.publicId, reportSummary);
    }

    return NextResponse.json({ 
      success: true, 
      publicId: result.publicId 
    });
    
  } catch (error) {
    console.error("API Audit Error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

