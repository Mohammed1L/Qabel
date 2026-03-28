// Generates environment.prod.ts from environment variables at build time.
// Run via: node scripts/set-env.js (called automatically by the build:prod script)
const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL || 'https://api.qabel.io/api/v1';
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';

if (!googleClientId) {
  console.warn('⚠️  WARNING: GOOGLE_CLIENT_ID env var is not set. Google OAuth will not work.');
}

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
  googleClientId: '${googleClientId}',
};
`;

const outputPath = path.join(__dirname, '../src/environments/environment.prod.ts');
fs.writeFileSync(outputPath, content, 'utf8');
console.log('✅ environment.prod.ts generated from environment variables');
