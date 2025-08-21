#!/usr/bin/env node

import { execSync } from "child_process";

function killPort(port) {
  try {
    if (process.platform === "win32") {
      // Windows: find PID and kill
      const pid = execSync(`netstat -ano | findstr :${port}`)
        .toString()
        .split("\n")
        .filter(line => line.includes("LISTENING"))
        .map(line => line.trim().split(/\s+/).pop())[0];
      
      if (pid) {
        execSync(`taskkill /PID ${pid} /F`);
        console.log(`✅ Killed process on port ${port} (PID: ${pid})`);
      }
    } else {
      // macOS/Linux
      execSync(`lsof -ti:${port} | xargs -r kill -9`);
      console.log(`✅ Killed process on port ${port}`);
    }
  } catch {
    console.log(`ℹ️ No process running on port ${port}`);
  }
}

try {
  // Kill process on 8888 first
  killPort(8288);

  // Run inngest
  execSync("npx inngest-cli@latest dev", { stdio: "inherit", shell: true });
} catch (error) {
  console.error("❌ Failed to run inngest-cli:", error.message);
  process.exit(1);
}
