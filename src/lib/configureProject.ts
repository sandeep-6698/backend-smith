import fs from "fs";
import path from "path";
import prompts from "prompts";
import { addDependencies } from "../helper/addDependencies";
import { appendEnvVars } from "../helper/appendEnvVars";
import { pruneDependencies } from "../helper/pruneDependencies";
import { type DatabaseEngine, type Orm, writeProjectConfig } from "../helper/projectConfig";
import {
  mongooseDatabaseServiceTemplate,
  mongooseUserDtoTemplate,
  mongooseUserSchemaTemplate,
  mongooseUserServiceTemplate,
} from "../templates/database/mongooseTemplates";
import {
  type PrismaDbEngine,
  prismaClientTemplate,
  prismaDatabaseServiceTemplate,
  prismaSchemaTemplate,
  prismaUserDtoTemplate,
  prismaUserServiceTemplate,
} from "../templates/database/prismaTemplates";
import {
  typeormDataSourceTemplate,
  typeormDatabaseServiceTemplate,
  typeormUserDtoTemplate,
  typeormUserEntityTemplate,
  typeormUserServiceTemplate,
} from "../templates/database/typeormTemplates";
import { dockerComposeTemplate } from "../templates/dockerComposeTemplate";
import logger from "./logger";

type EmailProvider = "smtp" | "sendgrid" | "mailchimp";
type StorageProvider = "s3" | "cloudinary" | "none";

const EMAIL_PROVIDER_DEPS: Record<EmailProvider, string[]> = {
  smtp: ["nodemailer", "@types/nodemailer"],
  sendgrid: ["@sendgrid/mail"],
  mailchimp: ["@mailchimp/mailchimp_transactional"],
};

const STORAGE_PROVIDER_DEPS: Record<"s3" | "cloudinary", string[]> = {
  s3: ["@aws-sdk/client-s3"],
  cloudinary: ["cloudinary"],
};

const TYPEORM_DRIVER_DEPS: Record<Exclude<DatabaseEngine, "mongodb">, Record<string, string>> = {
  postgres: { pg: "^8.13.0" },
  mysql: { mysql2: "^3.11.3" },
  sqlite: { sqlite3: "^5.1.7" },
  mssql: { mssql: "^11.0.1" },
};

const TYPEORM_EXAMPLE_URL: Record<Exclude<DatabaseEngine, "mongodb">, string> = {
  postgres: "postgres://postgres:postgres@localhost:5432/app",
  mysql: "mysql://root:mysql@localhost:3306/app",
  mssql: "sqlserver://sa:YourStrong!Passw0rd@localhost:1433/app",
  sqlite: "./dev.sqlite",
};

const PRISMA_EXAMPLE_URL: Record<PrismaDbEngine, string> = {
  postgres: "postgresql://user:password@localhost:5432/app",
  mysql: "mysql://user:password@localhost:3306/app",
  sqlite: "file:./dev.db",
  mssql:
    "sqlserver://localhost:1433;database=app;user=sa;password=yourpassword;trustServerCertificate=true",
};

const enableDecorators = (destination: string) => {
  const tsconfigPath = path.join(destination, "tsconfig.json");
  let content = fs.readFileSync(tsconfigPath, "utf-8");
  content = content.replace(
    '"skipLibCheck": true /* Skip type checking all .d.ts files. */',
    '"skipLibCheck": true /* Skip type checking all .d.ts files. */,\n    "experimentalDecorators": true,\n    "emitDecoratorMetadata": true'
  );
  fs.writeFileSync(tsconfigPath, content);
};

const applyDatabase = (destination: string, orm: Orm, dbEngine: DatabaseEngine) => {
  const userDir = path.join(destination, "app/user");
  const servicesDir = path.join(destination, "app/common/services");
  const baseDtoPath = path.join(destination, "app/common/dto/base.dto.ts");

  fs.writeFileSync(
    path.join(destination, "docker-compose.yml"),
    dockerComposeTemplate(orm, dbEngine)
  );

  if (orm === "mongoose") {
    fs.writeFileSync(path.join(userDir, "user.dto.ts"), mongooseUserDtoTemplate());
    fs.writeFileSync(path.join(userDir, "user.schema.ts"), mongooseUserSchemaTemplate());
    fs.writeFileSync(path.join(userDir, "user.service.ts"), mongooseUserServiceTemplate());
    fs.writeFileSync(path.join(servicesDir, "database.service.ts"), mongooseDatabaseServiceTemplate());
    addDependencies(destination, { mongoose: "^7.8.0" });
    appendEnvVars(destination, { DATABASE_URL: '"mongodb://localhost:27017/app"' });
    return;
  }

  fs.rmSync(baseDtoPath, { force: true });

  if (orm === "typeorm") {
    const engine = dbEngine as Exclude<DatabaseEngine, "mongodb">;
    fs.writeFileSync(path.join(userDir, "user.entity.ts"), typeormUserEntityTemplate());
    fs.writeFileSync(path.join(userDir, "user.dto.ts"), typeormUserDtoTemplate());
    fs.writeFileSync(path.join(userDir, "user.service.ts"), typeormUserServiceTemplate());
    fs.writeFileSync(path.join(servicesDir, "data-source.ts"), typeormDataSourceTemplate());
    fs.writeFileSync(path.join(servicesDir, "database.service.ts"), typeormDatabaseServiceTemplate());
    enableDecorators(destination);
    addDependencies(destination, {
      typeorm: "^0.3.20",
      "reflect-metadata": "^0.2.2",
      ...TYPEORM_DRIVER_DEPS[engine],
    });
    appendEnvVars(destination, { DATABASE_URL: `"${TYPEORM_EXAMPLE_URL[engine]}"` });
    return;
  }

  // prisma
  const engine = dbEngine as PrismaDbEngine;
  fs.mkdirSync(path.join(destination, "prisma"), { recursive: true });
  fs.writeFileSync(
    path.join(destination, "prisma/schema.prisma"),
    prismaSchemaTemplate(engine)
  );
  fs.writeFileSync(path.join(userDir, "user.dto.ts"), prismaUserDtoTemplate());
  fs.writeFileSync(path.join(userDir, "user.service.ts"), prismaUserServiceTemplate());
  fs.writeFileSync(path.join(servicesDir, "prisma.client.ts"), prismaClientTemplate());
  fs.writeFileSync(path.join(servicesDir, "database.service.ts"), prismaDatabaseServiceTemplate());
  addDependencies(destination, { "@prisma/client": "^5.20.0" });
  addDependencies(destination, { prisma: "^5.20.0" }, "devDependencies");
  appendEnvVars(destination, { DATABASE_URL: `"${PRISMA_EXAMPLE_URL[engine]}"` });
};

const applyEmailProvider = (destination: string, provider: EmailProvider) => {
  const providersDir = path.join(destination, "app/common/services/email/providers");
  fs.writeFileSync(
    path.join(providersDir, "active.provider.ts"),
    `export * from "./${provider}.provider";\n`
  );

  const unused = (Object.keys(EMAIL_PROVIDER_DEPS) as EmailProvider[]).filter(
    (p) => p !== provider
  );
  unused.forEach((p) => {
    fs.rmSync(path.join(providersDir, `${p}.provider.ts`), { force: true });
  });
  pruneDependencies(destination, unused.flatMap((p) => EMAIL_PROVIDER_DEPS[p]));

  if (provider !== "mailchimp") {
    fs.rmSync(
      path.join(destination, "app/common/types/mailchimp-transactional.d.ts"),
      { force: true }
    );
  }
};

const applyStorageProvider = (destination: string, provider: StorageProvider) => {
  const storageDir = path.join(destination, "app/common/services/storage");

  if (provider === "none") {
    fs.rmSync(storageDir, { recursive: true, force: true });
    pruneDependencies(destination, [
      ...STORAGE_PROVIDER_DEPS.s3,
      ...STORAGE_PROVIDER_DEPS.cloudinary,
    ]);
    return;
  }

  const providersDir = path.join(storageDir, "providers");
  fs.writeFileSync(
    path.join(providersDir, "active.provider.ts"),
    `export * from "./${provider}.provider";\n`
  );

  const unused = (["s3", "cloudinary"] as const).filter((p) => p !== provider);
  unused.forEach((p) => {
    fs.rmSync(path.join(providersDir, `${p}.provider.ts`), { force: true });
  });
  pruneDependencies(destination, unused.flatMap((p) => STORAGE_PROVIDER_DEPS[p]));
};

const applySocket = (destination: string, include: boolean) => {
  const indexPath = path.join(destination, "index.ts");

  if (include) {
    let content = fs.readFileSync(indexPath, "utf-8");
    content = content.replace(
      'import logger from "./app/common/services/logger.service";',
      'import { initSocket } from "./app/common/services/socket.service";\nimport logger from "./app/common/services/logger.service";'
    );
    content = content.replace(
      "  http.createServer(app).listen(port, () => {\n    logger.info(`Server is running on port ${port}`);\n  });",
      "  const server = http.createServer(app);\n  initSocket(server);\n  server.listen(port, () => {\n    logger.info(`Server is running on port ${port}`);\n  });"
    );
    fs.writeFileSync(indexPath, content);
    return;
  }

  fs.rmSync(path.join(destination, "app/common/services/socket.service.ts"), {
    force: true,
  });
  pruneDependencies(destination, ["socket.io"]);
};

export const configureProject = async (destination: string): Promise<void> => {
  const answers = await prompts(
    [
      {
        type: "select",
        name: "orm",
        message: "Which ORM / database do you want to use?",
        choices: [
          { title: "Mongoose (MongoDB)", value: "mongoose" },
          { title: "TypeORM", value: "typeorm" },
          { title: "Prisma", value: "prisma" },
        ],
        initial: 0,
      },
      {
        type: (prev: Orm) => (prev === "mongoose" ? null : "select"),
        name: "database",
        message: "Which database engine?",
        choices: [
          { title: "PostgreSQL", value: "postgres" },
          { title: "MySQL", value: "mysql" },
          { title: "SQLite", value: "sqlite" },
          { title: "Microsoft SQL Server", value: "mssql" },
        ],
        initial: 0,
      },
      {
        type: "select",
        name: "email",
        message: "Which email provider do you want to use?",
        choices: [
          { title: "SMTP (nodemailer)", value: "smtp" },
          { title: "SendGrid", value: "sendgrid" },
          { title: "Mailchimp Transactional", value: "mailchimp" },
        ],
        initial: 0,
      },
      {
        type: "select",
        name: "storage",
        message: "Which file storage provider do you want to use?",
        choices: [
          { title: "Amazon S3", value: "s3" },
          { title: "Cloudinary", value: "cloudinary" },
          { title: "None", value: "none" },
        ],
        initial: 0,
      },
      {
        type: "confirm",
        name: "socket",
        message: "Include Socket.IO for websockets?",
        initial: false,
      },
    ],
    {
      onCancel: () => {
        logger.warn("Setup cancelled.");
        process.exit(1);
      },
    }
  );

  const orm = answers.orm as Orm;
  const database: DatabaseEngine = orm === "mongoose" ? "mongodb" : (answers.database as DatabaseEngine);
  const email = answers.email as EmailProvider;
  const storage = answers.storage as StorageProvider;
  const socket = answers.socket as boolean;

  applyDatabase(destination, orm, database);
  applyEmailProvider(destination, email);
  applyStorageProvider(destination, storage);
  applySocket(destination, socket);
  writeProjectConfig(destination, { orm, database });

  logger.info(`ORM: ${orm} (${database})`);
  logger.info(`Email provider: ${email}`);
  logger.info(`Storage provider: ${storage}`);
  logger.info(`Socket.IO: ${socket ? "included" : "not included"}`);
};
