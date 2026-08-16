import { ensureAliasRuntimeSupport, registerAllModuleAliases } from "../helper/aliasHelper";
import logger from "./logger";

export const setupAlias = async () => {
  const root = process.cwd();
  const added = registerAllModuleAliases(root);

  if (!added.length) {
    logger.warn("No new module aliases to register (either app/ has no modules, or all are already registered).");
  } else {
    logger.info(`Registered alias(es): ${added.map((module) => `@${module}`).join(", ")}`);
  }

  if (ensureAliasRuntimeSupport(root)) {
    logger.info(
      "Added tsconfig-paths/tsc-alias to package.json and wired them into the start/build scripts — run your install command to fetch them."
    );
  }

  logger.info("Existing import statements were left untouched; update them manually where you want to use the new aliases.");
};
