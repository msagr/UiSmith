#!/usr/bin/env node

import { execSync } from 'child_process';

try {
  console.log('🚀 Building Docker image: nextjs-docker...');

  execSync('docker build -t nextjs-docker .', {
    stdio: 'inherit',
    shell: true,
  });

  console.log('✅ Docker image built successfully!');
} catch (error) {
  console.error('❌ Failed to build Docker image:', error.message);
  process.exit(1);
}
