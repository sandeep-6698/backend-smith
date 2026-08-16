import fs from "fs";
import path from "path";

export const pruneDependencies = (destination: string, packageNames: string[]) => {
  const packageJsonPath = path.join(destination, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  for (const name of packageNames) {
    delete packageJson.dependencies?.[name];
    delete packageJson.devDependencies?.[name];
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
};
