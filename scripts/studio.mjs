#!/usr/bin/env node

import { execSync } from "child_process";

try {
  // Generate Prisma Client
  console.log("Generating Prisma Client...");
  execSync("npx prisma generate", { stdio: "inherit" });

  // Open Prisma Studio
  console.log("Opening Prisma Studio...");
  execSync("npx prisma studio", { stdio: "inherit" });

} catch (error) {
  console.error("Error running Prisma commands:", error);
  process.exit(1);
}