import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationStats } from '@/hooks/useAnalytics';

interface LocationChartProps {
  data: LocationStats;
}

const COLORS = {
  'In Salon': 'hsl(var(--chart-1))',
  'At Home': 'hsl(var(--chart-2))',
};

const LocationChart = ({ data }: LocationChartProps) => {
  // Handle null or undefined data
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Location Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No location data available
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(data)
    .map(([location, count]) => ({
      name: location,
      value: count,
      color: COLORS[location as keyof typeof COLORS],
    }))
    .filter(item => item.value > 0); // Only show locations with bookings

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Location Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No location data found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Location Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              style={{
                fontSize: '14px',
                fontWeight: '600',
                textShadow: 'none',
                filter: 'none'
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
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
            <Legend 
              wrapperStyle={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'hsl(var(--foreground))'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LocationChart;