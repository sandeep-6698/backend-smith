import fs from "fs";
import path from "path";

export type Orm = "mongoose" | "typeorm" | "prisma";
export type DatabaseEngine = "mongodb" | "postgres" | "mysql" | "sqlite" | "mssql";

export type ProjectConfig = {
  orm: Orm;
  database: DatabaseEngine;
};

const CONFIG_FILE = ".backend-smith.json";

export const writeProjectConfig = (destination: string, config: ProjectConfig) => {
  fs.writeFileSync(
    path.join(destination, CONFIG_FILE),
    JSON.stringify(config, null, 2) + "\n"
  );
};

export const readProjectConfig = (): ProjectConfig | null => {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  if (!fs.existsSync(configPath)) return null;
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
};
