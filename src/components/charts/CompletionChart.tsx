import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompletionStats } from '@/hooks/useAnalytics';

interface CompletionChartProps {
  data: CompletionStats;
}

const COLORS = {
  completed: 'hsl(var(--chart-1))',
  pending: 'hsl(var(--chart-2))',
  inProgress: 'hsl(var(--chart-3))',
  cancelled: 'hsl(var(--chart-4))',
};

const CompletionChart = ({ data }: CompletionChartProps) => {
  const chartData = [
    { name: 'Completed', value: data.completed, color: COLORS.completed },
    { name: 'Pending', value: data.pending, color: COLORS.pending },
    { name: 'In Progress', value: data.inProgress, color: COLORS.inProgress },
    { name: 'Cancelled', value: data.cancelled, color: COLORS.cancelled },
  ].filter(item => item.value > 0); // Only show items with values greater than 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Completion Status</CardTitle>
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

export default CompletionChart;