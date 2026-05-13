export interface Config {
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  port: number;
  databaseUrl: string;
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  googleMapsApiKey: string;
  corsOrigin: string;
  fileMaxSize: number;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  qrCodeSize: number;
  pagination: {
    defaultPageSize: number;
    maxPageSize: number;
  };
}