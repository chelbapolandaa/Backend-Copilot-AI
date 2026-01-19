import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { AuthValidator } from './analyzers/auth-validator';
import { LLMWrapper } from './ai/llm-wrapper';

const fastify = Fastify({
  logger: true
});

// Initialize AI wrapper
const aiWrapper = new LLMWrapper({
  apiKey: process.env.OPENAI_API_KEY,
  enabled: process.env.AI_ENABLED === 'true'
});

// Register Swagger for API documentation
fastify.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Backend Copilot AI',
      description: 'AI-powered backend analysis and code review tool',
      version: '1.0.0'
    },
    externalDocs: {
      url: 'https://github.com/chelbapolandaa/Backend-Copilot-AI',
      description: 'GitHub Repository'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'Analysis', description: 'Code analysis endpoints' },
      { name: 'AI', description: 'AI-powered analysis' },
      { name: 'Health', description: 'Health checks' },
      { name: 'Documentation', description: 'API documentation' }
    ]
  }
});

// Register Swagger UI
fastify.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  }
});

// Serve static files (for demo page)
fastify.register(fastifyStatic, {
  root: path.join(process.cwd(), 'public'),
  prefix: '/'
});

// ==================== ROUTES ====================

// Basic health check
fastify.get('/health', async () => {
  return { 
    status: 'ok', 
    service: 'backend-copilot-ai',
    version: '1.0.0',
    features: [
      'openapi-generator', 
      'controller-analyzer', 
      'auth-validator',
      'ai-analysis'
    ],
    documentation: 'http://localhost:3000/docs',
    demo: 'http://localhost:3000/index.html'
  };
});

// Demo page redirect
fastify.get('/demo', async () => {
  return { 
    message: 'Visit /index.html for the demo interface',
    demoUrl: 'http://localhost:3000/index.html',
    apiDocs: 'http://localhost:3000/docs'
  };
});

// Endpoint 1: Generate OpenAPI spec
fastify.post<{ Body: { code: string } }>('/api/generate/openapi', async (request, reply) => {
  try {
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

// Endpoint 3: Validate auth flow
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

// Endpoint 4: AI-powered analysis
fastify.post<{ Body: { code: string } }>('/api/ai/analyze', async (request, reply) => {
  try {
    const { code } = request.body;
    const result = await aiWrapper.analyzeController(code);
    
    if (result.success && result.data) {
      return {
        source: 'ai-powered',
        timestamp: new Date().toISOString(),
        ...result.data
      };
    } else {
      // Fallback to rule-based analysis
      const { analyzeController } = await import('./analyzers/controller-analyzer');
      const fallbackResult = await analyzeController(code);
      
      return {
        source: 'rule-based-fallback',
        note: 'AI analysis unavailable',
        timestamp: new Date().toISOString(),
        ...fallbackResult
      };
    }
  } catch (error: any) {
    reply.status(500).send({ 
      error: 'Analysis failed',
      message: error.message || 'Unknown error'
    });
  }
});

// Endpoint 5: AI OpenAPI generation
fastify.post<{ Body: { code: string } }>('/api/ai/openapi', async (request, reply) => {
  try {
    const { code } = request.body;
    const result = await aiWrapper.generateOpenAPI(code);
    
    if (result.success && result.data) {
      return {
        source: 'ai-powered',
        timestamp: new Date().toISOString(),
        ...result.data
      };
    } else {
      // Fallback to rule-based generation
      const { generateOpenAPI } = await import('./generators/openapi-generator');
      const fallbackResult = await generateOpenAPI(code);
      
      return {
        source: 'rule-based-fallback',
        note: 'AI generation unavailable',
        timestamp: new Date().toISOString(),
        ...fallbackResult
      };
    }
  } catch (error: any) {
    reply.status(500).send({ 
      error: 'OpenAPI generation failed',
      message: error.message || 'Unknown error'
    });
  }
});

// Endpoint 6: AI auth validation
fastify.post<{ Body: { code: string } }>('/api/ai/auth', async (request, reply) => {
  try {
    const { code } = request.body;
    const result = await aiWrapper.validateAuthFlow(code);
    
    if (result.success && result.data) {
      return {
        source: 'ai-powered',
        timestamp: new Date().toISOString(),
        ...result.data
      };
    } else {
      return {
        source: 'rule-based-only',
        note: 'AI analysis unavailable for auth validation',
        timestamp: new Date().toISOString(),
        vulnerabilities: ['AI service not available'],
        recommendations: ['Set OPENAI_API_KEY environment variable'],
        riskLevel: 'UNKNOWN'
      };
    }
  } catch (error: any) {
    reply.status(500).send({ 
      error: 'Auth validation failed',
      message: error.message || 'Unknown error'
    });
  }
});

// ==================== START SERVER ====================

const start = async () => {
  try {
    await fastify.ready();
    await fastify.listen({ 
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0'
    });
    
    console.log('🚀 Backend Copilot AI running on http://localhost:3000');
    console.log('📚 API Documentation: http://localhost:3000/docs');
    console.log('🏥 Health Check: http://localhost:3000/health');
    console.log('🎮 Demo Interface: http://localhost:3000/index.html');
    console.log('\n📋 Available API Endpoints:');
    console.log('  POST /api/generate/openapi    - Generate OpenAPI spec');
    console.log('  POST /api/analyze/controller  - Analyze controller code');
    console.log('  POST /api/validate/auth       - Validate auth flow');
    console.log('  POST /api/ai/analyze          - AI-powered code analysis');
    console.log('  POST /api/ai/openapi          - AI-powered OpenAPI generation');
    console.log('  POST /api/ai/auth             - AI-powered auth validation');
    console.log('\n🤖 AI Status:', process.env.OPENAI_API_KEY ? 'ENABLED' : 'DISABLED (set OPENAI_API_KEY)');
    
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();