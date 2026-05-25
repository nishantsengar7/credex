import { NextResponse } from 'next/server';
import { dbService } from '@/services/db';
import { analyzeAllTools } from '@/audit-engine/engine';
import { auditFormSchema } from '@/lib/validations/audit';
import { aiService } from '@/services/ai';

import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input using Zod
    const validatedData = auditFormSchema.parse(body);

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

    return NextResponse.json({ 
      success: true, 
      publicId: result.publicId 
    });
    
  } catch (error) {
    console.error("API Audit Error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

