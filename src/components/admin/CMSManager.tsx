import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Save,
  Globe,
  Eye,
  EyeOff,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { secureStorage } from '@/utils/secureStorage';
import { formatDistanceToNow } from 'date-fns';

interface CMSContent {
  id: string;
  page_slug: string;
  section_name: string;
  content_key: string;
  content_value: any;
  content_type: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const CMSManager = () => {
  const [content, setContent] = useState<CMSContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageFilter, setPageFilter] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<CMSContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const token = secureStorage.getToken();
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access CMS",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        'https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-cms',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 401) {
        // Clear any stale sessions/tokens and prompt re-auth
        secureStorage.clearSession();
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        toast({
          title: "Session expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setContent(data.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to load content:', error);
      toast({
        title: "Error",
        description: "Failed to load CMS content",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportPages = async () => {
    try {
      setIsLoading(true);
      const token = secureStorage.getToken();
      
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please sign in to import pages",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        'https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-cms-import',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 401) {
        secureStorage.clearSession();
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        toast({
          title: "Session expired",
          description: "Please sign in again, then retry importing.",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        let serverMsg = '';
        try { serverMsg = await response.text(); } catch {}
        throw new Error(serverMsg || 'Failed to import pages');
      }

      const result = await response.json();
      
      toast({
        title: "Import successful",
        description: `Created ${result.created} entries, skipped ${result.skipped} existing entries across ${result.totalPages} pages`,
      });

      await loadContent();
    } catch (error) {
      console.error('Error importing pages:', error);
      toast({
        title: "Error",
        description: "Failed to import pages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveContent = async (contentData: any) => {
    try {
      setIsSaving(true);
      const token = secureStorage.getToken();
      if (!token) return;

      const response = await fetch(
        'https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-cms',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(contentData)
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: "Success",
            description: isCreating ? "Content created successfully" : "Content updated successfully"
          });
          loadContent();
          setIsDialogOpen(false);
          setIsCreating(false);
          setSelectedContent(null);
        }
      }
    } catch (error) {
      console.error('Failed to save content:', error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteContent = async (contentId: string) => {
    try {
      const token = secureStorage.getToken();
      if (!token) return;

      const response = await fetch(
        `https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-cms?id=${contentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: "Success",
            description: "Content deleted successfully"
          });
          loadContent();
        }
      }
    } catch (error) {
      console.error('Failed to delete content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive"
      });
    }
  };

  const handleCreateNew = () => {
    setSelectedContent({
      id: '',
      page_slug: '',
      section_name: '',
      content_key: '',
      content_value: { text: '' },
      content_type: 'text',
      is_published: true,
      created_at: '',
      updated_at: ''
    });
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  const handleEdit = (content: CMSContent) => {
    setSelectedContent(content);
    setIsCreating(false);
    setIsDialogOpen(true);
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = !searchTerm || 
      item.page_slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.section_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content_key.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPage = pageFilter === 'all' || item.page_slug === pageFilter;
    
    return matchesSearch && matchesPage;
  });

  const uniquePages = Array.from(new Set(content.map(c => c.page_slug))).sort();

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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Management System
              </CardTitle>
              <CardDescription>
                Manage website content, text, images, and structured data
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleImportPages} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Site Pages
              </Button>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search content by page, section, or key..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={pageFilter} onValueChange={setPageFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pages</SelectItem>
                {uniquePages.map(page => (
                  <SelectItem key={page} value={page}>{page}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Content Key</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-10">
                      No CMS entries found. Click "Add Content" to create your first page section.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContent.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{item.page_slug}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.section_name}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{item.content_key}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.content_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {item.is_published ? (
                            <>
                              <Eye className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-400">Draft</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDistanceToNow(new Date(item.updated_at))} ago
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteContent(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Content Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Create New Content' : 'Edit Content'}
            </DialogTitle>
            <DialogDescription>
              {isCreating ? 'Add new content to your website' : 'Update existing content'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedContent && (
            <ContentEditor
              content={selectedContent}
              onSave={saveContent}
              isSaving={isSaving}
              isCreating={isCreating}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ContentEditor = ({ 
  content, 
  onSave, 
  isSaving, 
  isCreating 
}: { 
  content: CMSContent;
  onSave: (data: any) => void;
  isSaving: boolean;
  isCreating: boolean;
}) => {
  const [formData, setFormData] = useState({
    page_slug: content.page_slug,
    section_name: content.section_name,
    content_key: content.content_key,
    content_value: content.content_value?.text || JSON.stringify(content.content_value, null, 2),
    content_type: content.content_type,
    is_published: content.is_published
  });

  const handleSave = () => {
    let processedValue;
    
    try {
      if (formData.content_type === 'text' || formData.content_type === 'html') {
        processedValue = { text: formData.content_value };
      } else {
        processedValue = JSON.parse(formData.content_value);
      }
    } catch (error) {
      processedValue = { text: formData.content_value };
    }

    onSave({
      page_slug: formData.page_slug,
      section_name: formData.section_name,
      content_key: formData.content_key,
      content_value: processedValue,
      content_type: formData.content_type,
      is_published: formData.is_published
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Page Slug</Label>
          <Input
            value={formData.page_slug}
            onChange={(e) => setFormData({ ...formData, page_slug: e.target.value })}
            placeholder="home, about, contact"
          />
        </div>
        <div>
          <Label>Section Name</Label>
          <Input
            value={formData.section_name}
            onChange={(e) => setFormData({ ...formData, section_name: e.target.value })}
            placeholder="hero, features, footer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Content Key</Label>
          <Input
            value={formData.content_key}
            onChange={(e) => setFormData({ ...formData, content_key: e.target.value })}
            placeholder="title, description, image_url"
          />
        </div>
        <div>
          <Label>Content Type</Label>
          <Select value={formData.content_type} onValueChange={(value) => setFormData({ ...formData, content_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="image">Image URL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Content Value</Label>
        <Textarea
          value={formData.content_value}
          onChange={(e) => setFormData({ ...formData, content_value: e.target.value })}
          placeholder={formData.content_type === 'json' ? '{"key": "value"}' : 'Enter content...'}
          rows={8}
          className="font-mono"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_published"
          checked={formData.is_published}
          onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
        />
        <Label htmlFor="is_published">Published</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </div>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isCreating ? 'Create' : 'Update'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CMSManager;