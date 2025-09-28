import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  useBookingsAnalytics, 
  useCompletionAnalytics, 
  useServiceDemandAnalytics,
  useLocationAnalytics,
  useDemographicsAnalytics,
  TimePeriod 
} from '@/hooks/useAnalytics';
import CompletionChart from '@/components/charts/CompletionChart';
import ServiceDemandChart from '@/components/charts/ServiceDemandChart';
import LocationChart from '@/components/charts/LocationChart';
import BookingTrendsChart from '@/components/charts/BookingTrendsChart';
import DemographicsChart from '@/components/charts/DemographicsChart';
import { BarChart3, TrendingUp, Users, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Analytics = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  
  const { data: bookingsData, isLoading: bookingsLoading } = useBookingsAnalytics(timePeriod);
  const { data: completionData, isLoading: completionLoading } = useCompletionAnalytics();
  const { data: serviceData, isLoading: serviceLoading } = useServiceDemandAnalytics();
  const { data: locationData, isLoading: locationLoading } = useLocationAnalytics();
  const { data: demographicsData, isLoading: demographicsLoading } = useDemographicsAnalytics();

  const isLoading = false; // Remove global loading since we handle individual tab loading

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const totalBookings = bookingsData?.length || 0;
  const completedRate = completionData ? 
    Math.round((completionData.completed / (completionData.completed + completionData.pending + completionData.inProgress + completionData.cancelled)) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
                <p className="text-muted-foreground mt-1">Track your salon performance and insights</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-violet-800">Total Bookings</p>
                  <p className="text-2xl font-bold text-violet-900">{totalBookings}</p>
                </div>
                <Calendar className="h-8 w-8 text-violet-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-800">Completion Rate</p>
                  <p className="text-2xl font-bold text-emerald-900">{completedRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Popular Services</p>
                  <p className="text-2xl font-bold text-blue-900">{serviceData?.length || 0}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-pink-800">Locations</p>
                  <p className="text-2xl font-bold text-pink-900">2</p>
                </div>
                <MapPin className="h-8 w-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="trends" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="completion">Completion</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
              </TabsList>

              <TabsContent value="trends" className="mt-6">
                <BookingTrendsChart data={bookingsData || []} period={timePeriod} />
              </TabsContent>

              <TabsContent value="completion" className="mt-6">
                {completionLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <CompletionChart data={completionData} />
                )}
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                {serviceLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ServiceDemandChart data={serviceData || []} />
                )}
              </TabsContent>

              <TabsContent value="location" className="mt-6">
                {locationLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <LocationChart data={locationData} />
                )}
              </TabsContent>

              <TabsContent value="demographics" className="mt-6">
                {demographicsLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <DemographicsChart data={demographicsData} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Analytics;