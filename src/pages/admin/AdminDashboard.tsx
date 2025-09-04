import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Shield, 
  Mail, 
  Settings, 
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalConsultations: 0,
    totalApplications: 0,
    activeSessions: 0,
    pendingConsultations: 0,
    recentSecurityEvents: [],
    recentConsultations: []
  });
  
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setDataLoading(true);
      
      // Fetch all data in parallel
      const [
        usersResponse,
        consultationsResponse,
        applicationsResponse,
        sessionsResponse,
        securityEventsResponse,
        recentConsultationsResponse
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('consultations').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase.from('user_sessions').select('*', { count: 'exact' }).eq('is_active', true),
        supabase.from('security_events').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('consultations').select(`
          id,
          encrypted_name,
          encrypted_email,
          loan_program,
          loan_amount,
          status,
          created_at
        `).order('created_at', { ascending: false }).limit(5)
      ]);

      // Count pending consultations
      const { count: pendingCount } = await supabase
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setDashboardData({
        totalUsers: usersResponse.count || 0,
        totalConsultations: consultationsResponse.count || 0,
        totalApplications: applicationsResponse.count || 0,
        activeSessions: sessionsResponse.count || 0,
        pendingConsultations: pendingCount || 0,
        recentSecurityEvents: securityEventsResponse.data || [],
        recentConsultations: recentConsultationsResponse.data || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    fetchDashboardData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchDashboardData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'consultations' }, fetchDashboardData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, fetchDashboardData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'security_events' }, fetchDashboardData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  // Dashboard stats with real data
  const stats = [
    {
      title: "Total Users",
      value: dashboardData.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Consultations",
      value: dashboardData.totalConsultations.toLocaleString(),
      subtitle: `${dashboardData.pendingConsultations} pending`,
      icon: Mail,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Applications",
      value: dashboardData.totalApplications.toLocaleString(),
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Active Sessions",
      value: dashboardData.activeSessions.toLocaleString(),
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  // Quick actions with navigation
  const quickActions = [
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      onClick: () => navigate('/admin/users'),
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      title: "Security Dashboard",
      description: "Monitor security events and alerts",
      icon: Shield,
      onClick: () => navigate('/security-dashboard'),
      color: "bg-red-50 text-red-600 border-red-200"
    },
    {
      title: "Consultation Requests",
      description: "Manage incoming consultation requests",
      icon: Mail,
      onClick: () => navigate('/admin/consultations'),
      color: "bg-yellow-50 text-yellow-600 border-yellow-200"
    },
    {
      title: "SOC Compliance",
      description: "View compliance status and reports",
      icon: BarChart3,
      onClick: () => navigate('/soc-compliance'),
      color: "bg-purple-50 text-purple-600 border-purple-200"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="border-b border-border pb-4">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your Halo Business Finance admin dashboard
          </p>
        </div>

        {/* Stats Grid - Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-sm transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={action.title} 
                  className="hover:shadow-md transition-all cursor-pointer hover:scale-105"
                  onClick={action.onClick}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg border ${action.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base text-foreground">{action.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {action.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity - Real Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Recent Security Events</CardTitle>
              <CardDescription>Latest security monitoring alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.recentSecurityEvents.length > 0 ? (
                  dashboardData.recentSecurityEvents.map((event) => (
                    <div key={event.id} className={`flex items-center space-x-3 p-2 rounded-md ${
                      event.severity === 'critical' ? 'bg-red-50' :
                      event.severity === 'high' ? 'bg-orange-50' :
                      event.severity === 'medium' ? 'bg-yellow-50' : 'bg-blue-50'
                    }`}>
                      <AlertTriangle className={`h-4 w-4 ${
                        event.severity === 'critical' ? 'text-red-500' :
                        event.severity === 'high' ? 'text-orange-500' :
                        event.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {event.event_type?.replace(/_/g, ' ') || 'Security Event'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded capitalize ${
                        event.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        event.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {event.severity}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No recent security events</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Recent Consultations</CardTitle>
              <CardDescription>Latest consultation requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.recentConsultations.length > 0 ? (
                  dashboardData.recentConsultations.map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-2 rounded-md border">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{consultation.loan_program}</p>
                        <p className="text-xs text-muted-foreground">
                          {consultation.loan_amount} • {new Date(consultation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {consultation.status === 'pending' && (
                          <Clock className="h-3 w-3 text-yellow-500" />
                        )}
                        {consultation.status === 'completed' && (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                        {consultation.status === 'cancelled' && (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span className={`text-xs px-2 py-1 rounded capitalize ${
                          consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          consultation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {consultation.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No recent consultations</p>
                  </div>
                )}
              </div>
              {dashboardData.recentConsultations.length > 0 && (
                <div className="mt-4 pt-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/admin/consultations')}
                    className="w-full"
                  >
                    View All Consultations
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;