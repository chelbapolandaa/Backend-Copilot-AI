import { describe, test, expect, jest } from '@jest/globals';
import { LLMWrapper } from '../src/ai/llm-wrapper';

describe('LLMWrapper', () => {
  test('should initialize without API key', () => {
    const wrapper = new LLMWrapper();
    // Should not throw error
    expect(wrapper).toBeInstanceOf(LLMWrapper);
  });

  test('should fail analysis when AI is disabled', async () => {
    const wrapper = new LLMWrapper();
    const code = 'app.get("/test", () => {})';
    
    await expect(wrapper.analyzeController(code))
      .rejects
      .toThrow('AI service not available');
  });

  // Mock test for when API key is available
  test('mock AI analysis', () => {
    // This test will only work when OPENAI_API_KEY is set
    if (!process.env.OPENAI_API_KEY) {
      console.log('Skipping AI test - no API key');
      return;
    }
    
    const wrapper = new LLMWrapper({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    expect(wrapper).toBeInstanceOf(LLMWrapper);
  });
});