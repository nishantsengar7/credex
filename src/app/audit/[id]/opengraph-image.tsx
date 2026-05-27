import { ImageResponse } from 'next/og';
import { dbService } from '@/services/db';


export const alt = 'AI Spend Audit Results';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Since it's a dynamic image, we fetch the audit report
  // If it fails, we fall back to a generic image
  const { success, data } = await dbService.getAuditByPublicId(id);
  
  const savings = success && data ? data.summary.totalAnnualSavings : 0;
  const currentSpend = success && data ? data.summary.totalCurrentMonthlySpend : 0;
  
  // Format numbers nicely
  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          position: 'relative',
        }}
      >
        {/* Background decorative element */}
        <div 
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '60%',
            height: '80%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
          <div style={{ 
            fontSize: 48, 
            fontWeight: 800, 
            color: '#a1a1aa',
            marginBottom: 20,
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            AI Tool Spend Audit
          </div>
          
          <div style={{ 
            fontSize: 84, 
            fontWeight: 900, 
            textAlign: 'center', 
            lineHeight: 1.1,
            marginBottom: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex' }}>
              I just saved <span style={{ color: '#22c55e', marginLeft: 16 }}>{formatMoney(savings)}</span>
            </div>
            <div style={{ display: 'flex' }}>
              a year on AI tools!
            </div>
          </div>

          {currentSpend > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.05)',
              padding: '16px 32px',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ fontSize: 32, color: '#a1a1aa', marginRight: 16 }}>Current Spend:</span>
              <span style={{ fontSize: 40, fontWeight: 700, color: 'white' }}>{formatMoney(currentSpend)}/mo</span>
            </div>
          )}
        </div>

        <div style={{ 
          position: 'absolute', 
          bottom: 40, 
          display: 'flex', 
          alignItems: 'center',
          fontSize: 28,
          color: '#a1a1aa',
          fontWeight: 600
        }}>
          Powered by <span style={{ color: 'white', marginLeft: 8 }}>Credex</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
