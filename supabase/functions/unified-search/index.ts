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
          console.log('PDL Response in unified-search:', pdlData)
          
          if (pdlData.data && pdlData.data.length > 0) {
            const company = pdlData.data[0]
            
            // Format employee count
            let employeeCount = 'Unknown'
            if (company.employee_count) {
              employeeCount = company.employee_count.toString()
            } else if (company.employee_count_range) {
              employeeCount = company.employee_count_range
            }
            
            // Format revenue
            let revenue = 'Unknown'
            if (company.estimated_num_employees && company.estimated_num_employees > 0) {
              // Rough estimate: $100k revenue per employee
              const estimatedRevenue = Math.round(company.estimated_num_employees * 100000 / 1000000)
              revenue = `~$${estimatedRevenue}M (estimated)`
            } else if (company.annual_revenue) {
              revenue = `$${(company.annual_revenue / 1000000).toFixed(1)}M`
            }
            
            // Format location
            let headquarters = 'Unknown'
            if (company.location) {
              if (company.location.locality && company.location.region) {
                headquarters = `${company.location.locality}, ${company.location.region}`
              } else if (company.location.country) {
                headquarters = company.location.country
              }
            }
            
            results.push({
              id: `profile-${Date.now()}`,
              type: 'profile',
              data: {
                companyName: company.name || query,
                industry: company.industry || company.industries?.[0] || 'Unknown',
                employees: employeeCount,
                revenue: revenue,
                founded: company.founded ? company.founded.toString() : 'Unknown',
                headquarters: headquarters,
                website: company.website || 'Unknown',
                description: company.summary || 'No description available'
              }
            })
          } else {
            console.log('No company data found in PDL response')
          }
        } else {
          const errorText = await pdlResponse.text()
          console.error('PDL API error:', pdlResponse.status, errorText)
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

    // Mock PAGA data (replace with actual PAGA API when available)
    if (searchSources.paga) {
      results.push({
        id: `paga-${Date.now()}`,
        type: 'paga',
        data: {
          businessName: query,
          filingDate: "2023-09-15",
          court: "Superior Court of California, Los Angeles County",
          caseNumber: "BC712345",
          allegations: "Failure to provide meal and rest breaks, unpaid overtime wages",
          status: "Active",
          plaintiffAttorney: "Smith & Associates",
          estimatedPenalties: "$280,000",
          affectedEmployees: 150
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
