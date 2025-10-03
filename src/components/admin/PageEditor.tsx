import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  Layout,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { secureStorage } from '@/utils/secureStorage';

interface PageSection {
  id: string;
  section_name: string;
  content_key: string;
  content_value: any;
  content_type: string;
  is_published: boolean;
}

interface PageEditorProps {
  pageSlug: string;
  onClose: () => void;
  onSave: () => void;
}

const PageEditor = ({ pageSlug, onClose, onSave }: PageEditorProps) => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPageContent();
  }, [pageSlug]);

  const loadPageContent = async () => {
    try {
      const token = secureStorage.getToken();
      if (!token) return;

      const response = await fetch(
        `https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-cms?page_slug=${pageSlug}`,
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
          setSections(data.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to load page content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSection = (id: string, field: string, value: any) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const addSection = (sectionName: string) => {
    const newSection: PageSection = {
      id: `new-${Date.now()}`,
      section_name: sectionName,
      content_key: 'new_content',
      content_value: { text: '' },
      content_type: 'text',
      is_published: true
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
  };

  const saveAllChanges = async () => {
    try {
      setIsSaving(true);
      const token = secureStorage.getToken();
      if (!token) return;

      // Save each section
      for (const section of sections) {
        let contentValue = section.content_value;
        
        // Ensure proper format based on content_type
        if (section.content_type === 'text' || section.content_type === 'html') {
          contentValue = typeof section.content_value === 'string' 
            ? { text: section.content_value } 
            : section.content_value;
        }

        await fetch(
          'https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-cms',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              page_slug: pageSlug,
              section_name: section.section_name,
              content_key: section.content_key,
              content_value: contentValue,
              content_type: section.content_type,
              is_published: section.is_published
            })
          }
        );
      }

      toast({
        title: "Success",
        description: `Page "${pageSlug}" saved successfully`
      });
      
      onSave();
    } catch (error) {
      console.error('Failed to save changes:', error);
      toast({
        title: "Error",
        description: "Failed to save page changes",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.section_name]) {
      acc[section.section_name] = [];
    }
    acc[section.section_name].push(section);
    return acc;
  }, {} as Record<string, PageSection[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Edit Page: {pageSlug}</h2>
          <p className="text-sm text-muted-foreground">Manage all content sections for this page</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={saveAllChanges} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>

      {/* Content Sections */}
      <Tabs defaultValue={Object.keys(groupedSections)[0] || 'hero'}>
        <TabsList className="grid w-full grid-cols-auto">
          {Object.keys(groupedSections).map(sectionName => (
            <TabsTrigger key={sectionName} value={sectionName}>
              <Layout className="h-4 w-4 mr-2" />
              {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}
            </TabsTrigger>
          ))}
          <TabsTrigger value="add-new">
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </TabsTrigger>
        </TabsList>

        {Object.entries(groupedSections).map(([sectionName, sectionItems]) => (
          <TabsContent key={sectionName} value={sectionName}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Section
                </CardTitle>
                <CardDescription>
                  Edit content for the {sectionName} section of this page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {sectionItems.map((section) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    onUpdate={(field, value) => updateSection(section.id, field, value)}
                    onRemove={() => removeSection(section.id)}
                  />
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSection(sectionName)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content to {sectionName}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value="add-new">
          <Card>
            <CardHeader>
              <CardTitle>Add New Section</CardTitle>
              <CardDescription>Create a new content section for this page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['hero', 'features', 'benefits', 'cta', 'footer', 'testimonials'].map(sectionType => (
                  <Button
                    key={sectionType}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => addSection(sectionType)}
                  >
                    <Sparkles className="h-6 w-6" />
                    <span className="capitalize">{sectionType}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface SectionEditorProps {
  section: PageSection;
  onUpdate: (field: string, value: any) => void;
  onRemove: () => void;
}

const SectionEditor = ({ section, onUpdate, onRemove }: SectionEditorProps) => {
  const [contentValue, setContentValue] = useState(() => {
    if (typeof section.content_value === 'string') {
      return section.content_value;
    }
    if (section.content_value?.text) {
      return section.content_value.text;
    }
    return JSON.stringify(section.content_value, null, 2);
  });

  const handleContentChange = (value: string) => {
    setContentValue(value);
    if (section.content_type === 'text' || section.content_type === 'html') {
      onUpdate('content_value', { text: value });
    } else {
      try {
        onUpdate('content_value', JSON.parse(value));
      } catch {
        onUpdate('content_value', { text: value });
      }
    }
  };

  return (
    <Card className="border-2">
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Content Key</Label>
              <Input
                value={section.content_key}
                onChange={(e) => onUpdate('content_key', e.target.value)}
                placeholder="e.g., title, description, button_text"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Type</Label>
              <Select 
                value={section.content_type} 
                onValueChange={(value) => onUpdate('content_type', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Text
                    </div>
                  </SelectItem>
                  <SelectItem value="html">
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      HTML
                    </div>
                  </SelectItem>
                  <SelectItem value="image">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Image URL
                    </div>
                  </SelectItem>
                  <SelectItem value="button">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      Button/CTA
                    </div>
                  </SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdate('is_published', !section.is_published)}
            >
              {section.is_published ? (
                <>
                  <Eye className="h-4 w-4 mr-1" />
                  <Badge variant="default" className="text-xs">Published</Badge>
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 mr-1" />
                  <Badge variant="secondary" className="text-xs">Draft</Badge>
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground">
            Content {section.content_type === 'button' && '(Format: {"text": "Click Here", "url": "/contact"})'}
          </Label>
          <Textarea
            value={contentValue}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={
              section.content_type === 'button' 
                ? '{"text": "Get Started", "url": "/apply"}' 
                : section.content_type === 'image'
                ? 'https://example.com/image.jpg'
                : 'Enter your content here...'
            }
            rows={section.content_type === 'json' || section.content_type === 'button' ? 4 : 6}
            className={section.content_type === 'json' || section.content_type === 'button' ? 'font-mono text-sm' : ''}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PageEditor;
