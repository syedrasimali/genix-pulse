const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_URL = "https://api.lovable.dev/v1/chat/completions";

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

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are a B2B Lead Generation Expert focused on REAL COMPANIES and IDEAL CUSTOMER PROFILES (ICP).

RULES:
- Focus on REAL companies that are likely to exist in the given industry and location
- Generate TARGET ROLES within those companies (not personal names)
- Keep everything ethical and realistic
- Leads should be usable for outreach research

OUTPUT: Return ONLY a valid JSON array (no markdown, no explanation) with 5-8 objects, each having:
{
  "company_name": "Real company name",
  "company_website": "likely website URL",
  "industry": "specific industry",
  "location": "city/country",
  "target_role": "specific job title to target",
  "decision_maker_type": "C-Level/VP/Director/Manager",
  "pain_point": "specific business problem they likely face",
  "why_they_need_service": "why this service solves their problem",
  "where_to_find_them": "LinkedIn / Company Website / Google",
  "linkedin_search_hint": "Search: [Role] at [Company]",
  "personalized_outreach_message": "short natural outreach message",
  "email_subject": "compelling email subject line",
  "email_body": "professional cold email body (2-3 paragraphs)"
}`;

    const userPrompt = `Generate B2B leads with these parameters:
- Industry: ${industry}
- Target Role: ${role}
- Location: ${location || 'Global'}
- Target Audience: ${audience || 'Decision makers'}
- Service/Product: ${service}

Return ONLY the JSON array, no other text.`;

    const response = await fetch(LOVABLE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate leads' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse JSON from the response (handle markdown code blocks)
    let leads;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        leads = JSON.parse(jsonMatch[0]);
      } else {
        leads = JSON.parse(content);
      }
    } catch {
      console.error('Failed to parse AI response:', content);
      return new Response(
        JSON.stringify({ error: 'Failed to parse generated leads' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
