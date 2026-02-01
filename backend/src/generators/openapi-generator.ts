import { z } from 'zod';
import { checkSyntax } from '../rules/syntax-checker';

// Schema untuk OpenAPI output
const OpenAPIResponseSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  path: z.string(),
  description: z.string().optional(),
  parameters: z.array(z.object({
    name: z.string(),
    in: z.enum(['query', 'path', 'header', 'cookie']),
    required: z.boolean(),
    type: z.string(),
    description: z.string().optional()
  })).optional(),
  requestBody: z.object({
    description: z.string().optional(),
    content: z.record(z.string(), z.object({  // <-- Fix di sini
      schema: z.object({}).passthrough()
    }))
  }).optional(),
  responses: z.record(z.string(), z.object({  // <-- Fix di sini
    description: z.string(),
    content: z.record(z.string(), z.object({  // <-- Fix di sini
      schema: z.object({}).passthrough()
    })).optional()
  })),
  security: z.array(z.object({})).optional()
});

export type OpenAPIResponse = z.infer<typeof OpenAPIResponseSchema>;

export async function generateOpenAPI(code: string): Promise<OpenAPIResponse> {
  console.log('🔍 Generating OpenAPI spec for code...');
  
  // Step 1: Syntax check dulu
  const syntaxResult = checkSyntax(code);
  if (!syntaxResult.valid) {
    throw new Error(`Syntax error: ${syntaxResult.errors?.join(', ')}`);
  }
  
  // Step 2: Basic parsing (sementara dummy, nanti pakai AI)
  const basicSpec = parseBasicInfo(code);
  
  // Step 3: Validasi dengan schemaa
  return OpenAPIResponseSchema.parse(basicSpec);
}

function parseBasicInfo(code: string): any {
  const methodMatch = code.match(/(get|post|put|delete|patch)\s*\(/i);
  const pathMatch = code.match(/['"`]([^'"`]+)['"`]/);
  
  return {
    method: methodMatch ? methodMatch[1].toUpperCase() : 'GET',
    path: pathMatch ? pathMatch[1] : '/api/unknown',
    description: 'Auto-generated OpenAPI specification',
    responses: {
      '200': {
        description: 'Successful response'
      },
      '500': {
        description: 'Server error'
      }
    }
  };
}