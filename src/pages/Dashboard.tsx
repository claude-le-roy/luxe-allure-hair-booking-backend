import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Calendar, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, profile, signOut } = useAuth();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'staff':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Booking Dashboard</h1>
            {profile && (
              <Badge variant={getRoleBadgeVariant(profile.role)}>
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bookings Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Bookings</span>
              </CardTitle>
              <CardDescription>
                View and manage your bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/">
                  View Bookings
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Analytics Card - Only for Staff/Admin */}
          {['staff', 'admin'].includes(profile?.role || '') && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Analytics</span>
                </CardTitle>
                <CardDescription>
                  View booking analytics and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/analytics">
                    View Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Welcome Card */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>
                {profile?.role === 'customer' 
                  ? 'Manage your appointments and bookings' 
                  : profile?.role === 'staff'
                  ? 'Access your staff dashboard and client bookings'
                  : 'Full system administration access'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Account:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {profile?.role}</p>
                <p><strong>Member since:</strong> {
                  profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString() 
                    : 'N/A'
                }</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}