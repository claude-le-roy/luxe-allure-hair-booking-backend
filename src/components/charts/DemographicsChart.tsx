import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Demographics } from '@/hooks/useAnalytics';

interface DemographicsChartProps {
  data: Demographics;
}

const DemographicsChart = ({ data }: DemographicsChartProps) => {
  // Handle null or undefined data
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Demographics</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No demographic data available
        </CardContent>
      </Card>
    );
  }

  const ageData = Object.entries(data.ageGroups || {}).map(([age, count]) => ({
    category: age,
    count,
  }));

  const locationData = Object.entries(data.locations || {}).map(([location, count]) => ({
    category: location,
    count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Demographics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="age" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="age">Age Groups</TabsTrigger>
            <TabsTrigger value="location">Locations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="age">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="location">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DemographicsChart;