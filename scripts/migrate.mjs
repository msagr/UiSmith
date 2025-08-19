#!/usr/bin/env node
import { execSync } from "child_process";

execSync("npx prisma migrate dev", { stdio: "inherit" });
