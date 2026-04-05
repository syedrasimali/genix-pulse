const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeneratedLead {
  company_name: string;
  company_website: string;
  industry: string;
  location: string;
  target_role: string;
  decision_maker_type: string;
  pain_point: string;
  why_they_need_service: string;
  where_to_find_them: string;
  linkedin_search_hint: string;
  personalized_outreach_message: string;
  email_subject: string;
  email_body: string;
}

const generateSampleLeads = (industry: string, role: string, location: string, service: string): GeneratedLead[] => {
  const companies = [
    { name: "TechFlow", type: "Tech", city: "San Francisco", email: "@techflow.io" },
    { name: "GlobalTrade Inc", type: "Trading", city: "New York", email: "@globaltrade.com" },
    { name: "ImportHub", type: "Import", city: "Los Angeles", email: "@importhub.com" },
    { name: "TradeFlow Solutions", type: "Trading", city: "Chicago", email: "@tradeflow.io" },
    { name: "DataFlow Systems", type: "Tech", city: "Boston", email: "@dataflow.com" },
    { name: "CloudNine Corp", type: "Tech", city: "Seattle", email: "@cloudnine.io" },
  ];

  const roles = ["Director", "VP", "Manager", "CEO", "Head of Operations", "Head of Sales"];
  const painPoints = [
    "Inefficient lead generation process",
    "Low conversion rates on outreach",
    "Team scaling challenges",
    "Manual data entry bottlenecks",
    "Limited visibility into sales pipeline"
  ];

  return companies.slice(0, 5).map((company, idx) => ({
    company_name: company.name,
    company_website: `https://${company.name.toLowerCase().replace(/\s/g, '')}.com`,
    industry: industry || company.type,
    location: location || company.city,
    target_role: roles[idx % roles.length],
    decision_maker_type: ["VP", "Director", "C-Level"][idx % 3],
    pain_point: painPoints[idx % painPoints.length],
    why_they_need_service: `Our ${service} helps ${company.name} improve their operations and revenue`,
    where_to_find_them: "LinkedIn",
    linkedin_search_hint: `Search: "${roles[idx % roles.length]}" at "${company.name}"`,
    personalized_outreach_message: `Hi, I noticed ${company.name} is in the ${industry} space. We help companies like yours with ${service}. Would you be open to a quick chat?`,
    email_subject: `Quick idea for ${company.name}'s ${role}`,
    email_body: `Hi Team,\n\nI've been impressed by ${company.name}'s growth in the ${industry} industry. We help similar companies enhance their operations using ${service}.\n\nWould you be interested in exploring how we could support your team?\n\nBest regards`
  }));
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { industry, role, location, audience, service } = await req.json();

    if (!industry || !role || !service) {
      return new Response(
        JSON.stringify({ error: 'Industry, role, and service are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate sample leads (no external API needed)
    const leads = generateSampleLeads(industry, role, location, service);

    return new Response(
      JSON.stringify({ leads }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
