import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Booking } from '@/hooks/useBookings';

const localizer = momentLocalizer(moment);

interface BookingCalendarProps {
  bookings: (Booking & { services?: { name: string } })[];
  onSelectEvent?: (event: any) => void;
}

export function BookingCalendar({ bookings, onSelectEvent }: BookingCalendarProps) {
  const events = bookings.map(booking => {
    const [hours, minutes] = booking.booking_time.split(':');
    const startDate = new Date(booking.booking_date);
    startDate.setHours(parseInt(hours), parseInt(minutes));
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // Default 1 hour duration

    return {
      id: booking.id,
      title: `${booking.customer_name} - ${booking.services?.name || 'Service'}`,
      start: startDate,
      end: endDate,
      resource: booking,
    };
  });

  const eventStyleGetter = (event: any) => {
    const booking = event.resource;
    let backgroundColor = '#e5e7eb'; // default gray
    
    switch (booking.status) {
      case 'pending':
        backgroundColor = '#fef3c7'; // yellow
        break;
      case 'in-progress':
        backgroundColor = '#dbeafe'; // blue
        break;
      case 'completed':
        backgroundColor = '#d1fae5'; // green
        break;
      case 'cancelled':
        backgroundColor = '#fee2e2'; // red
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.8,
        color: '#374151',
        border: '1px solid rgba(0,0,0,0.1)',
        fontSize: '12px',
      }
    };
  };

  return (
    <div className="h-[600px] bg-card p-4 rounded-lg border">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day']}
        defaultView="month"
        className="booking-calendar"
      />
      
      <style>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-toolbar {
          margin-bottom: 1rem;
        }
        .rbc-toolbar button {
          color: hsl(var(--foreground));
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
        }
        .rbc-toolbar button:hover {
          background: hsl(var(--muted));
        }
        .rbc-toolbar button.rbc-active {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        .rbc-month-view {
          border: 1px solid hsl(var(--border));
          border-radius: 0.375rem;
        }
        .rbc-header {
          background: hsl(var(--muted));
          color: hsl(var(--foreground));
          padding: 0.75rem 0.5rem;
          font-weight: 500;
        }
        .rbc-today {
          background-color: hsl(var(--accent)) !important;
        }
        .rbc-event {
          border-radius: 0.375rem !important;
          padding: 2px 4px;
        }
      `}</style>
    </div>
  );
}