import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, TrendingUp, Search, Link, BarChart3, Eye } from 'lucide-react';
import { SEMrushService } from '@/utils/SEMrushService';

interface SEMrushWidgetsProps {
  domain?: string;
}

const SEMrushWidgets = ({ domain = 'halobusinessfinance.com' }: SEMrushWidgetsProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [domainData, setDomainData] = useState<any>(null);
  const [keywords, setKeywords] = useState<any>(null);
  const [backlinks, setBacklinks] = useState<any>(null);

  const fetchDomainData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [domainOverview, keywordRankings, backlinkData] = await Promise.all([
        SEMrushService.getDomainOverview(domain),
        SEMrushService.getKeywordRankings(domain, 25),
        SEMrushService.getBacklinks(domain, 50)
      ]);
      
      setDomainData(domainOverview);
      setKeywords(keywordRankings);
      setBacklinks(backlinkData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch SEMrush data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomainData();
  }, [domain]);

  if (error) {
    return (
      <Alert>
        <AlertDescription>
          {error}. Please ensure your SEMrush API key is configured properly.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SEMrush Analytics Dashboard</h2>
          <p className="text-muted-foreground">Domain: {domain}</p>
        </div>
        <Button onClick={fetchDomainData} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Authority Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">Domain authority rating</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Organic Keywords</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">Ranking keywords</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Backlinks</CardTitle>
                <Link className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">Total referring domains</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Traffic</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">Estimated organic traffic</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Domain Overview</CardTitle>
              <CardDescription>Comprehensive domain analysis data</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded overflow-auto max-h-64">
                {domainData || 'Click "Refresh Data" to load SEMrush analytics'}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Rankings</CardTitle>
              <CardDescription>Top performing organic keywords</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded overflow-auto max-h-96">
                {keywords || 'Loading keyword data...'}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backlinks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backlink Profile</CardTitle>
              <CardDescription>Recent backlinks and referring domains</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded overflow-auto max-h-96">
                {backlinks || 'Loading backlink data...'}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Analysis</CardTitle>
              <CardDescription>Key competitors in your market</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Badge variant="outline">Feature requires API key configuration</Badge>
                <p className="text-sm text-muted-foreground">
                  Configure your SEMrush API key to view detailed competitor analysis including:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Competitive positioning analysis</li>
                  <li>Keyword gap analysis</li>
                  <li>Backlink comparison</li>
                  <li>Traffic share insights</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* SEMrush Widget Embed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            SEMrush Position Tracking Widget
          </CardTitle>
          <CardDescription>
            Embedded SEMrush widget for real-time position tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-8 text-center rounded-lg">
            <p className="text-sm text-muted-foreground mb-4">
              SEMrush widget will appear here once you configure your project ID
            </p>
            <div 
              id="semrush-widget" 
              className="min-h-[300px] border-2 border-dashed border-muted-foreground/20 rounded flex items-center justify-center"
            >
              <div className="text-center">
                <Eye className="h-12 w-12 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-muted-foreground">SEMrush Widget Placeholder</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Replace YOUR_SEMRUSH_PROJECT_ID in index.html
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEMrushWidgets;