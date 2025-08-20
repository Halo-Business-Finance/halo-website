import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface ConnectionTest {
  name: string;
  status: 'loading' | 'success' | 'error';
  message: string;
  details?: string;
}

export const AuthDebugger: React.FC = () => {
  const [tests, setTests] = useState<ConnectionTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const newTests: ConnectionTest[] = [
      { name: 'Supabase Client Connection', status: 'loading', message: 'Testing...' },
      { name: 'Auth Service', status: 'loading', message: 'Testing...' },
      { name: 'Database Connection', status: 'loading', message: 'Testing...' },
      { name: 'Security Events Table', status: 'loading', message: 'Testing...' },
      { name: 'User Roles Table', status: 'loading', message: 'Testing...' },
      { name: 'Edge Functions', status: 'loading', message: 'Testing...' }
    ];
    
    setTests(newTests);

    // Test 1: Supabase Client Connection
    try {
      const { data, error } = await supabase.auth.getSession();
      newTests[0] = {
        name: 'Supabase Client Connection',
        status: 'success',
        message: 'Connected successfully',
        details: `Session: ${data.session ? 'Active' : 'None'}`
      };
    } catch (error: any) {
      newTests[0] = {
        name: 'Supabase Client Connection',
        status: 'error',
        message: 'Connection failed',
        details: error.message
      };
    }
    setTests([...newTests]);

    // Test 2: Auth Service
    try {
      // Test if we can call auth.getUser (even if no user is logged in)
      const { error } = await supabase.auth.getUser();
      if (error && !error.message.includes('session_not_found')) {
        throw error;
      }
      newTests[1] = {
        name: 'Auth Service',
        status: 'success',
        message: 'Auth service available',
        details: 'Can communicate with Supabase Auth'
      };
    } catch (error: any) {
      newTests[1] = {
        name: 'Auth Service',
        status: 'error',
        message: 'Auth service error',
        details: error.message
      };
    }
    setTests([...newTests]);

    // Test 3: Database Connection (try to read from a public table)
    try {
      const { error } = await supabase
        .from('security_events')
        .select('id')
        .limit(1);
      
      if (error) {
        newTests[2] = {
          name: 'Database Connection',
          status: 'error',
          message: 'Database access failed',
          details: error.message
        };
      } else {
        newTests[2] = {
          name: 'Database Connection',
          status: 'success',
          message: 'Database accessible',
          details: 'Can query security_events table'
        };
      }
    } catch (error: any) {
      newTests[2] = {
        name: 'Database Connection',
        status: 'error',
        message: 'Database connection failed',
        details: error.message
      };
    }
    setTests([...newTests]);

    // Test 4: Security Events Table
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('count')
        .limit(1);
        
      if (error) {
        newTests[3] = {
          name: 'Security Events Table',
          status: 'error',
          message: 'Table access error',
          details: error.message
        };
      } else {
        newTests[3] = {
          name: 'Security Events Table',
          status: 'success',
          message: 'Table accessible',
          details: 'Security events table is working'
        };
      }
    } catch (error: any) {
      newTests[3] = {
        name: 'Security Events Table',
        status: 'error',
        message: 'Table query failed',
        details: error.message
      };
    }
    setTests([...newTests]);

    // Test 5: User Roles Table
    try {
      const { error } = await supabase
        .from('user_roles')
        .select('count')
        .limit(1);
        
      if (error) {
        newTests[4] = {
          name: 'User Roles Table',
          status: 'error',
          message: 'User roles table error',
          details: error.message
        };
      } else {
        newTests[4] = {
          name: 'User Roles Table',
          status: 'success',
          message: 'User roles table working',
          details: 'Can access user_roles table'
        };
      }
    } catch (error: any) {
      newTests[4] = {
        name: 'User Roles Table',
        status: 'error',
        message: 'User roles table failed',
        details: error.message
      };
    }
    setTests([...newTests]);

    // Test 6: Edge Functions
    try {
      const { error } = await supabase.functions.invoke('log-security-event', {
        body: {
          event_type: 'debug_test',
          severity: 'info',
          event_data: { test: true },
          source: 'auth_debugger'
        }
      });
      
      if (error) {
        newTests[5] = {
          name: 'Edge Functions',
          status: 'error',
          message: 'Edge function error',
          details: error.message
        };
      } else {
        newTests[5] = {
          name: 'Edge Functions',
          status: 'success',
          message: 'Edge functions working',
          details: 'Successfully called log-security-event'
        };
      }
    } catch (error: any) {
      newTests[5] = {
        name: 'Edge Functions',
        status: 'error',
        message: 'Edge function failed',
        details: error.message
      };
    }
    setTests([...newTests]);

    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'loading': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      loading: 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const hasErrors = tests.some(test => test.status === 'error');
  const allComplete = tests.length > 0 && tests.every(test => test.status !== 'loading');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Auth System Diagnostic
        </CardTitle>
        <CardDescription>
          Testing authentication and database connectivity to identify potential issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasErrors && allComplete && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Issues detected with your authentication system. Please check the Supabase configuration:
              <br />
              • Verify Site URL and Redirect URLs in Supabase Auth settings
              <br />
              • Check if RLS policies are properly configured
              <br />
              • Ensure all required tables exist and are accessible
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-muted-foreground">{test.message}</div>
                  {test.details && (
                    <div className="text-xs text-muted-foreground mt-1">{test.details}</div>
                  )}
                </div>
              </div>
              {getStatusBadge(test.status)}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            Run Diagnostic Again
          </Button>
        </div>

        {allComplete && !hasErrors && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              All authentication systems are working correctly. If you're still experiencing issues, 
              please check your Supabase project settings:
              <br />
              • Authentication → URL Configuration
              <br />
              • Ensure your domain is added to allowed redirect URLs
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};