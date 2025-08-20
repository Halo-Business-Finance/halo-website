import { supabase } from '@/integrations/supabase/client';

/**
 * Utility functions for security data cleanup and maintenance
 */

/**
 * Manually trigger security event cleanup
 * This should be called periodically by an admin or scheduled task
 */
export const triggerSecurityCleanup = async (): Promise<{ success: boolean; cleanedCount?: number; error?: string }> => {
  try {
    const { data, error } = await supabase.rpc('cleanup_security_events');
    
    if (error) {
      console.error('Security cleanup error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, cleanedCount: typeof data === 'number' ? data : 0 };
  } catch (error) {
    console.error('Security cleanup failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown cleanup error' 
    };
  }
};

/**
 * Get security event statistics for monitoring
 */
export const getSecurityEventStats = async (): Promise<{
  success: boolean;
  stats?: {
    totalEvents: number;
    criticalEvents: number;
    lastCleanup: string | null;
  };
  error?: string;
}> => {
  try {
    const { data: events, error: eventsError } = await supabase
      .from('security_events')
      .select('severity, created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    if (eventsError) {
      return { success: false, error: eventsError.message };
    }
    
    const totalEvents = events?.length || 0;
    const criticalEvents = events?.filter(e => e.severity === 'critical').length || 0;
    
    return {
      success: true,
      stats: {
        totalEvents,
        criticalEvents,
        lastCleanup: null // Would need additional tracking for this
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get stats'
    };
  }
};