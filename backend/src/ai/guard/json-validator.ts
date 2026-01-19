import { z } from 'zod';

export class JsonValidator {
  validate<T>(jsonString: string, schema: z.ZodSchema<T>): T {
    try {
      const parsed = JSON.parse(jsonString);
      return schema.parse(parsed);
    } catch (error: any) {
      throw new Error(`JSON validation failed: ${error.message}`);
    }
  }

  sanitizeOutput(output: any): any {
    // Remove any potentially dangerous content
    const safeOutput = { ...output };
    
    // Remove any __proto__ or constructor properties
    if (safeOutput.__proto__) delete safeOutput.__proto__;
    if (safeOutput.constructor) delete safeOutput.constructor;
    
    // Limit array sizes
    Object.keys(safeOutput).forEach(key => {
      if (Array.isArray(safeOutput[key]) && safeOutput[key].length > 100) {
        safeOutput[key] = safeOutput[key].slice(0, 100);
      }
    });
    
    return safeOutput;
  }
}