import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { Card } from "@/components/ui/card";

interface CrawlResult {
  success: boolean;
  status?: string;
  completed?: number;
  total?: number;
  creditsUsed?: number;
  expiresAt?: string;
  data?: any[];
}

export const CrawlForm = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    setCrawlResult(null);
    
    try {
      if (apiKey) {
        FirecrawlService.saveApiKey(apiKey);
      }
      
      const savedApiKey = FirecrawlService.getApiKey();
      if (!savedApiKey) {
        toast({
          title: "Error",
          description: "Please enter your Firecrawl API key",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      console.log('Starting crawl for URL:', url);
      const result = await FirecrawlService.crawlWebsite(url);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Website crawled successfully",
          duration: 3000,
        });
        setCrawlResult(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to crawl website",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error crawling website:', error);
      toast({
        title: "Error",
        description: "Failed to crawl website",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-financial-navy mb-2">Import Your Website Pages</h2>
        <p className="text-foreground">Enter your current website URL to extract and import your existing pages.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium text-foreground">
            Firecrawl API Key (get one at firecrawl.dev)
          </label>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-2">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Security Notice:</strong> API keys entered here are stored in your browser's local storage and are visible in DevTools. 
              For production use, consider implementing a backend proxy to keep API keys secure.
            </p>
          </div>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full"
            placeholder="fc-..."
            required={!FirecrawlService.getApiKey()}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium text-foreground">
            Your Website URL
          </label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
            placeholder="https://yourwebsite.com"
            required
          />
        </div>
        
        {isLoading && (
          <Progress value={progress} className="w-full" />
        )}
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Crawling Website..." : "Import Website Pages"}
        </Button>
      </form>

      {crawlResult && (
        <Card className="mt-6 p-4">
          <h3 className="text-lg font-semibold mb-4 text-financial-navy">Crawl Results</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Status:</span> {crawlResult.status}</p>
            <p><span className="font-medium">Pages Found:</span> {crawlResult.completed}</p>
            <p><span className="font-medium">Credits Used:</span> {crawlResult.creditsUsed}</p>
            {crawlResult.data && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Found Pages:</p>
                <div className="bg-muted p-3 rounded max-h-60 overflow-auto">
                  {crawlResult.data.map((page: any, index: number) => (
                    <div key={index} className="mb-2 p-2 bg-background rounded border">
                      <p className="font-medium text-primary">{page.metadata?.title || 'Untitled Page'}</p>
                      <p className="text-xs text-foreground">{page.metadata?.sourceURL}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};