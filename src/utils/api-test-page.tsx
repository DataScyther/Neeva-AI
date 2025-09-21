// API Test Page Component
import React, { useState } from 'react';
import { testApiKey } from './openrouter';

const ApiTestPage: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const runTest = async () => {
    setIsLoading(true);
    setTestResult('Testing API key...');
    
    try {
      const result = await testApiKey();
      setTestResult(result ? '✅ API Key is valid!' : '❌ API Key is invalid or not found');
    } catch (error) {
      setTestResult(`❌ Error testing API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>OpenRouter API Key Test</h1>
      <button 
        onClick={runTest} 
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Testing...' : 'Test API Key'}
      </button>
      {testResult && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <strong>Test Result:</strong> {testResult}
        </div>
      )}
    </div>
  );
};

export default ApiTestPage;