
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, dateRange, searchSources } = await req.json()
    
    console.log('Search request:', { query, dateRange, searchSources })

    const results = []

    // People Data Labs Company Search
    if (searchSources.profile) {
      try {
        const pdlResponse = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/people-data-labs`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            },
            body: JSON.stringify({ companyName: query })
          }
        )

        if (pdlResponse.ok) {
          const pdlData = await pdlResponse.json()
          
          if (pdlData.data && pdlData.data.length > 0) {
            const company = pdlData.data[0]
            results.push({
              id: `profile-${Date.now()}`,
              type: 'profile',
              data: {
                companyName: company.name || query,
                industry: company.industry || 'Unknown',
                employees: company.employee_count ? `${company.employee_count}` : 'Unknown',
                revenue: company.estimated_num_employees ? `$${Math.round(company.estimated_num_employees * 100000 / 1000000)}M` : 'Unknown',
                founded: company.founded || 'Unknown',
                headquarters: company.location ? `${company.location.locality}, ${company.location.region}` : 'Unknown',
                website: company.website || 'Unknown'
              }
            })
          }
        }
      } catch (error) {
        console.error('Error fetching People Data Labs data:', error)
      }
    }

    // Mock litigation data (replace with Trellis API when available)
    if (searchSources.litigation) {
      results.push({
        id: `litigation-${Date.now()}`,
        type: 'litigation',
        data: {
          caseTitle: `Securities Class Action vs ${query}`,
          court: "U.S. District Court, S.D.N.Y.",
          filingDate: "2023-03-15",
          status: "Pending",
          allegations: "Securities fraud, misleading financial statements",
          leadPlaintiff: "Pension Fund XYZ",
          estimatedDamages: "$45.2M"
        }
      })
    }

    // Mock PPP data (replace with actual PPP API when available)
    if (searchSources.ppp) {
      results.push({
        id: `ppp-${Date.now()}`,
        type: 'ppp',
        data: {
          businessName: query,
          loanAmount: "$150,000",
          approvalDate: "2020-05-12",
          lender: "Bank of America",
          jobsReported: 25,
          forgiven: true,
          forgivenessDate: "2021-08-22"
        }
      })
    }

    return new Response(
      JSON.stringify({ results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in unified-search function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
