import 'zone.js';

(window as unknown as { process?: { env: Record<string, unknown> } }).process =
  (window as unknown as { process?: { env: Record<string, unknown> } }).process ?? { env: {} };
