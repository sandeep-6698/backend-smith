import fs from "fs";
import path from "path";
import logger from "../lib/logger";

const TSCONFIG_PATHS_VERSION = "^4.2.0";
const TSC_ALIAS_VERSION = "^1.8.10";

type Tsconfig = {
  compilerOptions?: {
    baseUrl?: string;
    paths?: Record<string, string[]>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

// tsconfig.json commonly contains // and /* */ comments (valid JSONC), which JSON.parse rejects.
const stripJsonComments = (input: string): string => {
  let output = "";
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const next = input[i + 1];

    if (inString) {
      output += ch;
      if (ch === "\\") {
        output += next ?? "";
        i++;
        continue;
      }
      if (ch === stringChar) inString = false;
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      stringChar = ch;
      output += ch;
      continue;
    }

    if (ch === "/" && next === "/") {
      while (i < input.length && input[i] !== "\n") i++;
      output += "\n";
      continue;
    }

    if (ch === "/" && next === "*") {
      i += 2;
      while (i < input.length && !(input[i] === "*" && input[i + 1] === "/")) i++;
      i++;
      continue;
    }

    output += ch;
  }

  return output;
};

const readTsconfig = (tsconfigPath: string): Tsconfig | null => {
  if (!fs.existsSync(tsconfigPath)) return null;
  try {
    return JSON.parse(stripJsonComments(fs.readFileSync(tsconfigPath, "utf-8")));
  } catch {
    logger.warn("Could not parse tsconfig.json, skipping alias registration.");
    return null;
  }
};

const writeTsconfig = (tsconfigPath: string, tsconfig: Tsconfig) => {
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + "\n");
};

/** Adds an `@module/*` -> `app/module/*` path alias for a single module. Returns true if a new entry was added. */
export const registerModuleAlias = (root: string, module: string): boolean => {
  const tsconfigPath = path.join(root, "tsconfig.json");
  const tsconfig = readTsconfig(tsconfigPath);
  if (!tsconfig) return false;

  tsconfig.compilerOptions = tsconfig.compilerOptions ?? {};
  tsconfig.compilerOptions.baseUrl = tsconfig.compilerOptions.baseUrl ?? ".";
  tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths ?? {};

  const key = `@${module}/*`;
  if (tsconfig.compilerOptions.paths[key]) return false;

  tsconfig.compilerOptions.paths[key] = [`app/${module}/*`];
  writeTsconfig(tsconfigPath, tsconfig);
  return true;
};

/** Scans app/* for existing module folders and registers an alias for each. Does not touch any import statements. */
export const registerAllModuleAliases = (root: string): string[] => {
  const appDir = path.join(root, "app");
  if (!fs.existsSync(appDir)) return [];

  const modules = fs
    .readdirSync(appDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  return modules.filter((module) => registerModuleAlias(root, module));
};

/** Ensures the project has the devDependencies + scripts needed to resolve `@module` aliases at dev-time (ts-node) and build-time (tsc). */
export const ensureAliasRuntimeSupport = (root: string): boolean => {
  const pkgPath = path.join(root, "package.json");
  if (!fs.existsSync(pkgPath)) return false;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  let changed = false;

  pkg.devDependencies = pkg.devDependencies ?? {};
  if (!pkg.devDependencies["tsconfig-paths"]) {
    pkg.devDependencies["tsconfig-paths"] = TSCONFIG_PATHS_VERSION;
    changed = true;
  }
  if (!pkg.devDependencies["tsc-alias"]) {
    pkg.devDependencies["tsc-alias"] = TSC_ALIAS_VERSION;
    changed = true;
  }

  pkg.scripts = pkg.scripts ?? {};
  if (
    typeof pkg.scripts.start === "string" &&
    pkg.scripts.start.includes("ts-node") &&
    !pkg.scripts.start.includes("tsconfig-paths")
  ) {
    pkg.scripts.start = pkg.scripts.start.replace("ts-node ", "ts-node -r tsconfig-paths/register ");
    changed = true;
  }
  if (typeof pkg.scripts.build === "string" && !pkg.scripts.build.includes("tsc-alias")) {
    pkg.scripts.build = `${pkg.scripts.build} && npx tsc-alias`;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  }
  return changed;
};
