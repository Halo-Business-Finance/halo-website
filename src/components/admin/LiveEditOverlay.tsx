import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Save, Eye, EyeOff, Pencil } from 'lucide-react';
import { secureStorage } from '@/utils/secureStorage';
import { useToast } from '@/hooks/use-toast';

interface CMSItem {
  id?: string;
  section_name: string;
  content_key: string;
  content_value: any;
  content_type: string;
  is_published: boolean;
  updated_at?: string;
}

function pathToSlug(pathname: string): string {
  if (pathname === '/' || pathname === '') return 'home';
  return pathname.replace(/^\//, '');
}

export default function LiveEditOverlay() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const editMode = params.get('edit') === '1' || params.get('cms') === '1' || params.get('liveEdit') === '1';
  const pageSlug = pathToSlug(location.pathname);

  const [items, setItems] = useState<CMSItem[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check for token in URL params first (from Live Edit button), then secure storage
    const urlToken = params.get('token');
    const token = urlToken || secureStorage.getToken();
    if (!editMode || !token) return;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-cms?page_slug=${encodeURIComponent(pageSlug)}`,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        if (res.status === 401) {
          secureStorage.clearSession();
          toast({ title: 'Session expired', description: 'Sign in again to edit.', variant: 'destructive' });
          return;
        }
        const data = await res.json();
        if (data?.success) {
          setItems((data.data || []).map((d: any) => ({
            id: d.id,
            section_name: d.section_name,
            content_key: d.content_key,
            content_value: d.content_value,
            content_type: d.content_type,
            is_published: d.is_published,
            updated_at: d.updated_at,
          })));
        }
      } catch (e) {
        console.error('Live editor load error', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [editMode, pageSlug, toast]);

  const handleSave = async () => {
    const urlToken = params.get('token');
    const token = urlToken || secureStorage.getToken();
    if (!token) return;
    try {
      setIsSaving(true);
      for (const item of items) {
        let value = item.content_value;
        if (item.content_type === 'text' || item.content_type === 'html') {
          value = typeof value === 'string' ? { text: value } : value;
        }
        await fetch('https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-cms', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_slug: pageSlug,
            section_name: item.section_name,
            content_key: item.content_key,
            content_value: value,
            content_type: item.content_type,
            is_published: item.is_published,
          }),
        });
      }
      toast({ title: 'Saved', description: 'Page content saved. Reloading preview...' });
      setTimeout(() => window.location.reload(), 600);
    } catch (e) {
      console.error('Live save error', e);
      toast({ title: 'Save failed', description: 'Could not save changes', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const exitEditMode = () => {
    const newParams = new URLSearchParams(location.search);
    newParams.delete('edit');
    newParams.delete('cms');
    newParams.delete('liveEdit');
    navigate({ pathname: location.pathname, search: newParams.toString() }, { replace: true });
  };

  if (!editMode) return null;

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, width: 360 }}>
      <Card className="shadow-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2"><Pencil className="h-4 w-4" /> Live Edit</span>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </CardTitle>
          <CardDescription>Edit content for: /{pageSlug === 'home' ? '' : pageSlug}</CardDescription>
        </CardHeader>
        {isOpen && (
          <CardContent className="space-y-4 max-h-[70vh] overflow-auto">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading page content…</div>
            ) : items.length === 0 ? (
              <div className="text-sm text-muted-foreground">No CMS entries for this page yet.</div>
            ) : (
              items.map((item, idx) => (
                <div key={`${item.section_name}-${item.content_key}-${idx}`} className="border rounded-md p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{item.section_name}</Badge>
                    <Badge variant={item.is_published ? 'default' : 'secondary'}>{item.is_published ? 'Published' : 'Draft'}</Badge>
                  </div>
                  <Label className="text-xs">Key</Label>
                  <Input value={item.content_key} onChange={(e) => {
                    const v = e.target.value; setItems(prev => prev.map((it, i) => i===idx ? { ...it, content_key: v } : it));
                  }} />
                  <Label className="text-xs">Type</Label>
                  <Select value={item.content_type} onValueChange={(v) => setItems(prev => prev.map((it, i) => i===idx ? { ...it, content_type: v } : it))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="image">Image URL</SelectItem>
                      <SelectItem value="button">Button/CTA</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label className="text-xs">Value</Label>
                  <Textarea
                    className={item.content_type === 'json' || item.content_type === 'button' ? 'font-mono text-xs' : ''}
                    rows={item.content_type === 'json' || item.content_type === 'button' ? 4 : 5}
                    value={typeof item.content_value === 'string' ? item.content_value : (item.content_value?.text ?? JSON.stringify(item.content_value, null, 2))}
                    onChange={(e) => {
                      const val = e.target.value;
                      setItems(prev => prev.map((it, i) => i===idx ? { ...it, content_value: val } : it));
                    }}
                  />
                </div>
              ))
            )}
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaving || items.length === 0} className="flex-1">
                <Save className="h-4 w-4 mr-2" /> {isSaving ? 'Saving…' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={exitEditMode}>
                <X className="h-4 w-4 mr-2" /> Exit
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
