export const env = {
  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://admin:admin@postgres:5432/backpack',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  // 2FA
  twoFactor: {
    issuer: process.env.TWO_FACTOR_ISSUER || 'BackpackApp',
    label: process.env.TWO_FACTOR_LABEL || 'BackpackApp',
  },

  // Application
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },

  // Session
  session: {
    secret: process.env.SESSION_SECRET || 'your-super-secret-session-key-change-this-in-production',
    expiresIn: process.env.SESSION_EXPIRES_IN || '7d',
  },
} as const;

// Type for environment variables
export type Env = typeof env;

// Validate required environment variables
export function validateEnv() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'SESSION_SECRET',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    console.warn(
      `Warning: The following environment variables are missing: ${missingEnvVars.join(
        ', '
      )}`
    );
    console.warn('Using default values. This is not recommended for production.');
  }
}

// Call validation on import
validateEnv(); 