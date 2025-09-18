#!/usr/bin/env node

import { execSync } from "child_process";

const args = process.argv.slice(2).join(" ");
execSync(`npx shadcn@2.7.0 add ${args}`, { stdio: "inherit" });
