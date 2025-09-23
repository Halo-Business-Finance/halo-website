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
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Globe,
  Save,
  Eye,
  EyeOff,
  Target,
  BarChart3,
  Image,
  Link
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { secureStorage } from '@/utils/secureStorage';
import { formatDistanceToNow } from 'date-fns';

interface SEOSettings {
  id: string;
  page_slug: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  robots_meta: string;
  schema_markup?: any;
  is_active: boolean;
  updated_at: string;
}

const SEOManager = () => {
  const [seoSettings, setSeoSettings] = useState<SEOSettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSEO, setSelectedSEO] = useState<SEOSettings | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    try {
      const token = secureStorage.getToken();
      if (!token) return;

      const response = await fetch(
        'https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-seo',
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
          setSeoSettings(data.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to load SEO settings:', error);
      toast({
        title: "Error",
        description: "Failed to load SEO settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSEOSettings = async (seoData: any) => {
    try {
      setIsSaving(true);
      const token = secureStorage.getToken();
      if (!token) return;

      const response = await fetch(
        'https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-seo',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(seoData)
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: "Success",
            description: isCreating ? "SEO settings created successfully" : "SEO settings updated successfully"
          });
          loadSEOSettings();
          setIsDialogOpen(false);
          setIsCreating(false);
          setSelectedSEO(null);
        }
      }
    } catch (error) {
      console.error('Failed to save SEO settings:', error);
      toast({
        title: "Error",
        description: "Failed to save SEO settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSEOSettings = async (seoId: string) => {
    try {
      const token = secureStorage.getToken();
      if (!token) return;

      const response = await fetch(
        `https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-seo?id=${seoId}`,
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
            description: "SEO settings deleted successfully"
          });
          loadSEOSettings();
        }
      }
    } catch (error) {
      console.error('Failed to delete SEO settings:', error);
      toast({
        title: "Error",
        description: "Failed to delete SEO settings",
        variant: "destructive"
      });
    }
  };

  const handleCreateNew = () => {
    setSelectedSEO({
      id: '',
      page_slug: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: [],
      og_title: '',
      og_description: '',
      og_image: '',
      canonical_url: '',
      robots_meta: 'index,follow',
      schema_markup: {},
      is_active: true,
      updated_at: ''
    });
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  const handleEdit = (seo: SEOSettings) => {
    setSelectedSEO(seo);
    setIsCreating(false);
    setIsDialogOpen(true);
  };

  const filteredSEO = seoSettings.filter(item => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.page_slug.toLowerCase().includes(searchLower) ||
      item.meta_title?.toLowerCase().includes(searchLower) ||
      item.meta_description?.toLowerCase().includes(searchLower)
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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                SEO Management
              </CardTitle>
              <CardDescription>
                Manage meta tags, Open Graph data, and structured markup for better search visibility
              </CardDescription>
            </div>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add SEO Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by page slug, title, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* SEO Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Meta Title</TableHead>
                  <TableHead>Meta Description</TableHead>
                  <TableHead>Keywords</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSEO.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{item.page_slug}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={item.meta_title}>
                        {item.meta_title || '-'}
                      </div>
                      {item.meta_title && (
                        <div className="text-xs text-gray-500">
                          {item.meta_title.length} chars
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={item.meta_description}>
                        {item.meta_description || '-'}
                      </div>
                      {item.meta_description && (
                        <div className="text-xs text-gray-500">
                          {item.meta_description.length} chars
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {item.meta_keywords && item.meta_keywords.length > 0 ? (
                          <Badge variant="outline">
                            {item.meta_keywords.length} keywords
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {item.is_active ? (
                          <>
                            <Eye className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">Inactive</span>
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
                          onClick={() => deleteSEOSettings(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* SEO Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Create SEO Settings' : 'Edit SEO Settings'}
            </DialogTitle>
            <DialogDescription>
              {isCreating ? 'Add SEO optimization for a new page' : 'Update SEO settings for this page'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSEO && (
            <SEOEditor
              seo={selectedSEO}
              onSave={saveSEOSettings}
              isSaving={isSaving}
              isCreating={isCreating}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SEOEditor = ({ 
  seo, 
  onSave, 
  isSaving, 
  isCreating 
}: { 
  seo: SEOSettings;
  onSave: (data: any) => void;
  isSaving: boolean;
  isCreating: boolean;
}) => {
  const [formData, setFormData] = useState({
    page_slug: seo.page_slug,
    meta_title: seo.meta_title || '',
    meta_description: seo.meta_description || '',
    meta_keywords: seo.meta_keywords?.join(', ') || '',
    og_title: seo.og_title || '',
    og_description: seo.og_description || '',
    og_image: seo.og_image || '',
    canonical_url: seo.canonical_url || '',
    robots_meta: seo.robots_meta,
    is_active: seo.is_active
  });

  const handleSave = () => {
    onSave({
      page_slug: formData.page_slug,
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      meta_keywords: formData.meta_keywords.split(',').map(k => k.trim()).filter(k => k),
      og_title: formData.og_title,
      og_description: formData.og_description,
      og_image: formData.og_image,
      canonical_url: formData.canonical_url,
      robots_meta: formData.robots_meta,
      is_active: formData.is_active
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic SEO */}
      <div>
        <h3 className="text-lg font-medium mb-4">Basic SEO</h3>
        <div className="space-y-4">
          <div>
            <Label>Page Slug</Label>
            <Input
              value={formData.page_slug}
              onChange={(e) => setFormData({ ...formData, page_slug: e.target.value })}
              placeholder="home, about, contact, etc."
            />
          </div>

          <div>
            <Label>Meta Title</Label>
            <Input
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              placeholder="Page title for search engines"
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.meta_title.length}/60 characters (recommended max 60)
            </p>
          </div>

          <div>
            <Label>Meta Description</Label>
            <Textarea
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              placeholder="Brief description for search engine results"
              maxLength={160}
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.meta_description.length}/160 characters (recommended max 160)
            </p>
          </div>

          <div>
            <Label>Meta Keywords</Label>
            <Input
              value={formData.meta_keywords}
              onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
              placeholder="keyword1, keyword2, keyword3"
            />
            <p className="text-xs text-gray-500 mt-1">
              Comma-separated keywords (optional for modern SEO)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Canonical URL</Label>
              <Input
                value={formData.canonical_url}
                onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                placeholder="https://example.com/page"
              />
            </div>
            <div>
              <Label>Robots Meta</Label>
              <Select 
                value={formData.robots_meta} 
                onValueChange={(value) => setFormData({ ...formData, robots_meta: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="index,follow">Index, Follow</SelectItem>
                  <SelectItem value="index,nofollow">Index, No Follow</SelectItem>
                  <SelectItem value="noindex,follow">No Index, Follow</SelectItem>
                  <SelectItem value="noindex,nofollow">No Index, No Follow</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Open Graph */}
      <div>
        <h3 className="text-lg font-medium mb-4">Open Graph / Social Media</h3>
        <div className="space-y-4">
          <div>
            <Label>OG Title</Label>
            <Input
              value={formData.og_title}
              onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
              placeholder="Title for social media shares"
            />
          </div>

          <div>
            <Label>OG Description</Label>
            <Textarea
              value={formData.og_description}
              onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
              placeholder="Description for social media shares"
              rows={2}
            />
          </div>

          <div>
            <Label>OG Image URL</Label>
            <Input
              value={formData.og_image}
              onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 1200x630 pixels
            </p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div>
        <h3 className="text-lg font-medium mb-4">Settings</h3>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          <Label htmlFor="is_active">Active (apply these SEO settings)</Label>
        </div>
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

export default SEOManager;