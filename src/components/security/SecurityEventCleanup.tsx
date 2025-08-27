import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Database, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CleanupStats {
  cleaned_events: number;
  client_log_events_cleaned: number;
  total_events_before: number;
  total_events_after: number;
}

export const SecurityEventCleanup = () => {
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [lastCleanup, setLastCleanup] = useState<CleanupStats | null>(null);

  const performCleanup = async () => {
    setIsCleaningUp(true);
    try {
      // Get count before cleanup
      const { count: beforeCount } = await supabase
        .from('security_events')
        .select('*', { count: 'exact', head: true });

      // Clean up excessive client_log events
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const { error: clientLogError } = await supabase
        .from('security_events')
        .delete()
        .eq('event_type', 'client_log')
        .in('severity', ['info', 'low', 'medium'])
        .lt('created_at', thirtyMinutesAgo);

      if (clientLogError) {
        console.error('Error cleaning client_log events:', clientLogError);
        throw new Error('Failed to clean client_log events');
      }

      // Clean up old low-priority events
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { error: lowPriorityError } = await supabase
        .from('security_events')
        .delete()
        .eq('severity', 'info')
        .in('event_type', ['page_view', 'ui_interaction', 'session_heartbeat'])
        .lt('created_at', oneDayAgo);

      if (lowPriorityError) {
        console.error('Error cleaning low-priority events:', lowPriorityError);
        throw new Error('Failed to clean low-priority events');
      }

      // Call the optimize function via RPC
      const { data: optimizeResult, error: optimizeError } = await supabase
        .rpc('optimize_security_events');

      if (optimizeError) {
        console.error('Error calling optimize function:', optimizeError);
        // Continue anyway - manual cleanup was done
      }

      // Get count after cleanup
      const { count: afterCount } = await supabase
        .from('security_events')
        .select('*', { count: 'exact', head: true });

      const stats: CleanupStats = {
        cleaned_events: (beforeCount || 0) - (afterCount || 0),
        client_log_events_cleaned: 0, // Would need more detailed tracking
        total_events_before: beforeCount || 0,
        total_events_after: afterCount || 0
      };

      setLastCleanup(stats);
      toast.success(`Security cleanup completed. Removed ${stats.cleaned_events} events.`);

    } catch (error: any) {
      console.error('Cleanup failed:', error);
      toast.error(`Cleanup failed: ${error.message}`);
    } finally {
      setIsCleaningUp(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Security Event Cleanup
        </CardTitle>
        <CardDescription>
          Clean up excessive security events and optimize database performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Cleanup Actions
            </p>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Remove excessive client_log events older than 30 minutes</li>
              <li>• Clean up low-priority events older than 24 hours</li>
              <li>• Deduplicate similar events from same IP addresses</li>
              <li>• Optimize database indexes for better performance</li>
            </ul>
          </div>
        </div>

        <Button 
          onClick={performCleanup}
          disabled={isCleaningUp}
          className="w-full"
        >
          {isCleaningUp ? 'Cleaning up...' : 'Run Security Cleanup'}
        </Button>

        {lastCleanup && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Last Cleanup Results
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-green-700 dark:text-green-300">
              <div>
                <strong>Events Before:</strong> {lastCleanup.total_events_before}
              </div>
              <div>
                <strong>Events After:</strong> {lastCleanup.total_events_after}
              </div>
              <div className="col-span-2">
                <strong>Total Cleaned:</strong> {lastCleanup.cleaned_events} events
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};