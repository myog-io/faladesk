export const environment = {
  production: true,
  apiBaseUrl: process.env['NG_APP_API_BASE_URL'] ?? 'https://api.faladesk.com/api',
  wsBaseUrl: process.env['NG_APP_WS_BASE_URL'] ?? 'wss://api.faladesk.com/ws',
  tenantSlug: process.env['NG_APP_TENANT_SLUG'] ?? ''
};
