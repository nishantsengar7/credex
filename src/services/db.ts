import { supabase } from "@/lib/supabase";
import { AuditReport, ToolInput } from "@/audit-engine/types";

export interface SaveAuditParams {
  auditData: ToolInput[];
  summary: AuditReport;
  lead: {
    email: string;
    company?: string;
    role?: string;
    teamSize?: number;
  };
}

export const dbService = {
  async saveAuditAndLead(params: SaveAuditParams) {
    try {
      // 1. Insert the Audit
      const { data: audit, error: auditError } = await supabase
        .from('audits')
        .insert({
          audit_data: params.auditData,
          summary: params.summary,
        })
        .select('id, public_id')
        .single();

      if (auditError) throw auditError;

      // 2. Insert the Lead
      if (params.lead.email) {
        const { error: leadError } = await supabase
          .from('leads')
          .insert({
            email: params.lead.email,
            company: params.lead.company,
            role: params.lead.role,
            team_size: params.lead.teamSize,
            audit_id: audit.id,
          });

        if (leadError) throw leadError;
      }

      return { success: true, publicId: audit.public_id };
    } catch (error) {
      console.error("Error saving audit:", error);
      return { success: false, error };
    }
  },

  async getAuditByPublicId(publicId: string) {
    try {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('public_id', publicId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching audit:", error);
      return { success: false, error };
    }
  }
};
