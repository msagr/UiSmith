#!/usr/bin/env node

import { execSync } from "child_process";

const args = process.argv.slice(2).join(" ");

// force skip seed
execSync(`npx prisma migrate reset --skip-seed ${args}`, { stdio: "inherit" });
