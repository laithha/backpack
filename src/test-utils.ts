import { NextRequest } from 'next/server';

// Helper function to create a NextRequest for testing
export function createMockRequest(options: {
  method?: string;
  url?: string;
  body?: any;
  headers?: Record<string, string>;
}): NextRequest {
  const { 
    method = 'GET', 
    url = 'http://localhost:3000', 
    body = null,
    headers = {} 
  } = options;
  
  // Create Headers object
  const headersObj = new Headers();
  Object.entries(headers).forEach(([key, value]) => {
    headersObj.append(key, value);
  });
  
  // Add content-type header for requests with body
  if (body && !headers['content-type']) {
    headersObj.append('content-type', 'application/json');
  }
  
  // Create and return request
  return new NextRequest(url, {
    method,
    headers: headersObj,
    body: body ? JSON.stringify(body) : undefined
  });
} 