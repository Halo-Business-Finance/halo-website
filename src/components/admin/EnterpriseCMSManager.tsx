import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Edit, 
  Search,
  Upload,
  Globe,
  Eye,
  Layers,
  Layout,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { secureStorage } from '@/utils/secureStorage';
import PageEditor from './PageEditor';

function slugToPath(slug: string) { return slug === 'home' ? '/' : `/${slug}`; }

interface PageSummary {
  page_slug: string;
  total_sections: number;
  published_count: number;
  draft_count: number;
  last_updated: string;
}

const EnterpriseCMSManager = () => {
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
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
          // Group content by page
          const contentByPage = data.data.reduce((acc: any, item: any) => {
            if (!acc[item.page_slug]) {
              acc[item.page_slug] = {
                page_slug: item.page_slug,
                items: [],
                last_updated: item.updated_at
              };
            }
            acc[item.page_slug].items.push(item);
            if (new Date(item.updated_at) > new Date(acc[item.page_slug].last_updated)) {
              acc[item.page_slug].last_updated = item.updated_at;
            }
            return acc;
          }, {});

          const pageSummaries: PageSummary[] = Object.values(contentByPage).map((page: any) => ({
            page_slug: page.page_slug,
            total_sections: page.items.length,
            published_count: page.items.filter((item: any) => item.is_published).length,
            draft_count: page.items.filter((item: any) => !item.is_published).length,
            last_updated: page.last_updated
          }));

          setPages(pageSummaries);
        }
      }
    } catch (error) {
      console.error('Failed to load pages:', error);
      toast({
        title: "Error",
        description: "Failed to load CMS pages",
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

      await loadPages();
    } catch (error) {
      console.error('Error importing pages:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import pages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPage = (pageSlug: string) => {
    setSelectedPage(pageSlug);
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setSelectedPage(null);
  };

  const handleEditorSave = () => {
    setIsEditorOpen(false);
    setSelectedPage(null);
    loadPages();
  };

  const filteredPages = pages.filter(page => 
    !searchTerm || page.page_slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && pages.length === 0) {
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
                <Layers className="h-5 w-5" />
                Enterprise Content Management
              </CardTitle>
              <CardDescription>
                WordPress-style page editor with visual content management
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleImportPages} variant="outline" disabled={isLoading}>
                <Upload className="h-4 w-4 mr-2" />
                {isLoading ? 'Importing...' : 'Import Site Pages'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Pages Grid */}
          {filteredPages.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No pages found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click "Import Site Pages" to automatically discover and import all your website pages
              </p>
              <Button onClick={handleImportPages} disabled={isLoading}>
                <Upload className="h-4 w-4 mr-2" />
                Import Site Pages
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPages.map((page) => (
                <Card key={page.page_slug} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base font-semibold">
                          {page.page_slug}
                        </CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {page.total_sections} sections
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">{page.published_count}</span>
                        <span className="text-muted-foreground">published</span>
                      </div>
                      {page.draft_count > 0 && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-orange-600" />
                          <span className="text-orange-600 font-medium">{page.draft_count}</span>
                          <span className="text-muted-foreground">drafts</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Updated {new Date(page.last_updated).toLocaleDateString()}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
                        variant="outline"
                        onClick={() => window.open(`${slugToPath(page.page_slug)}?edit=1`, '_blank')}
                      >
                        Live Edit
                      </Button>
                      <Button 
                        className="transition-colors" 
                        variant="outline"
                        onClick={() => handleEditPage(page.page_slug)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit in CMS
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Page Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedPage && (
            <PageEditor
              pageSlug={selectedPage}
              onClose={handleEditorClose}
              onSave={handleEditorSave}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnterpriseCMSManager;
