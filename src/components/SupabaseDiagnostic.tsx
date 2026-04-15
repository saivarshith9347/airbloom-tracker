/**
 * Supabase Diagnostic Component
 * Shows environment variable status
 * Remove this component after debugging
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function SupabaseDiagnostic() {
  const [status, setStatus] = useState<{
    urlLoaded: boolean;
    keyLoaded: boolean;
    connectionTest: 'pending' | 'success' | 'error';
    errorMessage?: string;
  }>({
    urlLoaded: false,
    keyLoaded: false,
    connectionTest: 'pending',
  });

  useEffect(() => {
    const checkStatus = async () => {
      // Check environment variables
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

      console.log('[Diagnostic] Supabase URL:', url);
      console.log('[Diagnostic] Supabase Key:', key ? `${key.substring(0, 20)}...` : 'undefined');

      const urlLoaded = !!url && url !== '';
      const keyLoaded = !!key && key !== '';

      // Test connection
      let connectionTest: 'pending' | 'success' | 'error' = 'pending';
      let errorMessage: string | undefined;

      if (urlLoaded && keyLoaded) {
        try {
          const { data, error } = await supabase
            .from('devices')
            .select('count')
            .limit(1);

          if (error) {
            connectionTest = 'error';
            errorMessage = error.message;
            console.error('[Diagnostic] Connection error:', error);
          } else {
            connectionTest = 'success';
            console.log('[Diagnostic] Connection successful');
          }
        } catch (err: any) {
          connectionTest = 'error';
          errorMessage = err.message;
          console.error('[Diagnostic] Connection error:', err);
        }
      } else {
        connectionTest = 'error';
        errorMessage = 'Environment variables not loaded';
      }

      setStatus({ urlLoaded, keyLoaded, connectionTest, errorMessage });
    };

    checkStatus();
  }, []);

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50 dark:bg-blue-950">
      <CardHeader>
        <CardTitle className="text-sm">🔍 Supabase Diagnostic</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          {status.urlLoaded ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <span>
            VITE_SUPABASE_URL: {status.urlLoaded ? '✅ Loaded' : '❌ Missing'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {status.keyLoaded ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <span>
            VITE_SUPABASE_ANON_KEY: {status.keyLoaded ? '✅ Loaded' : '❌ Missing'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {status.connectionTest === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : status.connectionTest === 'error' ? (
            <XCircle className="h-4 w-4 text-red-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          )}
          <span>
            Connection Test:{' '}
            {status.connectionTest === 'success'
              ? '✅ Connected'
              : status.connectionTest === 'error'
              ? '❌ Failed'
              : '⏳ Testing...'}
          </span>
        </div>

        {status.errorMessage && (
          <div className="mt-2 p-2 bg-red-100 dark:bg-red-900 rounded text-xs">
            <strong>Error:</strong> {status.errorMessage}
          </div>
        )}

        {!status.urlLoaded || !status.keyLoaded ? (
          <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 rounded text-xs">
            <strong>Fix:</strong> Add environment variables to Vercel and redeploy
          </div>
        ) : null}

        <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
          <p>Check browser console (F12) for detailed logs</p>
        </div>
      </CardContent>
    </Card>
  );
}
