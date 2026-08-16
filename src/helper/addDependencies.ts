import fs from "fs";
import path from "path";

export const addDependencies = (
  destination: string,
  deps: Record<string, string>,
  target: "dependencies" | "devDependencies" = "dependencies"
) => {
  const packageJsonPath = path.join(destination, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  packageJson[target] = { ...packageJson[target], ...deps };
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
};
