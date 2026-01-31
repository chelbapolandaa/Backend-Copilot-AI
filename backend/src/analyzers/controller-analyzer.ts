import { z } from 'zod';
import { checkSyntax } from '../rules/syntax-checker';

const AnalysisResultSchema = z.object({
  complexity: z.object({
    score: z.number(),
    level: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    issues: z.array(z.string())
  }),
  duplications: z.array(z.object({
    pattern: z.string(),
    occurrences: z.number(),
    locations: z.array(z.string())
  })).optional(),
  validations: z.object({
    missing: z.array(z.string()),
    present: z.array(z.string())
  }),
  suggestions: z.array(z.string())
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

export async function analyzeController(code: string): Promise<AnalysisResult> {
  console.log('🔍 Analyzing controller code...');
  
  // Step 1: Syntax check
  const syntaxResult = checkSyntax(code);
  if (!syntaxResult.valid) {
    throw new Error(`Syntax error: ${syntaxResult.errors?.join(', ')}`);
  }
  
  // Step 2: Basic analysis
  const analysis = performBasicAnalysis(code);
  
  return AnalysisResultSchema.parse(analysis);
}

function performBasicAnalysis(code: string): any {
  const lines = code.split('\n').length;
  const complexity = Math.min(Math.floor(lines / 10), 10);
  
  const issues: string[] = [];
  
  // Check for common issues
  if (!code.includes('try') && code.includes('await')) {
    issues.push('Missing try-catch for async operations');
  }
  
  if (!code.includes('validate') && !code.includes('zod') && !code.includes('joi')) {
    issues.push('No input validation detected');
  }
  
  if (code.includes('console.log')) {
    issues.push('Console.log found in production code');
  }
  
  return {
    complexity: {
      score: complexity,
      level: complexity < 3 ? 'LOW' : complexity < 6 ? 'MEDIUM' : complexity < 9 ? 'HIGH' : 'CRITICAL',
      issues
    },
    validations: {
      missing: ['input-validation', 'error-handling', 'type-checking'],
      present: ['basic-structure']
    },
    suggestions: [
      'Consider adding input validation with Zod',
      'Add proper error handling with try-catch',
      'Extract business logic to separate functions'
    ]
  };
}