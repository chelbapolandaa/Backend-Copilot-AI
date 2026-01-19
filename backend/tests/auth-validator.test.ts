import { describe, test, expect } from '@jest/globals';
import { AuthValidator } from '../src/analyzers/auth-validator';

describe('AuthValidator', () => {
  const validator = new AuthValidator();

  test('should detect unprotected routes', () => {
    const config = {
      routes: [
        { path: '/api/users', method: 'GET', middleware: [] },
        { path: '/api/admin', method: 'POST', middleware: ['auth'] }
      ],
      middleware: {
        auth: ['admin', 'user']
      },
      roleHierarchy: {}
    };

    const result = validator.validate(config);
    expect(result.leaks).toHaveLength(1);
    expect(result.leaks[0].route).toBe('/api/users');
  });

  test('should validate protected routes correctly', () => {
    const config = {
      routes: [
        { 
          path: '/api/admin', 
          method: 'GET', 
          middleware: ['auth'],
          roles: ['admin']
        }
      ],
      middleware: {
        auth: ['admin', 'user']
      },
      roleHierarchy: {}
    };

    const result = validator.validate(config);
    expect(result.leaks).toHaveLength(0);
    expect(result.mismatches).toHaveLength(0);
  });
});