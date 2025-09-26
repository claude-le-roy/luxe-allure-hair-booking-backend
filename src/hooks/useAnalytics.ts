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
      const { data, error } = await supabase.functions.invoke('analytics/bookings', {
        method: 'GET',
        body: null,
      });
      
      if (error) throw error;
      return data.data as BookingData[];
    },
  });
};

export const useCompletionAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'completion'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('analytics/completion', {
        method: 'GET',
      });
      
      if (error) throw error;
      return data as CompletionStats;
    },
  });
};

export const useServiceDemandAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'service-demand'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('analytics/service-demand', {
        method: 'GET',
      });
      
      if (error) throw error;
      return data as ServiceDemand[];
    },
  });
};

export const useLocationAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'location'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('analytics/location', {
        method: 'GET',
      });
      
      if (error) throw error;
      return data as LocationStats;
    },
  });
};

export const useDemographicsAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'demographics'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('analytics/demographics', {
        method: 'GET',
      });
      
      if (error) throw error;
      return data as Demographics;
    },
  });
};