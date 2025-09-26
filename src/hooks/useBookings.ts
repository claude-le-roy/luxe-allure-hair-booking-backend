import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Booking {
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
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category_id: string;
  image_url?: string;
}

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
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
        .order('booking_date', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      return data;
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Booking Updated",
        description: "Booking status has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive",
      });
    },
  });
};

export const useSearchBookings = (searchTerm: string) => {
  return useQuery({
    queryKey: ['bookings', 'search', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];

      const { data, error } = await supabase
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
        .or(`customer_name.ilike.%${searchTerm}%,customer_phone.ilike.%${searchTerm}%`)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: searchTerm.length > 0,
  });
};