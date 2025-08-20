import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Loan Applications",
      value: "89",
      change: "+8%",
      trend: "up", 
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Total Revenue",
      value: "$2.4M",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Active Sessions",
      value: "456",
      change: "-3%",
      trend: "down",
      icon: Activity,
      color: "text-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      title: "Content Management",
      description: "Manage pages, posts, and resources",
      icon: FileText,
      href: "/admin/content",
      color: "bg-green-50 text-green-600 border-green-200"
    },
    {
      title: "Analytics & Reports",
      description: "View detailed analytics and reports",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      title: "Security Center",
      description: "Monitor security events and settings",
      icon: Shield,
      href: "/admin/security",
      color: "bg-red-50 text-red-600 border-red-200"
    },
    {
      title: "Consultation Requests",
      description: "Manage incoming consultation requests",
      icon: Mail,
      href: "/admin/consultations",
      color: "bg-yellow-50 text-yellow-600 border-yellow-200"
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-50 text-gray-600 border-gray-200"
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className={`mr-1 h-3 w-3 ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    {stat.change} from last month
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg border ${action.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{action.title}</CardTitle>
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Latest security monitoring alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded-md bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Failed login attempt</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-md bg-yellow-50">
                  <Shield className="h-4 w-4 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New user registration</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-md bg-green-50">
                  <Activity className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">System backup completed</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Consultations</CardTitle>
              <CardDescription>Latest consultation requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-md border">
                  <div>
                    <p className="text-sm font-medium">SBA 7(a) Loan Request</p>
                    <p className="text-xs text-muted-foreground">John D. - $250,000</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Pending
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-md border">
                  <div>
                    <p className="text-sm font-medium">Equipment Financing</p>
                    <p className="text-xs text-muted-foreground">Sarah M. - $150,000</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Approved
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-md border">
                  <div>
                    <p className="text-sm font-medium">Working Capital</p>
                    <p className="text-xs text-muted-foreground">Mike R. - $100,000</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    In Review
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;