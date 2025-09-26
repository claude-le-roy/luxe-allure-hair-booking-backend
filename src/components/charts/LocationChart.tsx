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
  const chartData = Object.entries(data).map(([location, count]) => ({
    name: location,
    value: count,
    color: COLORS[location as keyof typeof COLORS],
  }));

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
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LocationChart;