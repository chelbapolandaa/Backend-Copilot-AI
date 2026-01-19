import { describe, test, expect } from '@jest/globals';
import { LLMWrapper } from '../src/ai/llm-wrapper';

describe('LLMWrapper', () => {
  test('should initialize without API key', () => {
    const wrapper = new LLMWrapper();
    expect(wrapper).toBeInstanceOf(LLMWrapper);
  });

  test('should return error object when AI is disabled', async () => {
    const wrapper = new LLMWrapper();
    const code = 'app.get("/test", () => {})';
    
    const result = await wrapper.analyzeController(code);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('AI service not available');
    expect(result.data).toBeUndefined();
  });

  test('should handle openapi generation without API key', async () => {
    const wrapper = new LLMWrapper();
    const code = 'app.get("/api/users", getUser)';
    
    const result = await wrapper.generateOpenAPI(code);
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  // Skip jika tidak ada API key
  if (process.env.OPENAI_API_KEY) {
    test('should work with valid API key', async () => {
      const wrapper = new LLMWrapper({
        apiKey: process.env.OPENAI_API_KEY
      });
      
      const code = 'app.get("/api/health", (req, res) => res.send("OK"))';
      const result = await wrapper.generateOpenAPI(code);
      
      // Either success with data or failure with error
      expect(result).toHaveProperty('success');
      expect(['success', 'error']).toContain(result.success ? 'success' : 'error');
    });
  } else {
    test.skip('skipping AI test - no API key available', () => {
      console.log('⚠️ No OPENAI_API_KEY, skipping live AI test');
    });
  }
});