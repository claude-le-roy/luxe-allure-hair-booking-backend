import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface BookingData {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_id: string;
  booking_date: string;
  booking_time: string;
  service_location: string;
  notes?: string;
  status: string;
  order_number?: string;
  created_at: string;
  updated_at: string;
  services?: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
  };
}

export interface CompletionStats {
  completed: number;
  pending: number;
  inProgress: number;
  cancelled: number;
}

export interface ServiceDemand {
  name: string;
  count: number;
}

export interface LocationStats {
  'In Salon': number;
  'At Home': number;
}

export interface Demographics {
  ageGroups: Record<string, number>;
  locations: Record<string, number>;
}

export const useBookingsAnalytics = (period: TimePeriod) => {
  return useQuery({
    queryKey: ['analytics', 'bookings', period],
    queryFn: async () => {
      console.log('Fetching bookings analytics for period:', period);
      const { data, error } = await supabase.functions.invoke('analytics', {
        body: { path: `bookings?period=${period}` },
      });
      
      console.log('Analytics response:', { data, error });
      if (error) {
        console.error('Analytics error:', error);
        throw error;
      }
      return data.data as BookingData[];
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCompletionAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'completion'],
    queryFn: async () => {
      console.log('Fetching completion analytics');
      const { data, error } = await supabase.functions.invoke('analytics', {
        body: { path: 'completion' },
      });
      
      console.log('Completion response:', { data, error });
      if (error) {
        console.error('Completion error:', error);
        throw error;
      }
      return data as CompletionStats;
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useServiceDemandAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'service-demand'],
    queryFn: async () => {
      console.log('Fetching service demand analytics');
      const { data, error } = await supabase.functions.invoke('analytics', {
        body: { path: 'service-demand' },
      });
      
      console.log('Service demand response:', { data, error });
      if (error) {
        console.error('Service demand error:', error);
        throw error;
      }
      return data as ServiceDemand[];
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useLocationAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'location'],
    queryFn: async () => {
      console.log('Fetching location analytics');
      const { data, error } = await supabase.functions.invoke('analytics', {
        body: { path: 'location' },
      });
      
      console.log('Location response:', { data, error });
      if (error) {
        console.error('Location error:', error);
        throw error;
      }
      return data as LocationStats;
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDemographicsAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'demographics'],
    queryFn: async () => {
      console.log('Fetching demographics analytics');
      const { data, error } = await supabase.functions.invoke('analytics', {
        body: { path: 'demographics' },
      });
      
      console.log('Demographics response:', { data, error });
      if (error) {
        console.error('Demographics error:', error);
        throw error;
      }
      return data as Demographics;
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};