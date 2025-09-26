import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingData, TimePeriod } from '@/hooks/useAnalytics';
import { format, parseISO, startOfDay, startOfWeek, startOfMonth, startOfQuarter, startOfYear } from 'date-fns';

interface BookingTrendsChartProps {
  data: BookingData[];
  period: TimePeriod;
}

const BookingTrendsChart = ({ data, period }: BookingTrendsChartProps) => {
  const getDateFormatter = (period: TimePeriod) => {
    switch (period) {
      case 'day':
        return (date: Date) => format(date, 'HH:mm');
      case 'week':
        return (date: Date) => format(date, 'EEE');
      case 'month':
        return (date: Date) => format(date, 'MMM dd');
      case 'quarter':
        return (date: Date) => format(date, 'MMM');
      case 'year':
        return (date: Date) => format(date, 'MMM');
      default:
        return (date: Date) => format(date, 'MMM dd');
    }
  };

  const getPeriodStart = (date: Date, period: TimePeriod) => {
    switch (period) {
      case 'day':
        return startOfDay(date);
      case 'week':
        return startOfWeek(date);
      case 'month':
        return startOfMonth(date);
      case 'quarter':
        return startOfQuarter(date);
      case 'year':
        return startOfYear(date);
      default:
        return startOfDay(date);
    }
  };

  // Group bookings by time period
  const groupedData = data.reduce((acc, booking) => {
    const date = parseISO(booking.booking_date);
    const periodStart = getPeriodStart(date, period);
    const key = periodStart.toISOString();
    
    if (!acc[key]) {
      acc[key] = {
        date: periodStart,
        count: 0,
      };
    }
    acc[key].count += 1;
    
    return acc;
  }, {} as Record<string, { date: Date; count: number }>);

  const chartData = Object.values(groupedData)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(item => ({
      date: getDateFormatter(period)(item.date),
      bookings: item.count,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Trends Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="bookings" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BookingTrendsChart;