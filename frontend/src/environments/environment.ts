export const environment = {
  production: false,
  apiBaseUrl: process.env['NG_APP_API_BASE_URL'] ?? 'http://localhost:8000/api',
  wsBaseUrl: process.env['NG_APP_WS_BASE_URL'] ?? 'ws://localhost:8000/ws',
  tenantSlug: process.env['NG_APP_TENANT_SLUG'] ?? 'demo'
};
