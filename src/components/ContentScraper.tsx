import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ExternalLink } from "lucide-react";
import { SecurityNotice } from "@/components/SecurityNotice";

interface ScrapedContent {
  title?: string;
  content?: string;
  markdown?: string;
  metadata?: any;
}

export const ContentScraper = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [url, setUrl] = useState('https://halobusinessfinance.com');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrapedContent, setScrapedContent] = useState<ScrapedContent | null>(null);
  const [isApiKeySet, setIsApiKeySet] = useState(false);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    FirecrawlService.saveApiKey(apiKey.trim());
    setIsApiKeySet(true);
    toast({
      title: "Success",
      description: "API key saved successfully",
      duration: 3000,
    });
  };

  const handleScrape = async () => {
    if (!isApiKeySet) {
      toast({
        title: "Error",
        description: "Please set your API key first",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setScrapedContent(null);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 500);
    
    try {
      console.log('Starting scrape for URL:', url);
      const result = await FirecrawlService.scrapeWebsite(url);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result.success && result.data) {
        toast({
          title: "Success",
          description: "Website scraped successfully",
          duration: 3000,
        });
        setScrapedContent(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to scrape website",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error scraping website:', error);
      toast({
        title: "Error",
        description: "Failed to scrape website",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
      duration: 2000,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Website Content Scraper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isApiKeySet && (
            <>
              <SecurityNotice type="api-key" className="mb-4" />
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">API Key Required</h3>
                <p className="text-sm text-yellow-700 mb-3">
                  You need a Firecrawl API key to scrape websites. Get one at{' '}
                  <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="underline">
                    firecrawl.dev
                  </a>
                </p>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Firecrawl API key"
                    className="flex-1"
                  />
                  <Button onClick={handleSaveApiKey}>Save Key</Button>
                </div>
              </div>
            </>
          )}

          {isApiKeySet && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium">
                  Website URL to Scrape
                </label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                />
              </div>

              {isLoading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Scraping website...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <Button
                onClick={handleScrape}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Scraping..." : "Scrape Website"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {scrapedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Scraped Content</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(scrapedContent.markdown || scrapedContent.content || '')}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scrapedContent.title && (
              <div>
                <h3 className="font-semibold mb-2">Title</h3>
                <p className="text-sm bg-gray-50 p-2 rounded">{scrapedContent.title}</p>
              </div>
            )}
            
            {scrapedContent.markdown && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Content (Markdown)</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(scrapedContent.markdown || '')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={scrapedContent.markdown}
                  readOnly
                  className="min-h-[300px] font-mono text-xs"
                />
              </div>
            )}

            {scrapedContent.content && !scrapedContent.markdown && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Content</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(scrapedContent.content || '')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={scrapedContent.content}
                  readOnly
                  className="min-h-[300px] text-xs"
                />
              </div>
            )}

            {scrapedContent.metadata && (
              <div>
                <h3 className="font-semibold mb-2">Metadata</h3>
                <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(scrapedContent.metadata, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};