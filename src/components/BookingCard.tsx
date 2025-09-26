import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Phone, Mail, User, FileText } from 'lucide-react';
import { Booking, useUpdateBookingStatus } from '@/hooks/useBookings';
import { format, parseISO } from 'date-fns';

interface BookingCardProps {
  booking: Booking & { services?: { id: string; name: string; price: number; duration: number } };
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const statusLabels: Record<string, string> = {
  pending: 'New',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function BookingCard({ booking }: BookingCardProps) {
  const updateStatus = useUpdateBookingStatus();

  const handleStatusChange = (newStatus: string) => {
    updateStatus.mutate({ id: booking.id, status: newStatus });
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-foreground">
            {booking.order_number || `Booking ${booking.id.slice(0, 8)}`}
          </CardTitle>
          <Badge 
            className={`${statusColors[booking.status] || statusColors.pending} font-medium`}
          >
            {statusLabels[booking.status] || booking.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Customer Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="font-medium text-foreground">{booking.customer_name}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Phone className="h-4 w-4" />
              <span>{booking.customer_phone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Mail className="h-4 w-4" />
              <span>{booking.customer_email}</span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4" />
              <span>{format(parseISO(booking.booking_date), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="h-4 w-4" />
              <span>{booking.booking_time}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4" />
              <span className="capitalize">{booking.service_location.replace('-', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Service Info */}
        {booking.services && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <h4 className="font-medium text-foreground mb-1">{booking.services.name}</h4>
            <div className="text-sm text-muted-foreground">
              ${booking.services.price} • {booking.services.duration} min
            </div>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="flex items-start gap-2 text-sm">
            <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <span className="text-muted-foreground">{booking.notes}</span>
          </div>
        )}

        {/* Status Update */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Update Status:</span>
            <Select 
              value={booking.status} 
              onValueChange={handleStatusChange}
              disabled={updateStatus.isPending}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">New</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}