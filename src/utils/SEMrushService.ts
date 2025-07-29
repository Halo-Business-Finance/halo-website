import { supabase } from "@/integrations/supabase/client";

export class SEMrushService {
  private static async getApiKey(): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('get-secret', {
        body: { name: 'SEMRUSH_API_KEY' }
      });
      
      if (error) {
        console.error('Error fetching SEMrush API key:', error);
        return null;
      }
      
      return data?.value || null;
    } catch (error) {
      console.error('Error getting SEMrush API key:', error);
      return null;
    }
  }

  // Domain Analytics
  static async getDomainOverview(domain: string) {
    const apiKey = await this.getApiKey();
    if (!apiKey) throw new Error('SEMrush API key not configured');

    const response = await fetch(
      `https://api.semrush.com/?type=domain_overview&key=${apiKey}&display_limit=10&export_columns=Dn,Rk,Or,Ot,Oc,Ad,At,Ac&domain=${domain}&database=us`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch domain overview');
    }
    
    return response.text();
  }

  // Keyword Rankings
  static async getKeywordRankings(domain: string, limit: number = 50) {
    const apiKey = await this.getApiKey();
    if (!apiKey) throw new Error('SEMrush API key not configured');

    const response = await fetch(
      `https://api.semrush.com/?type=domain_organic&key=${apiKey}&display_limit=${limit}&export_columns=Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc,Co,Nr,Td&domain=${domain}&database=us`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch keyword rankings');
    }
    
    return response.text();
  }

  // Backlink Analysis
  static async getBacklinks(domain: string, limit: number = 100) {
    const apiKey = await this.getApiKey();
    if (!apiKey) throw new Error('SEMrush API key not configured');

    const response = await fetch(
      `https://api.semrush.com/?type=backlinks&key=${apiKey}&display_limit=${limit}&export_columns=source_url,target_url,anchor,last_seen,source_title,target_title&target=${domain}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch backlinks');
    }
    
    return response.text();
  }

  // Position Tracking
  static async trackKeywords(keywords: string[], domain: string) {
    const apiKey = await this.getApiKey();
    if (!apiKey) throw new Error('SEMrush API key not configured');

    const keywordList = keywords.join('\n');
    
    const response = await fetch('https://api.semrush.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        type: 'positions_add',
        key: apiKey,
        domain: domain,
        keywords: keywordList,
        database: 'us'
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to add keywords for tracking');
    }
    
    return response.text();
  }

  // Competitor Analysis
  static async getCompetitors(domain: string, limit: number = 20) {
    const apiKey = await this.getApiKey();
    if (!apiKey) throw new Error('SEMrush API key not configured');

    const response = await fetch(
      `https://api.semrush.com/?type=domain_organic_competitors&key=${apiKey}&display_limit=${limit}&export_columns=Dn,Cr,Np,Ad,At,Ac,Or&domain=${domain}&database=us`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch competitors');
    }
    
    return response.text();
  }

  // Site Audit
  static async getSiteAuditData(domain: string) {
    const apiKey = await this.getApiKey();
    if (!apiKey) throw new Error('SEMrush API key not configured');

    const response = await fetch(
      `https://api.semrush.com/?type=site_audit_overview&key=${apiKey}&target=${domain}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch site audit data');
    }
    
    return response.text();
  }
}