import { openAPIPrompt } from './openapi.prompt';
import { analysisPrompt } from './analysis.prompt';

export type PromptType = 'openapi' | 'analysis' | 'auth';

export function getPrompt(type: PromptType, code: string): string {
  switch (type) {
    case 'openapi':
      return openAPIPrompt(code);
    case 'analysis':
      return analysisPrompt(code);
    case 'auth':
      return `Analyze authentication code: ${code}`;
    default:
      return `Analyze code: ${code}`;
  }
}