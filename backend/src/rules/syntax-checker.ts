export interface SyntaxCheckResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

export function checkSyntax(code: string): SyntaxCheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Basic checks
  
  // Check if code is empty
  if (!code.trim()) {
    errors.push('Code is empty');
  }
  
  if (code.includes('const') && !code.includes('=')) {
    warnings.push('Const declaration without assignment');
  }
  
  // Check for unclosed brackets
  const openBrackets = (code.match(/\(/g) || []).length;
  const closeBrackets = (code.match(/\)/g) || []).length;
  if (openBrackets !== closeBrackets) {
    warnings.push(`Mismatched parentheses: ${openBrackets} opening vs ${closeBrackets} closing`);
  }
  
  // Check for arrow functions (common in modern backend)
  if (!code.includes('=>') && !code.includes('function')) {
    warnings.push('No function definition found');
  }
  
  const result: SyntaxCheckResult = {
    valid: errors.length === 0,
  };
  
  if (errors.length > 0) {
    result.errors = errors;
  }
  
  if (warnings.length > 0) {
    result.warnings = warnings;
  }
  
  return result;
}