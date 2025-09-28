import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceDemand } from '@/hooks/useAnalytics';

interface ServiceDemandChartProps {
  data: ServiceDemand[];
}

const ServiceDemandChart = ({ data }: ServiceDemandChartProps) => {
  // Filter out services with zero bookings and handle empty data
  const filteredData = data ? data.filter(service => service.count > 0) : [];
  
  if (!data || filteredData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Services</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No service data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Popular Services</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              style={{
                fontSize: '12px',
                fontWeight: '500'
              }}
            />
            <YAxis 
              style={{
                fontSize: '12px',
                fontWeight: '500'
              }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
                fontWeight: '500'
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ServiceDemandChart;