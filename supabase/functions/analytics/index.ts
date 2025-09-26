import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          service_id: string
          booking_date: string
          booking_time: string
          service_location: string
          notes?: string
          status: string
          order_number?: string
          created_at: string
          updated_at: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          duration: number
          category_id: string
          image_url?: string
        }
      }
    }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const url = new URL(req.url)
    const endpoint = url.pathname.split('/analytics/')[1]

    switch (endpoint) {
      case 'bookings': {
        const period = url.searchParams.get('period') || 'month'
        const { data, error } = await supabaseClient
          .from('bookings')
          .select(`
            *,
            services (
              id,
              name,
              description,
              price,
              duration
            )
          `)
          .order('booking_date', { ascending: false })

        if (error) throw error

        // Filter data based on period with accurate date handling
        const now = new Date()
        let startDate: Date
        let endDate: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

        switch (period) {
          case 'day':
            // Today only
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
            break
          case 'week':
            // Last 7 days including today
            startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
            startDate.setHours(0, 0, 0, 0)
            break
          case 'month':
            // Current month
            startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
            break
          case 'quarter':
            // Current quarter
            const quarterMonth = Math.floor(now.getMonth() / 3) * 3
            startDate = new Date(now.getFullYear(), quarterMonth, 1, 0, 0, 0, 0)
            break
          case 'year':
            // Current year
            startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0)
            break
          default:
            startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
        }

        const filteredData = data?.filter((booking: any) => {
          const bookingDate = new Date(booking.booking_date)
          return bookingDate >= startDate && bookingDate <= endDate
        }) || []

        return new Response(
          JSON.stringify({ data: filteredData }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      }

      case 'completion': {
        const { data, error } = await supabaseClient
          .from('bookings')
          .select('status')

        if (error) throw error

        const completionStats = {
          completed: data?.filter((b: any) => b.status === 'completed').length || 0,
          pending: data?.filter((b: any) => b.status === 'pending').length || 0,
          inProgress: data?.filter((b: any) => b.status === 'in-progress').length || 0,
          cancelled: data?.filter((b: any) => b.status === 'cancelled').length || 0,
        }

        return new Response(
          JSON.stringify(completionStats),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      }

      case 'service-demand': {
        const { data, error } = await supabaseClient
          .from('bookings')
          .select(`
            service_id,
            services (
              name
            )
          `)

        if (error) throw error

        const serviceCounts: Record<string, number> = {}
        data?.forEach(booking => {
          const serviceName = (booking as any).services?.name || 'Unknown Service'
          serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1
        })

        const serviceData = Object.entries(serviceCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)

        return new Response(
          JSON.stringify(serviceData),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      }

      case 'location': {
        const { data, error } = await supabaseClient
          .from('bookings')
          .select('service_location')

        if (error) throw error

        const locationStats = {
          'In Salon': data?.filter((b: any) => b.service_location === 'in-salon').length || 0,
          'At Home': data?.filter((b: any) => b.service_location === 'at-home').length || 0,
        }

        return new Response(
          JSON.stringify(locationStats),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      }

      case 'demographics': {
        const { data, error } = await supabaseClient
          .from('bookings')
          .select('customer_phone')

        if (error) throw error

        // Mock demographics data since we don't have age/location in current schema
        const demographics = {
          ageGroups: {
            '18-25': Math.floor((data?.length || 0) * 0.3),
            '26-35': Math.floor((data?.length || 0) * 0.4),
            '36-45': Math.floor((data?.length || 0) * 0.2),
            '45+': Math.floor((data?.length || 0) * 0.1),
          },
          locations: {
            'Downtown': Math.floor((data?.length || 0) * 0.4),
            'Suburbs': Math.floor((data?.length || 0) * 0.3),
            'Uptown': Math.floor((data?.length || 0) * 0.2),
            'Other': Math.floor((data?.length || 0) * 0.1),
          }
        }

        return new Response(
          JSON.stringify(demographics),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404 
          }
        )
    }
  } catch (error) {
    console.error('Analytics error:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})