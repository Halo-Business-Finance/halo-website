import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Curated list of all website pages
const SITE_PAGES = [
  { slug: 'home', title: 'Home' },
  { slug: 'sba-7a-loans', title: 'SBA 7(a) Loans' },
  { slug: 'sba-504-loans', title: 'SBA 504 Loans' },
  { slug: 'sba-express-loans', title: 'SBA Express Loans' },
  { slug: 'commercial-loans', title: 'Commercial Loans' },
  { slug: 'equipment-financing', title: 'Equipment Financing' },
  { slug: 'working-capital', title: 'Working Capital' },
  { slug: 'business-line-of-credit', title: 'Business Line of Credit' },
  { slug: 'bridge-financing', title: 'Bridge Financing' },
  { slug: 'conventional-loans', title: 'Conventional Loans' },
  { slug: 'cmbs-loans', title: 'CMBS Loans' },
  { slug: 'portfolio-loans', title: 'Portfolio Loans' },
  { slug: 'construction-loans', title: 'Construction Loans' },
  { slug: 'heavy-equipment', title: 'Heavy Equipment' },
  { slug: 'medical-equipment', title: 'Medical Equipment' },
  { slug: 'factoring-based-financing', title: 'Factoring Based Financing' },
  { slug: 'capital-markets', title: 'Capital Markets' },
  { slug: 'industry-solutions', title: 'Industry Solutions' },
  { slug: 'how-it-works', title: 'How It Works' },
  { slug: 'marketplace-benefits', title: 'Marketplace Benefits' },
  { slug: 'nmls-compliance', title: 'NMLS Compliance' },
  { slug: 'privacy-policy', title: 'Privacy Policy' },
  { slug: 'terms-of-service', title: 'Terms of Service' },
  { slug: 'cfipa', title: 'CFIPA' },
  { slug: 'accessibility', title: 'Accessibility' },
  { slug: 'sitemap', title: 'Sitemap' },
  { slug: 'brokers', title: 'Brokers' },
  { slug: 'lenders', title: 'Lenders' },
  { slug: 'referral-partners', title: 'Referral Partners' },
  { slug: 'company-overview', title: 'Company Overview' },
  { slug: 'company-licenses', title: 'Company Licenses' },
  { slug: 'resources', title: 'Resources' },
  { slug: 'careers', title: 'Careers' },
  { slug: 'customer-service', title: 'Customer Service' },
  { slug: 'technical-support', title: 'Technical Support' },
  { slug: 'loan-calculator', title: 'Loan Calculator' },
  { slug: 'usda-bi-loans', title: 'USDA B&I Loans' },
  { slug: 'usda-rural-development', title: 'USDA Rural Development' },
  { slug: 'contact-us', title: 'Contact Us' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Verify admin authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.substring(7);
    
    // Validate admin token via admin-auth
    const authResponse = await fetch(`${SUPABASE_URL}/functions/v1/admin-auth`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'profile', token }),
    });

    if (!authResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid admin token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authData = await authResponse.json();
    if (!authData.success) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - admin verification failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Admin verified, starting CMS import...');

    let totalCreated = 0;
    let totalSkipped = 0;

    // Process each page
    for (const page of SITE_PAGES) {
      // Check existing content for this page
      const { data: existingContent } = await supabase
        .from('cms_content')
        .select('section_name, content_key')
        .eq('page_slug', page.slug);

      const existingKeys = new Set(
        existingContent?.map(c => `${c.section_name}:${c.content_key}`) || []
      );

      // Define minimal content entries for each page
      const contentEntries = [
        {
          page_slug: page.slug,
          section_name: 'hero',
          content_key: 'title',
          content_value: { text: page.title },
          content_type: 'text',
        },
        {
          page_slug: page.slug,
          section_name: 'hero',
          content_key: 'subtitle',
          content_value: { text: `Welcome to ${page.title}` },
          content_type: 'text',
        },
        {
          page_slug: page.slug,
          section_name: 'header',
          content_key: 'title',
          content_value: { text: page.title },
          content_type: 'text',
        },
        {
          page_slug: page.slug,
          section_name: 'header',
          content_key: 'description',
          content_value: { text: `Learn more about ${page.title}` },
          content_type: 'text',
        },
      ];

      // Insert only missing entries
      const newEntries = contentEntries.filter(
        entry => !existingKeys.has(`${entry.section_name}:${entry.content_key}`)
      );

      if (newEntries.length > 0) {
        const { error: insertError } = await supabase
          .from('cms_content')
          .insert(newEntries);

        if (insertError) {
          console.error(`Error inserting content for ${page.slug}:`, insertError);
          totalSkipped += newEntries.length;
        } else {
          totalCreated += newEntries.length;
          console.log(`Created ${newEntries.length} entries for ${page.slug}`);
        }
      } else {
        totalSkipped += contentEntries.length;
      }
    }

    // Log to audit trail
    await supabase.from('admin_audit_log').insert({
      admin_user_id: authData.user.id,
      action: 'cms_import',
      table_name: 'cms_content',
      new_values: {
        total_pages: SITE_PAGES.length,
        created: totalCreated,
        skipped: totalSkipped,
      },
    });

    console.log(`CMS import complete: ${totalCreated} created, ${totalSkipped} skipped`);

    return new Response(
      JSON.stringify({
        success: true,
        created: totalCreated,
        skipped: totalSkipped,
        totalPages: SITE_PAGES.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('CMS import error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
