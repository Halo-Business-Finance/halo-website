import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Clock,
  CheckCircle,
  AlertCircle,
  PhoneCall,
  Mail,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { secureStorage } from '@/utils/secureStorage';
import { formatDistanceToNow } from 'date-fns';

interface Lead {
  id: string;
  form_type: string;
  submitted_data: any;
  status: string;
  priority: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  assigned_to_user?: {
    full_name: string;
    email: string;
  };
}

interface LeadStats {
  by_status: Record<string, number>;
  by_form_type: Record<string, number>;
  by_priority: Record<string, number>;
}

const statusColors = {
  new: 'bg-orange-100 text-orange-800',
  contacted: 'bg-blue-100 text-blue-800',
  qualified: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const LeadsManager = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats>({ by_status: {}, by_form_type: {}, by_priority: {} });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadLeads();
  }, [currentPage, statusFilter, priorityFilter]);

  const loadLeads = async () => {
    try {
      const token = secureStorage.getToken();
      if (!token) return;

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });

      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter && priorityFilter !== 'all') params.append('priority', priorityFilter);

      const response = await fetch(
        `https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-leads?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLeads(data.data || []);
          setStats(data.statistics || { by_status: {}, by_form_type: {}, by_priority: {} });
        }
      }
    } catch (error) {
      console.error('Failed to load leads:', error);
      toast({
        title: "Error",
        description: "Failed to load leads",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateLead = async (leadId: string, updates: any) => {
    try {
      setIsUpdating(true);
      const token = secureStorage.getToken();
      if (!token) return;

      const response = await fetch(
        `https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-leads?id=${leadId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: "Success",
            description: "Lead updated successfully"
          });
          loadLeads();
          setIsDialogOpen(false);
        }
      }
    } catch (error) {
      console.error('Failed to update lead:', error);
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4" />;
      case 'contacted': return <PhoneCall className="h-4 w-4" />;
      case 'qualified': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatFormType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filteredLeads = leads.filter(lead => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.submitted_data?.name?.toLowerCase().includes(searchLower) ||
      lead.submitted_data?.email?.toLowerCase().includes(searchLower) ||
      lead.submitted_data?.company?.toLowerCase().includes(searchLower) ||
      lead.form_type.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(stats.by_status).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium capitalize">{status} Leads</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
              {getStatusIcon(status)}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lead Management
          </CardTitle>
          <CardDescription>
            Manage and track all lead submissions from your website forms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Leads Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Form Type</TableHead>
                  <TableHead>Loan Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.submitted_data?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.submitted_data?.email || 'N/A'}
                        </div>
                        {lead.submitted_data?.company && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {lead.submitted_data.company}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {formatFormType(lead.form_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {lead.submitted_data?.loan_program && (
                          <div>{lead.submitted_data.loan_program}</div>
                        )}
                        {lead.submitted_data?.loan_amount && (
                          <div className="text-gray-500 flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {lead.submitted_data.loan_amount}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                        {getStatusIcon(lead.status)}
                        <span className="ml-1 capitalize">{lead.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[lead.priority as keyof typeof priorityColors]}>
                        {lead.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDistanceToNow(new Date(lead.created_at))} ago
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog open={isDialogOpen && selectedLead?.id === lead.id} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLead(lead)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <LeadDetailDialog 
                          lead={selectedLead} 
                          onUpdate={updateLead}
                          isUpdating={isUpdating}
                        />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const LeadDetailDialog = ({ 
  lead, 
  onUpdate, 
  isUpdating 
}: { 
  lead: Lead | null; 
  onUpdate: (id: string, updates: any) => void;
  isUpdating: boolean;
}) => {
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (lead) {
      setStatus(lead.status);
      setPriority(lead.priority);
      setNotes(lead.notes || '');
    }
  }, [lead]);

  if (!lead) return null;

  const handleSave = () => {
    onUpdate(lead.id, {
      status,
      priority,
      notes
    });
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Lead Details</DialogTitle>
        <DialogDescription>
          Review and update lead information
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-medium mb-3">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <p className="text-sm font-medium">{lead.submitted_data?.name || 'N/A'}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-sm font-medium">{lead.submitted_data?.email || 'N/A'}</p>
            </div>
            <div>
              <Label>Phone</Label>
              <p className="text-sm font-medium">{lead.submitted_data?.phone || 'N/A'}</p>
            </div>
            <div>
              <Label>Company</Label>
              <p className="text-sm font-medium">{lead.submitted_data?.company || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Loan Information */}
        {lead.submitted_data?.loan_program && (
          <div>
            <h3 className="text-lg font-medium mb-3">Loan Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Loan Program</Label>
                <p className="text-sm font-medium">{lead.submitted_data.loan_program}</p>
              </div>
              <div>
                <Label>Loan Amount</Label>
                <p className="text-sm font-medium">{lead.submitted_data?.loan_amount || 'N/A'}</p>
              </div>
              <div>
                <Label>Timeframe</Label>
                <p className="text-sm font-medium">{lead.submitted_data?.timeframe || 'N/A'}</p>
              </div>
            </div>
            {lead.submitted_data?.message && (
              <div className="mt-4">
                <Label>Message</Label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                  {lead.submitted_data.message}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Management */}
        <div>
          <h3 className="text-lg font-medium mb-3">Lead Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              rows={4}
            />
          </div>
        </div>

        {/* Metadata */}
        <div>
          <h3 className="text-lg font-medium mb-3">Submission Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Label>Submitted</Label>
              <p>{new Date(lead.created_at).toLocaleString()}</p>
            </div>
            <div>
              <Label>Form Type</Label>
              <p className="capitalize">{lead.form_type.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => {}}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default LeadsManager;