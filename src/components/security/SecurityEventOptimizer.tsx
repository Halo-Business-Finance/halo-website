import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Shield, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SecurityEventOptimizer: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStats, setOptimizationStats] = useState<{
    totalEvents: number;
    cleanedEvents: number;
  } | null>(null);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  if (!isAdmin) {
    return null;
  }

  const optimizeSecurityEvents = async () => {
    setIsOptimizing(true);
    try {
      // Get current event count for comparison
      const { count: beforeCount } = await supabase
        .from('security_events')
        .select('*', { count: 'exact', head: true });

      // Call the optimization function
      const { data, error } = await supabase.rpc('optimize_security_events');

      if (error) throw error;

      // Get updated count
      const { count: afterCount } = await supabase
        .from('security_events')
        .select('*', { count: 'exact', head: true });

      const cleanedCount = data || 0;
      setOptimizationStats({
        totalEvents: afterCount || 0,
        cleanedEvents: cleanedCount
      });

      toast({
        title: 'Security Events Optimized',
        description: `Cleaned up ${cleanedCount} redundant security events`,
      });
    } catch (error: any) {
      console.error('Error optimizing security events:', error);
      toast({
        title: 'Optimization Failed',
        description: error.message || 'Failed to optimize security events',
        variant: 'destructive',
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <Card className="border-warning">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-warning" />
          Security Event Optimization
        </CardTitle>
        <CardDescription>
          Clean up redundant and excessive security events to improve system performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This will remove duplicate low-severity events and excessive client logs while preserving critical security data.
          </AlertDescription>
        </Alert>

        {optimizationStats && (
          <Alert className="border-success bg-success/5">
            <Shield className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              <strong>Last Optimization:</strong> Removed {optimizationStats.cleanedEvents} events. 
              Current total: {optimizationStats.totalEvents} events.
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={optimizeSecurityEvents}
          disabled={isOptimizing}
          variant="outline"
          className="w-full"
        >
          {isOptimizing ? 'Optimizing Events...' : 'Optimize Security Events'}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Removes duplicate low-severity events from the same IP within 1 hour</p>
          <p>• Cleans up excessive client log events older than 30 minutes</p>
          <p>• Preserves all critical and high-severity security events</p>
          <p>• Improves system performance and threat detection accuracy</p>
        </div>
      </CardContent>
    </Card>
  );
};