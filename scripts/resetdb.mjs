#!/usr/bin/env node

import { execSync } from "child_process";
import { platform } from "os";
import { existsSync, unlinkSync } from "fs";
import { resolve } from "path";
import readline from "readline";

const args = process.argv.slice(2).join(" ");

// ports to free (adjust if your app runs elsewhere)
const PORTS = [3000, 5555]; 

function killPort(port) {
  try {
    if (platform() === "win32") {
      console.log(`Stopping process on port ${port} (Windows)...`);
      execSync(
        `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port}') do taskkill /PID %a /F`,
        { stdio: "inherit" }
      );
    } else {
      console.log(`Stopping process on port ${port} (Unix)...`);
      execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: "inherit" });
    }
  } catch {
    console.log(`No process found on port ${port}, continuing...`);
  }
}

PORTS.forEach(killPort);

// Ask user about deleting seed.ts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const seedPath = resolve("prisma", "seed.ts");

rl.question("Do you want to delete prisma/seed.ts before reset? (y/N): ", (answer) => {
  if (answer.toLowerCase() === "y") {
    if (existsSync(seedPath)) {
      console.log("Deleting prisma/seed.ts...");
      unlinkSync(seedPath);
    } else {
      console.log("No prisma/seed.ts file found, skipping delete.");
    }
  } else {
    console.log("Keeping prisma/seed.ts.");
  }

  execSync(`npx prisma migrate reset --skip-seed ${args}`, { stdio: "inherit" });
  rl.close();
});
