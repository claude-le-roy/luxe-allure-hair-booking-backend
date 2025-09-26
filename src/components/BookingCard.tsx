import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar, Clock, MapPin, Phone, Mail, User, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { GroupedBooking, useUpdateBookingStatus } from '@/hooks/useBookings';
import { format, parseISO } from 'date-fns';

interface BookingCardProps {
  groupedBooking: GroupedBooking;
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

export function BookingCard({ groupedBooking }: BookingCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const updateStatus = useUpdateBookingStatus();

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    updateStatus.mutate({ id: bookingId, status: newStatus });
  };

  // Get the most common status for the group
  const getGroupStatus = () => {
    const statusCounts = groupedBooking.bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCounts).reduce((a, b) => 
      statusCounts[a[0]] > statusCounts[b[0]] ? a : b
    )[0];
  };

  const groupStatus = getGroupStatus();

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/20 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <CardTitle className="text-lg font-semibold text-foreground">
                  {groupedBooking.customer_name}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {groupedBooking.total_services} service{groupedBooking.total_services > 1 ? 's' : ''}
                </Badge>
                <Badge 
                  className={`${statusColors[groupStatus] || statusColors.pending} font-medium`}
                >
                  {statusLabels[groupStatus] || groupStatus}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(parseISO(groupedBooking.booking_date), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{groupedBooking.customer_phone}</span>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Customer Details */}
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Mail className="h-4 w-4" />
                <span>{groupedBooking.customer_email}</span>
              </div>
            </div>

            {/* Individual Bookings */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">All Services for this Date:</h4>
              {groupedBooking.bookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-foreground">
                        {booking.order_number || `Service ${booking.id.slice(0, 8)}`}
                      </h5>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{booking.booking_time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span className="capitalize">{booking.service_location.replace('-', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      className={`${statusColors[booking.status] || statusColors.pending} font-medium`}
                    >
                      {statusLabels[booking.status] || booking.status}
                    </Badge>
                  </div>

                  {/* Service Info */}
                  {booking.services && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <h6 className="font-medium text-foreground mb-1">{booking.services.name}</h6>
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
                        onValueChange={(status) => handleStatusChange(booking.id, status)}
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
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}