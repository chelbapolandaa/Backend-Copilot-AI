import { OpenAI } from 'openai';
import { z } from 'zod';

export interface AIConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  enabled?: boolean;
}

export class LLMWrapper {
  private openai: OpenAI | null = null;
  private enabled: boolean = false;

  constructor(config: AIConfig = {}) {
    if (config.apiKey && config.enabled !== false) {
      this.openai = new OpenAI({ apiKey: config.apiKey });
      this.enabled = true;
      console.log('🤖 AI integration enabled');
    } else {
      console.log('⚠️ AI integration disabled');
    }
  }

  async analyzeCode<T>(
    code: string, 
    schema: z.ZodSchema<T>, 
    prompt: string
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    
    if (!this.enabled || !this.openai) {
      return {
        success: false,
        error: 'AI service not available. Set OPENAI_API_KEY in .env'
      };
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a backend code analyzer. Return ONLY valid JSON.'
          },
          {
            role: 'user',
            content: prompt.replace('{{code}}', code)
          }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return { success: false, error: 'No response from AI' };
      }

      const parsed = JSON.parse(content);
      const validated = schema.parse(parsed);
      
      return {
        success: true,
        data: validated
      };

    } catch (error: any) {
      console.error('AI analysis failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async generateOpenAPI(code: string) {
    // FIX: Zod record butuh 2 parameter
    const OpenAPISchema = z.object({
      method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
      path: z.string(),
      summary: z.string().optional(),
      description: z.string().optional(),
      parameters: z.array(z.any()).optional(),
      requestBody: z.any().optional(),
      responses: z.record(z.string(), z.any()) // FIXED: 2 parameters
    });

    const prompt = `Analyze this backend code and generate OpenAPI specification in JSON format.
Code: {{code}}

Return JSON with: method, path, summary, parameters (array), requestBody (object), responses (object)`;

    return this.analyzeCode(code, OpenAPISchema, prompt);
  }

  async analyzeController(code: string) {
    const AnalysisSchema = z.object({
      complexity: z.number(),
      issues: z.array(z.string()),
      suggestions: z.array(z.string()),
      securityConcerns: z.array(z.string()).optional()
    });

    const prompt = `Analyze this controller code and provide insights.
Code: {{code}}

Return JSON with: complexity (score 1-100), issues (array), suggestions (array), securityConcerns (array)`;

    return this.analyzeCode(code, AnalysisSchema, prompt);
  }

  async validateAuthFlow(code: string) {
    const AuthSchema = z.object({
      vulnerabilities: z.array(z.string()),
      recommendations: z.array(z.string()),
      riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    });

    const prompt = `Analyze this authentication/authorization code for security issues.
Code: {{code}}

Return JSON with: vulnerabilities (array), recommendations (array), riskLevel`;

    return this.analyzeCode(code, AuthSchema, prompt);
  }
}