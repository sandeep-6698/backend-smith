import logger from "../lib/logger";
import { getAbsolutePath } from "./getAbsolutePath";
import { runCommandHelper } from "./runCommandHelper";

export const formatModule = async (module: string) => {
  try {
    await runCommandHelper(`npx prettier ${getAbsolutePath(module)} -w`);
  } catch (error) {
    logger.warn("Formatting failed, you may want to run `npx prettier -w` manually.");
  }
};
