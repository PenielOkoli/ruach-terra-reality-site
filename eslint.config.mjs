import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  // The legacy workspace is a static ES-module app, not a Next router surface.
  { files: ['admin/**/*.mjs'], rules: { '@next/next/no-location-assign-relative-destination': 'off' } },
  globalIgnores(['.next/**', 'node_modules/**', 'artifacts/**', 'app.js', 'api/**', 'google-apps-script/**', 'site.js']),
]);
