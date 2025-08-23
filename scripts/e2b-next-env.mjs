#!/usr/bin/env node

import { execSync } from 'child_process';

const args = process.argv.slice(2).join(' ');

// Default values
const TEMPLATE_NAME = 'uismith-nextjs';
const CMD = '/compile_page.sh';

// Build command (allow overrides with args)
const command = `e2b template build --name ${TEMPLATE_NAME} --cmd "${CMD}" ${args}`;

try {
  console.log(`Running: ${command}`);
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('Error running e2b template build:', error.message);
  process.exit(1);
}
