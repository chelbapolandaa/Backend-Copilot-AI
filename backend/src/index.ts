import Fastify from 'fastify';
import { AuthValidator } from './analyzers/auth-validator';
import { LLMWrapper } from './ai/llm-wrapper';

const fastify = Fastify({
  logger: true
});

const aiWrapper = new LLMWrapper({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4-turbo-preview'
});

// Basic health check
fastify.get('/health', async () => {
  return { 
    status: 'ok', 
    service: 'backend-copilot-ai',
    version: '1.0.0',
    features: ['openapi-generator', 'controller-analyzer', 'auth-validator']
  };
});

// Endpoint 1: Generate OpenAPI spec
fastify.post<{ Body: { code: string } }>('/api/generate/openapi', async (request, reply) => {
  try {
    // Import dynamically dulu untuk avoid circular dependency
    const { generateOpenAPI } = await import('./generators/openapi-generator');
    const { code } = request.body;
    const result = await generateOpenAPI(code);
    return result;
  } catch (error: any) {
    reply.status(500).send({ 
      error: 'Generation failed',
      message: error.message || 'Unknown error'
    });
  }
});

// Endpoint 2: Analyze controller
fastify.post<{ Body: { code: string } }>('/api/analyze/controller', async (request, reply) => {
  try {
    const { analyzeController } = await import('./analyzers/controller-analyzer');
    const { code } = request.body;
    const result = await analyzeController(code);
    return result;
  } catch (error: any) {
    reply.status(500).send({ 
      error: 'Analysis failed',
      message: error.message || 'Unknown error'
    });
  }
});

fastify.post<{ Body: { config: any } }>('/api/validate/auth', async (request, reply) => {
  try {
    const { config } = request.body;
    const validator = new AuthValidator();
    const result = validator.validate(config);
    return result;
  } catch (error: any) {
    reply.status(500).send({ 
      error: 'Auth validation failed',
      message: error.message || 'Unknown error'
    });
  }
});

fastify.post<{ Body: { code: string } }>('/api/ai/analyze', async (request, reply) => {
  try {
    const { code } = request.body;
    const result = await aiWrapper.analyzeController(code);
    return { 
      success: true, 
      analysis: result,
      note: 'AI-powered analysis'
    };
  } catch (error: any) {
    if (error.message.includes('API key')) {
      return {
        success: false,
        error: 'AI service unavailable',
        message: 'Please set OPENAI_API_KEY environment variable',
        fallback: await performRuleBasedAnalysis(request.body.code)
      };
    }
    reply.status(500).send({ error: 'AI analysis failed', message: error.message });
  }
});

async function performRuleBasedAnalysis(code: string) {
  // Fallback to rule-based analysis
  const { analyzeController } = await import('./analyzers/controller-analyzer');
  return analyzeController(code);
}



// Start server
const start = async () => {
  try {
    await fastify.listen({ 
      port: 3000,
      host: '0.0.0.0'
    });
    console.log('🚀 Backend Copilot AI running on http://localhost:3000');
    console.log('📋 Available endpoints:');
    console.log('  GET  /health');
    console.log('  POST /api/generate/openapi');
    console.log('  POST /api/analyze/controller');
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();