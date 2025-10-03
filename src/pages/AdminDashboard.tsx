import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Search, 
  Shield, 
  LogOut,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminAuth from '@/components/admin/AdminAuth';
import CMSManager from '@/components/admin/CMSManager';
import LeadsManager from '@/components/admin/LeadsManager';
import SEOManager from '@/components/admin/SEOManager';
import SecurityMonitor from '@/components/admin/SecurityMonitor';
import { secureStorage } from '@/utils/secureStorage';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  cmsPages: number;
  securityAlerts: number;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    cmsPages: 0,
    securityAlerts: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const session = secureStorage.getSession();
    if (session) {
      try {
        setUser(session.user);
        loadDashboardStats(session.token);
      } catch (error) {
        console.error('Invalid session:', error);
        secureStorage.clearSession();
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
    setIsLoading(false);
  }, []);

  const loadDashboardStats = async (token: string) => {
    try {
      // Fetch leads stats
      const leadsResponse = await fetch(
        'https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-leads?page=1&limit=1',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json();
        if (leadsData.success) {
          setStats(prev => ({
            ...prev,
            totalLeads: leadsData.pagination?.total || 0,
            newLeads: leadsData.statistics?.by_status?.new || 0
          }));
        }
      }

      // Fetch CMS stats
      const cmsResponse = await fetch(
        'https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-cms',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (cmsResponse.ok) {
        const cmsData = await cmsResponse.json();
        if (cmsData.success) {
          setStats(prev => ({
            ...prev,
            cmsPages: cmsData.data?.length || 0
          }));
        }
      }

    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const handleLogin = (userData: AdminUser, token: string) => {
    setUser(userData);
    // Session is already stored by AdminAuth via secureStorage
    loadDashboardStats(token);
    toast({
      title: "Welcome back!",
      description: `Logged in as ${userData.full_name}`,
    });
  };

  const handleLogout = async () => {
    try {
      const token = secureStorage.getToken() || localStorage.getItem('admin_token');
      if (token) {
        await fetch('https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-auth', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      secureStorage.clearSession();
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AdminAuth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-semibold text-gray-900">
                Halo Business Finance - Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.full_name}
              </span>
              <Badge variant="secondary">{user.role}</Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                All submitted forms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.newLeads}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting contact
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CMS Pages</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cmsPages}</div>
              <p className="text-xs text-muted-foreground">
                Content entries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                <CheckCircle className="h-6 w-6 inline" />
              </div>
              <p className="text-xs text-muted-foreground">
                System secure
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Lead Management
            </TabsTrigger>
            <TabsTrigger value="cms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content Management
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              SEO Management
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Monitor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <LeadsManager />
          </TabsContent>

          <TabsContent value="cms">
            <CMSManager />
          </TabsContent>

          <TabsContent value="seo">
            <SEOManager />
          </TabsContent>

          <TabsContent value="security">
            <SecurityMonitor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;