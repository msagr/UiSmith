#!/usr/bin/env node

import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.DOCKER_PORT || 3000;

try {
  console.log(`🚀 Running Docker container on port ${PORT}...`);

  execSync(`docker run -p ${PORT}:3000 nextjs-docker`, {
    stdio: 'inherit',
    shell: true,
  });

  console.log('✅ Docker container started successfully!');
} catch (error) {
  console.error('❌ Failed to run Docker container:', error.message);
  process.exit(1);
}
