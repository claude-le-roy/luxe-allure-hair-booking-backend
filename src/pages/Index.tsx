import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookingCard } from '@/components/BookingCard';
import { BookingCalendar } from '@/components/BookingCalendar';
import { BookingSearch } from '@/components/BookingSearch';
import { useBookings, useSearchBookings } from '@/hooks/useBookings';
import { Calendar, List, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: allBookings, isLoading, error } = useBookings();
  const { data: searchResults } = useSearchBookings(searchTerm);
  
  const bookings = searchTerm ? (searchResults || []) : (allBookings || []);

  // Calculate stats
  const stats = {
    total: allBookings?.length || 0,
    pending: allBookings?.filter(b => b.status === 'pending').length || 0,
    inProgress: allBookings?.filter(b => b.status === 'in-progress').length || 0,
    completed: allBookings?.filter(b => b.status === 'completed').length || 0,
    cancelled: allBookings?.filter(b => b.status === 'cancelled').length || 0,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <XCircle className="h-12 w-12 text-destructive mx-auto" />
          <p className="text-muted-foreground">Error loading bookings. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Salon Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your bookings and appointments</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1">
                {stats.total} Total Bookings
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">New</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">In Progress</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.inProgress}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Completed</p>
                  <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Cancelled</p>
                  <p className="text-2xl font-bold text-red-900">{stats.cancelled}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and View Toggle */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="flex-1 max-w-md">
                <BookingSearch onSearch={setSearchTerm} />
              </div>
              <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'list' | 'calendar')}>
                <TabsList>
                  <TabsTrigger value="list" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    List View
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Calendar View
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          
          <CardContent>
            {activeView === 'list' ? (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      {searchTerm ? 'No bookings found' : 'No bookings yet'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm 
                        ? 'Try adjusting your search terms.' 
                        : 'Bookings will appear here when customers make appointments.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {bookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <BookingCalendar bookings={bookings} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;