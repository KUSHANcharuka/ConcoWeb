import { loadEnvConfig } from '@next/env';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load env vars the exact way Next.js does
const projectDir = process.cwd();
loadEnvConfig(projectDir);

try {
  // Now import the env validation script
  await import('./src/env.js');
  console.log("Validation passed");
} catch (e) {
  console.error("Validation failed");
  console.error(e);
}
