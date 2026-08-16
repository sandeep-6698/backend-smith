import fs from "fs";
import path from "path";

export const appendEnvVars = (destination: string, vars: Record<string, string>) => {
  const block =
    "\n" +
    Object.entries(vars)
      .map(([key, value]) => `${key} = ${value}`)
      .join("\n") +
    "\n";

  for (const file of [".env.local", "env.example.production"]) {
    const filePath = path.join(destination, file);
    if (fs.existsSync(filePath)) {
      fs.appendFileSync(filePath, block);
    }
  }
};
