import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export const SecurityEventCleaner: React.FC = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [eventCount, setEventCount] = useState<number | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchEventCount();
    }
  }, [isAdmin]);

  const fetchEventCount = async () => {
    try {
      const { count, error } = await supabase
        .from('security_events')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .not('severity', 'in', '(critical,high)');
      
      if (error) throw error;
      setEventCount(count || 0);
    } catch (error) {
      console.error('Error fetching event count:', error);
    }
  };

  const cleanupEvents = async () => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      // Call the cleanup function created in the migration
      const { error } = await supabase.rpc('cleanup_security_events');
      
      if (error) throw error;
      
      toast({
        title: "Security Event Cleanup Complete",
        description: "Successfully cleaned up old security events for better performance.",
      });
      
      fetchEventCount();
    } catch (error) {
      console.error('Error during cleanup:', error);
      toast({
        title: "Cleanup Failed",
        description: "Failed to clean up security events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Security Event Database Status: {eventCount !== null ? `${eventCount.toLocaleString()} old events` : 'Loading...'}
          {eventCount && eventCount > 1000 && (
            <span className="text-destructive"> - Performance impact detected</span>
          )}
        </AlertDescription>
      </Alert>
      
      {eventCount && eventCount > 1000 && (
        <Button 
          onClick={cleanupEvents}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? 'Cleaning...' : `Clean Up ${eventCount.toLocaleString()} Old Events`}
        </Button>
      )}
    </div>
  );
};