export const openAPIPrompt = (code: string): string => {
  return `
You are an API documentation specialist. Analyze the following backend code and generate OpenAPI 3.0 specification.

CODE:
${code}

INSTRUCTIONS:
1. Extract HTTP method, path, and route parameters
2. Identify request/response schemas
3. Determine authentication requirements
4. List possible error responses
5. Provide clear descriptions

OUTPUT FORMAT (JSON ONLY):
{
  "method": "GET|POST|PUT|DELETE|PATCH",
  "path": "/api/endpoint",
  "summary": "Brief description",
  "description": "Detailed description",
  "parameters": [
    {
      "name": "paramName",
      "in": "query|path|header",
      "required": true|false,
      "type": "string|number|boolean"
    }
  ],
  "requestBody": {
    "description": "Request body description",
    "content": {
      "application/json": {
        "schema": {}
      }
    }
  },
  "responses": {
    "200": {
      "description": "Success response"
    },
    "400": {
      "description": "Bad request"
    },
    "500": {
      "description": "Server error"
    }
  },
  "security": []
}
`;
};