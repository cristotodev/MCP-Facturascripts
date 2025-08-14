#!/usr/bin/env node

// MCP FacturaScripts Server Entry Point
// This script ensures the server is built and runs the JavaScript version

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = join(__dirname, 'dist', 'index.js');

// Ensure the project is built
try {
  if (!existsSync(distPath)) {
    console.log('Building project...');
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  }
  
  // Import and run the built server
  const serverModule = await import('./dist/index.js');
} catch (error) {
  console.error('Failed to start MCP server:', error.message);
  process.exit(1);
}