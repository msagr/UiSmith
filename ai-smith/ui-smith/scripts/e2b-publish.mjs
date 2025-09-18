#!/usr/bin/env node

import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory where this script lives
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env from one directory above
dotenv.config({ path: resolve(__dirname, '..', '.env') });

// Fetch TEAM_ID from .env
const TEAM_ID = process.env.E2B_TEAM_ID;

if (!TEAM_ID) {
  console.error('❌ Missing E2B_TEAM_ID in .env file');
  process.exit(1);
}

// Forward any extra args to the command
const args = process.argv.slice(2).join(' ');
const command = `e2b template publish -t ${TEAM_ID} ${args}`;

try {
  console.log(`🚀 Running: ${command}`);
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Error publishing template:', error.message);
  process.exit(1);
}
