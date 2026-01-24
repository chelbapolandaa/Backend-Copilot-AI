import { z } from 'zod';

export interface AuthConfig {
  routes: Array<{
    path: string;
    method: string;
    middleware?: string[];
    roles?: string[];
  }>;
  middleware: Record<string, string[]>;
  roleHierarchy: Record<string, string[]>;
}

export interface AuthValidationResult {
  leaks: Array<{
    route: string;
    method: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  mismatches: Array<{
    route: string;
    method: string;
    requiredRoles: string[];
    assignedRoles: string[];
  }>;
  suggestions: string[];
}

export class AuthValidator {
  validate(config: AuthConfig): AuthValidationResult {
    const leaks: AuthValidationResult['leaks'] = [];
    const mismatches: AuthValidationResult['mismatches'] = [];
    const suggestions: string[] = [];

    config.routes.forEach(route => {
      if (!route.middleware || route.middleware.length === 0) {
        leaks.push({
          route: route.path,
          method: route.method,
          severity: route.path.includes('/api/') ? 'HIGH' : 'MEDIUM'
        });
      }
    });

    // Check role assignment
    config.routes.forEach(route => {
      if (route.roles && route.middleware) {
        route.middleware.forEach(mw => {
          const mwRoles = config.middleware[mw];
          if (mwRoles && route.roles) {
            const hasValidRole = route.roles.some(role => 
              mwRoles.includes(role)
            );
            if (!hasValidRole) {
              mismatches.push({
                route: route.path,
                method: route.method,
                requiredRoles: route.roles,
                assignedRoles: mwRoles
              });
            }
          }
        });
      }
    });

    if (leaks.length > 0) {
      suggestions.push('Add authentication middleware to unprotected routes');
    }
    if (mismatches.length > 0) {
      suggestions.push('Review role assignments for route protection');
    }

    return { leaks, mismatches, suggestions };
  }
}