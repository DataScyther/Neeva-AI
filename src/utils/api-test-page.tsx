// API Test Page Component
import React, { useState } from 'react';
import { testApiKey } from './openrouter';
import { callGemini } from './gemini';

const ApiTestPage: React.FC = () => {
  const [openRouterResult, setOpenRouterResult] = useState<string>('');
  const [geminiResult, setGeminiResult] = useState<string>('');
  const [isLoadingOpenRouter, setIsLoadingOpenRouter] = useState<boolean>(false);
  const [isLoadingGemini, setIsLoadingGemini] = useState<boolean>(false);

  const testOpenRouter = async () => {
    setIsLoadingOpenRouter(true);
    setOpenRouterResult('Testing OpenRouter API key...');
    
    try {
      const result = await testApiKey();
      setOpenRouterResult(result ? '✅ OpenRouter API Key is valid!' : '❌ OpenRouter API Key is invalid or not found');
    } catch (error) {
      setOpenRouterResult(`❌ Error testing OpenRouter API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoadingOpenRouter(false);
    }
  };

  const testGemini = async () => {
    setIsLoadingGemini(true);
    setGeminiResult('Testing Google Gemini API key...');
    
    try {
      const response = await callGemini([
        {
          role: 'user',
          parts: [{ text: 'Hello, this is a test message.' }]
        }
      ]);
      
      setGeminiResult(response ? '✅ Google Gemini API Key is valid!' : '❌ Google Gemini API Key is invalid or not found');
    } catch (error) {
      setGeminiResult(`❌ Error testing Google Gemini API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoadingGemini(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Key Tests</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>OpenRouter API Test</h2>
        <button 
          onClick={testOpenRouter} 
          disabled={isLoadingOpenRouter}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoadingOpenRouter ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {isLoadingOpenRouter ? 'Testing...' : 'Test OpenRouter API Key'}
        </button>
        {openRouterResult && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <strong>Test Result:</strong> {openRouterResult}
          </div>
        )}
      </div>
      
      <div>
        <h2>Google Gemini API Test</h2>
        <button 
          onClick={testGemini} 
          disabled={isLoadingGemini}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoadingGemini ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoadingGemini ? 'Testing...' : 'Test Google Gemini API Key'}
        </button>
        {geminiResult && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <strong>Test Result:</strong> {geminiResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTestPage;