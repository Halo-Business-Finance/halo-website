import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, Loader2 } from 'lucide-react';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';
import { useToast } from '@/hooks/use-toast';

const BackgroundRemover = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show original image
    const originalUrl = URL.createObjectURL(file);
    setOriginalImage(originalUrl);
    setProcessedImage(null);

    try {
      setIsProcessing(true);
      toast({
        title: "Processing",
        description: "Removing background from your image...",
      });

      // Load image and remove background
      const imageElement = await loadImage(file);
      const processedBlob = await removeBackground(imageElement);
      
      // Create URL for processed image
      const processedUrl = URL.createObjectURL(processedBlob);
      setProcessedImage(processedUrl);

      toast({
        title: "Success!",
        description: "Background removed successfully. You can now download the transparent image.",
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to remove background. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'sba-logo-transparent.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">SBA Logo Background Remover</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="text-center">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary transition-colors">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium">Upload SBA Logo</p>
                <p className="text-sm text-muted-foreground">Click to select your SBA logo image</p>
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Removing background...</p>
              <p className="text-sm text-muted-foreground">This may take a few moments</p>
            </div>
          )}

          {/* Image Comparison */}
          {originalImage && !isProcessing && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Original</h3>
                <div className="border rounded-lg p-4 bg-gray-100">
                  <img src={originalImage} alt="Original SBA Logo" className="w-full h-auto" />
                </div>
              </div>
              
              {processedImage && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Transparent Background</h3>
                  <div className="border rounded-lg p-4" style={{
                    backgroundImage: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px'
                  }}>
                    <img src={processedImage} alt="Transparent SBA Logo" className="w-full h-auto" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Download Button */}
          {processedImage && (
            <div className="text-center">
              <Button onClick={downloadImage} size="lg" className="gap-2">
                <Download className="h-4 w-4" />
                Download Transparent Logo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BackgroundRemover;