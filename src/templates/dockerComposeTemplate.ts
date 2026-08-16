import { type DatabaseEngine, type Orm } from "../helper/projectConfig";

type DbService = {
  serviceName: string;
  image: string;
  port: string;
  environment: string[];
  volumeName: string;
  volumeMount: string;
};

const REDIS_SERVICE: DbService = {
  serviceName: "redis",
  image: "redis:7-alpine",
  port: "6379:6379",
  environment: [],
  volumeName: "redis-data",
  volumeMount: "/data",
};

const DB_SERVICES: Record<Exclude<DatabaseEngine, "sqlite">, DbService> = {
  mongodb: {
    serviceName: "mongo",
    image: "mongo:7.0.0",
    port: "27017:27017",
    environment: [],
    volumeName: "mongo-data",
    volumeMount: "/data/db",
  },
  postgres: {
    serviceName: "postgres",
    image: "postgres:16-alpine",
    port: "5432:5432",
    environment: ["POSTGRES_USER=postgres", "POSTGRES_PASSWORD=postgres", "POSTGRES_DB=app"],
    volumeName: "postgres-data",
    volumeMount: "/var/lib/postgresql/data",
  },
  mysql: {
    serviceName: "mysql",
    image: "mysql:8.0",
    port: "3306:3306",
    environment: ["MYSQL_ROOT_PASSWORD=mysql", "MYSQL_DATABASE=app"],
    volumeName: "mysql-data",
    volumeMount: "/var/lib/mysql",
  },
  mssql: {
    serviceName: "mssql",
    image: "mcr.microsoft.com/mssql/server:2022-latest",
    port: "1433:1433",
    environment: ["ACCEPT_EULA=Y", "MSSQL_SA_PASSWORD=YourStrong!Passw0rd"],
    volumeName: "mssql-data",
    volumeMount: "/var/opt/mssql",
  },
};

const TYPEORM_CREDS: Record<"postgres" | "mysql" | "mssql", { user: string; password: string; port: string; scheme: string }> = {
  postgres: { user: "postgres", password: "postgres", port: "5432", scheme: "postgres" },
  mysql: { user: "root", password: "mysql", port: "3306", scheme: "mysql" },
  mssql: { user: "sa", password: "YourStrong!Passw0rd", port: "1433", scheme: "sqlserver" },
};

const PRISMA_URL: Record<"postgres" | "mysql" | "mssql", string> = {
  postgres: "postgresql://postgres:postgres@postgres:5432/app",
  mysql: "mysql://root:mysql@mysql:3306/app",
  mssql:
    "sqlserver://mssql:1433;database=app;user=sa;password=YourStrong!Passw0rd;trustServerCertificate=true",
};

const databaseUrlEnv = (orm: Orm, database: DatabaseEngine): string => {
  if (orm === "mongoose") {
    return "DATABASE_URL=mongodb://mongo:27017/app";
  }

  if (database === "sqlite") {
    return orm === "prisma"
      ? "DATABASE_URL=file:/app/backend/data/dev.db"
      : "DATABASE_URL=/app/backend/data/dev.sqlite";
  }

  const engine = database as "postgres" | "mysql" | "mssql";
  if (orm === "prisma") {
    return `DATABASE_URL=${PRISMA_URL[engine]}`;
  }

  const creds = TYPEORM_CREDS[engine];
  return `DATABASE_URL=${creds.scheme}://${creds.user}:${creds.password}@${engine}:${creds.port}/app`;
};

const indentList = (items: string[], indent: string) =>
  items.map((item) => `${indent}- ${item}`).join("\n");

export const dockerComposeTemplate = (orm: Orm, database: DatabaseEngine): string => {
  const usesFileDb = database === "sqlite";
  const dbService = usesFileDb ? null : DB_SERVICES[database as Exclude<DatabaseEngine, "sqlite">];
  const auxServices = [...(dbService ? [dbService] : []), REDIS_SERVICE];

  const env = [databaseUrlEnv(orm, database), "REDIS_URL=redis://redis:6379"];

  const backendVolumes = usesFileDb ? "\n    volumes:\n      - sqlite-data:/app/backend/data" : "";
  const dependsOn = `\n    depends_on:\n${auxServices.map((s) => `      - ${s.serviceName}`).join("\n")}`;

  const serviceBlocks = auxServices
    .map(
      (s) =>
        `\n\n  ${s.serviceName}:\n    image: ${s.image}\n    container_name: ${s.serviceName}\n    ports:\n      - "${s.port}"${
          s.environment.length ? `\n    environment:\n${indentList(s.environment, "      ")}` : ""
        }\n    volumes:\n      - ${s.volumeName}:${s.volumeMount}\n    networks:\n      - node`
    )
    .join("");

  const volumeNames = [
    ...(usesFileDb ? ["sqlite-data"] : []),
    ...auxServices.map((s) => s.volumeName),
  ];
  const volumesBlock = `\nvolumes:\n${volumeNames.map((v) => `  ${v}:`).join("\n")}\n`;

  return `version: "3.8"

services:
  backend:
    build: .
    container_name: backend
    ports:
      - "5000:5000"
    environment:
${indentList(env, "      ")}
      - PORT=5000${dependsOn}${backendVolumes}
    networks:
      - node
    restart: unless-stopped${serviceBlocks}
${volumesBlock}
networks:
  node:
    driver: bridge
`;
};
