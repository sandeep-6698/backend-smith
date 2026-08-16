export const mongooseUserDtoTemplate = (): string => `
import { type BaseSchema } from "@common/dto/base.dto";

export interface IUser extends BaseSchema {
  name: string;
  email: string;
  active?: boolean;
  role: "USER" | "ADMIN";
  password?: string;
  refreshToken?: string;
  blocked?: boolean;
  blockReason?: string;
  provider: ProviderType;
  facebookId?: string;
  image?: string;
  linkedinId?: string;
}

export enum ProviderType {
  GOOGLE = "google",
  MANUAL = "manual",
  FACEBOOK = "facebook",
  APPLE = "apple",
  LINKEDIN = "linkedin",
}
`;

export const mongooseUserSchemaTemplate = (): string => `
import mongoose from "mongoose";
import { ProviderType, type IUser } from "./user.dto";

const Schema = mongoose.Schema;

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String },
    active: { type: Boolean, required: false, default: true },
    role: {
      type: String,
      required: true,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    password: { type: String, select: false },
    refreshToken: { type: String, required: false, default: "", select: false },
    blocked: { type: Boolean, default: false },
    blockReason: { type: String, default: "" },
    provider: {
      type: String,
      enum: Object.values(ProviderType),
      default: ProviderType.MANUAL,
    },
    facebookId: { type: String, select: false },
    image: { type: String },
    linkedinId: { type: String, select: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("user", UserSchema);
`;

export const mongooseUserServiceTemplate = (): string => `
import bcrypt from "bcrypt";
import { ProjectionType, QueryOptions } from "mongoose";
import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};

export const createUser = async (
  data: Omit<IUser, "_id" | "createdAt" | "updatedAt">
) => {
  const result = await UserSchema.create({
    ...data,
    password: data.password ? await hashPassword(data.password) : undefined,
  });
  const { refreshToken, password, ...user } = result.toJSON();
  return user;
};

export const updateUser = async (id: string, data: IUser) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
    select: "-password -refreshToken -facebookId",
  });
  return result;
};

export const editUser = async (id: string, data: Partial<IUser>) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
    select: "-password -refreshToken -facebookId",
  });
  return result;
};

export const deleteUser = async (id: string) => {
  const result = await UserSchema.deleteOne(
    { _id: id },
    { select: "-password -refreshToken -facebookId" }
  );
  return result;
};

export const getUserById = async (
  id: string,
  projection?: ProjectionType<IUser>
) => {
  const result = await UserSchema.findById(id, projection).lean();
  return result;
};

export const getAllUser = async (
  projection?: ProjectionType<IUser>,
  options?: QueryOptions<IUser>
) => {
  const result = await UserSchema.find({}, projection, options).lean();
  return result;
};
export const getUserByEmail = async (
  email: string,
  projection?: ProjectionType<IUser>
) => {
  const result = await UserSchema.findOne({ email }, projection).lean();
  return result;
};

export const countUser = () => {
  return UserSchema.countDocuments();
};
`;

export const mongooseDatabaseServiceTemplate = (): string => `
import mongoose from "mongoose";
import logger from "./logger.service";

export const initDB = async (): Promise<boolean> => {
  return await new Promise((resolve, reject) => {
    const mongodbUri = process.env.DATABASE_URL ?? "";

    if (mongodbUri === "") throw new Error("mongod db uri not found!");
    mongoose.set("strictQuery", false);
    mongoose
      .connect(mongodbUri)
      .then(() => {
        logger.info("DB Connected!");
        resolve(true);
      })
      .catch(reject);
  });
};
`;
