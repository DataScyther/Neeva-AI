import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { testOpenRouterAPI } from '../utils/test-openrouter';

export function DebugPanel() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAPI = async () => {
    setIsLoading(true);
    setLogs([]);
    addLog('Starting OpenRouter API test...');
    
    try {
      await testOpenRouterAPI();
      addLog('✅ API test completed successfully');
    } catch (error) {
      addLog(`❌ API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkEnvVars = () => {
    setLogs([]);
    const apiKey = (import.meta as any).env.VITE_OPENROUTER_API_KEY;
    const model = (import.meta as any).env.VITE_OPENROUTER_MODEL;
    const baseUrl = (import.meta as any).env.VITE_OPENROUTER_BASE_URL;
    
    addLog(`API Key: ${apiKey ? '✅ Present' : '❌ Missing'}`);
    addLog(`Model: ${model || 'Using default'}`);
    addLog(`Base URL: ${baseUrl || 'Using default'}`);
  };

  return (
    <Card className="m-4 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🐛 Debug Panel 
          <Badge variant="outline">Development Only</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={checkEnvVars} variant="outline" size="sm">
            Check Environment
          </Button>
          <Button onClick={testAPI} disabled={isLoading} size="sm">
            {isLoading ? 'Testing...' : 'Test API'}
          </Button>
        </div>
        
        {logs.length > 0 && (
          <div className="bg-gray-100 p-3 rounded-md max-h-40 overflow-y-auto">
            <div className="text-xs font-mono space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="text-gray-800">{log}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
