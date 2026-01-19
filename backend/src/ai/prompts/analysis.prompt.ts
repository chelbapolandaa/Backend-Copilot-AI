export const analysisPrompt = (code: string): string => {
  return `
Analyze the following backend controller code for code quality and best practices.

CODE:
${code}

ANALYSIS CRITERIA:
1. Code complexity (cyclomatic complexity)
2. Security vulnerabilities
3. Performance issues
4. Missing error handling
5. Code duplication opportunities
6. REST API best practices compliance

OUTPUT FORMAT (JSON ONLY):
{
  "complexity": 45,
  "issues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "securityConcerns": ["concern1", "concern2"],
  "estimatedRefactorTime": "2 hours"
}
`;
};