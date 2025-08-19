#!/usr/bin/env node

import { execSync } from "child_process";

execSync("npx prisma db seed", { stdio: "inherit" });