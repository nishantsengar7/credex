import { Resend } from 'resend';
import { AuditReport } from '@/audit-engine/types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAuditConfirmationEmail(
  toEmail: string,
  publicId: string,
  report: AuditReport
) {
  const auditUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/audit/${publicId}`;

  // Reverting to test sender until credex.com DNS records propagate and verify
  const fromEmail = 'onboarding@resend.dev'; 
  const hasHighSavings = report.totalAnnualSavings >= 5000;

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h1 style="color: #000;">Your AI Spend Audit is Ready!</h1>
      
      <p>Hi there,</p>
      
      <p>Thank you for using Credex to audit your AI tool stack. Your personalized audit report has been successfully generated and saved.</p>
      
      <div style="margin: 20px 0; padding: 20px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #0f172a;">Executive Summary</h3>
        ${report.aiSummary ? `<p style="font-size: 14px; line-height: 1.6; color: #475569;">${report.aiSummary}</p>` : ''}
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Current Monthly Spend</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #0f172a;">$${report.totalCurrentMonthlySpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Optimized Monthly Spend</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #10b981;">$${report.totalNewMonthlySpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-size: 16px; color: #0f172a; font-weight: bold;">Potential Annual Savings</td>
            <td style="padding: 10px 0; text-align: right; font-size: 16px; font-weight: bold; color: #10b981;">$${report.totalAnnualSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
        </table>
      </div>

      <div style="margin: 30px 0; text-align: center;">
        <a href="${auditUrl}" style="background-color: #0f172a; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
          View Full Interactive Dashboard
        </a>
      </div>
      
      ${hasHighSavings ? `
      <div style="margin: 30px 0; padding: 15px; border-left: 4px solid #3b82f6; background-color: #eff6ff;">
        <strong>Note from the Credex Team:</strong><br/>
        We noticed you have significant potential savings identified in your report. Our team at Credex will reach out to you directly shortly to discuss how we can help you optimize your stack and secure these savings!
      </div>
      ` : `
      <p style="color: #64748b; font-size: 14px;">
        If you have any questions about optimizing your AI tools, feel free to reach out to us at any time.
      </p>
      `}
      
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
      
      <p style="font-size: 12px; color: #94a3b8;">
        Sent by Credex AI Spend Auditor<br/>
        You are receiving this because you requested an audit report on our website.
      </p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: `Credex <${fromEmail}>`,
      to: [toEmail],
      subject: 'Your AI Spend Audit Results 📊',
      html: htmlContent,
    });

    if (error) {
      console.error('Failed to send Resend email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending exception:', error);
    return { success: false, error };
  }
}
