export type PrismaDbEngine = "postgres" | "mysql" | "sqlite" | "mssql";

const PRISMA_PROVIDER: Record<PrismaDbEngine, string> = {
  postgres: "postgresql",
  mysql: "mysql",
  sqlite: "sqlite",
  mssql: "sqlserver",
};

export const prismaSchemaTemplate = (dbEngine: PrismaDbEngine): string => `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${PRISMA_PROVIDER[dbEngine]}"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  active       Boolean  @default(true)
  role         String   @default("USER")
  password     String?
  refreshToken String?  @default("")
  blocked      Boolean  @default(false)
  blockReason  String?  @default("")
  provider     String   @default("manual")
  facebookId   String?
  image        String?
  linkedinId   String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("user")
}
`;

export const prismaUserDtoTemplate = (): string => `
import { type User } from "@prisma/client";

export enum ProviderType {
  GOOGLE = "google",
  MANUAL = "manual",
  FACEBOOK = "facebook",
  APPLE = "apple",
  LINKEDIN = "linkedin",
}

export type IUser = Omit<
  User,
  | "id"
  | "role"
  | "provider"
  | "active"
  | "password"
  | "refreshToken"
  | "blocked"
  | "blockReason"
  | "facebookId"
  | "image"
  | "linkedinId"
> & {
  _id: string;
  role: "USER" | "ADMIN";
  provider: ProviderType;
  active?: boolean;
  password?: string;
  refreshToken?: string;
  blocked?: boolean;
  blockReason?: string;
  facebookId?: string;
  image?: string;
  linkedinId?: string;
};
`;

export const prismaUserServiceTemplate = (): string => `
import { type Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "@common/services/prisma.client";
import { type IUser } from "./user.dto";

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};

const toIUser = (record: { id: string; [key: string]: unknown }): IUser => {
  const { id, ...rest } = record;
  return { _id: id, ...rest } as unknown as IUser;
};

export const createUser = async (
  data: Omit<IUser, "_id" | "createdAt" | "updatedAt">
) => {
  const result = await prisma.user.create({
    data: {
      ...data,
      password: data.password ? await hashPassword(data.password) : undefined,
    },
  });
  const { refreshToken, password, ...user } = toIUser(result);
  return user;
};

export const updateUser = async (id: string, data: Partial<IUser>) => {
  const { _id, ...rest } = data;
  const result = await prisma.user.update({ where: { id }, data: rest });
  return toIUser(result);
};

export const editUser = async (id: string, data: Partial<IUser>) => {
  const { _id, ...rest } = data;
  const result = await prisma.user.update({ where: { id }, data: rest });
  return toIUser(result);
};

export const deleteUser = async (id: string) => {
  const result = await prisma.user.delete({ where: { id } });
  return result;
};

export const getUserById = async (id: string, select?: Prisma.UserSelect) => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: select ? { ...select, id: true } : undefined,
  });
  return result ? toIUser(result) : null;
};

export const getAllUser = async (
  select?: Prisma.UserSelect,
  options?: { skip?: number; limit?: number }
) => {
  const result = await prisma.user.findMany({
    select: select ? { ...select, id: true } : undefined,
    skip: options?.skip,
    take: options?.limit,
  });
  return result.map(toIUser);
};

export const getUserByEmail = async (
  email: string,
  select?: Prisma.UserSelect
) => {
  const result = await prisma.user.findUnique({
    where: { email },
    select: select ? { ...select, id: true } : undefined,
  });
  return result ? toIUser(result) : null;
};

export const countUser = async () => {
  return await prisma.user.count();
};
`;

export const prismaClientTemplate = (): string => `
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
`;

export const prismaDatabaseServiceTemplate = (): string => `
import logger from "./logger.service";
import { prisma } from "./prisma.client";

export const initDB = async (): Promise<boolean> => {
  await prisma.$connect();
  logger.info("DB Connected!");
  return true;
};
`;
