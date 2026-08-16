export const typeormUserEntityTemplate = (): string => `
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum ProviderType {
  GOOGLE = "google",
  MANUAL = "manual",
  FACEBOOK = "facebook",
  APPLE = "apple",
  LINKEDIN = "linkedin",
}

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  _id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ default: true })
  active?: boolean;

  @Column({ type: "simple-enum", enum: ["USER", "ADMIN"], default: "USER" })
  role!: "USER" | "ADMIN";

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({ nullable: true, default: "", select: false })
  refreshToken?: string;

  @Column({ default: false })
  blocked?: boolean;

  @Column({ nullable: true, default: "" })
  blockReason?: string;

  @Column({
    type: "simple-enum",
    enum: ProviderType,
    default: ProviderType.MANUAL,
  })
  provider!: ProviderType;

  @Column({ nullable: true, select: false })
  facebookId?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true, select: false })
  linkedinId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
`;

export const typeormUserDtoTemplate = (): string => `
export { ProviderType, type User as IUser } from "./user.entity";
`;

export const typeormUserServiceTemplate = (): string => `
import bcrypt from "bcrypt";
import { type FindOptionsSelect, type FindOptionsWhere } from "typeorm";
import { AppDataSource } from "@common/services/data-source";
import { type IUser } from "./user.dto";
import { User } from "./user.entity";

const userRepository = () => AppDataSource.getRepository(User);

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};

export const createUser = async (
  data: Omit<Partial<IUser>, "_id" | "createdAt" | "updatedAt">
) => {
  const entity = userRepository().create({
    ...data,
    password: data.password ? await hashPassword(data.password) : undefined,
  });
  const result = await userRepository().save(entity);
  const { refreshToken, password, ...user } = result;
  return user;
};

export const updateUser = async (id: string, data: Partial<IUser>) => {
  await userRepository().update({ _id: id }, data);
  return await getUserById(id);
};

export const editUser = async (id: string, data: Partial<IUser>) => {
  await userRepository().update({ _id: id }, data);
  return await getUserById(id);
};

export const deleteUser = async (id: string) => {
  const result = await userRepository().delete({ _id: id });
  return result;
};

export const getUserById = async (
  id: string,
  select?: FindOptionsSelect<User>
) => {
  const result = await userRepository().findOne({
    where: { _id: id } as FindOptionsWhere<User>,
    select,
  });
  return result;
};

export const getAllUser = async (
  select?: FindOptionsSelect<User>,
  options?: { skip?: number; limit?: number }
) => {
  const result = await userRepository().find({
    select,
    skip: options?.skip,
    take: options?.limit,
  });
  return result;
};

export const getUserByEmail = async (
  email: string,
  select?: FindOptionsSelect<User>
) => {
  const result = await userRepository().findOne({
    where: { email } as FindOptionsWhere<User>,
    select,
  });
  return result;
};

export const countUser = async () => {
  return await userRepository().count();
};
`;

export const typeormDataSourceTemplate = (): string => `
import "reflect-metadata";
import { DataSource, type DataSourceOptions } from "typeorm";
import { User } from "@user/user.entity";

const parseConnectionUrl = (url: string) => {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port),
    username: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\\//, ""),
  };
};

const getDataSourceOptions = (): DataSourceOptions => {
  const databaseUrl = process.env.DATABASE_URL ?? "";

  if (databaseUrl.startsWith("mysql://")) {
    return { type: "mysql", ...parseConnectionUrl(databaseUrl), entities: [User], synchronize: true };
  }
  if (databaseUrl.startsWith("sqlserver://") || databaseUrl.startsWith("mssql://")) {
    return {
      type: "mssql",
      ...parseConnectionUrl(databaseUrl),
      options: { encrypt: false },
      entities: [User],
      synchronize: true,
    };
  }
  if (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://")) {
    return { type: "postgres", ...parseConnectionUrl(databaseUrl), entities: [User], synchronize: true };
  }
  return { type: "sqlite", database: databaseUrl || "dev.sqlite", entities: [User], synchronize: true };
};

export const AppDataSource = new DataSource(getDataSourceOptions());
`;

export const typeormDatabaseServiceTemplate = (): string => `
import { AppDataSource } from "./data-source";
import logger from "./logger.service";

export const initDB = async (): Promise<boolean> => {
  await AppDataSource.initialize();
  logger.info("DB Connected!");
  return true;
};
`;
