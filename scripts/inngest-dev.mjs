#!/usr/bin/env node

import { execSync } from "child_process";

try {
  execSync("npx inngest-cli@latest dev", { stdio: "inherit", shell: true });
} catch (error) {
  console.error("Failed to run inngest-cli:", error.message);
  process.exit(1);
}
