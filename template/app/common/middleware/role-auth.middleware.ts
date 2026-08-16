import { type NextFunction, type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import process from "process";
import { type IUser } from "@user/user.dto";

export const roleAuth = (roles: IUser["role"][], publicRoutes: string[] = []) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (publicRoutes.includes(req.path)) {
        next();
        return;
      }
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        throw createHttpError(401, {
          message: `Invalid token`,
        });
      }
      try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decodedUser as IUser;
      } catch (error: any) {
        if (error.message === "jwt expired") {
          throw createHttpError(401, {
            message: `Token expired`,
            data: {
              type: "TOKEN_EXPIRED",
            },
          });
        }
        throw createHttpError(400, {
          message: error.message,
        });
      }
      const user = req.user as IUser;
      if (!roles.includes(user.role)) {
        const type =
          user.role.slice(0, 1) + user.role.slice(1).toLocaleLowerCase();

        throw createHttpError(401, {
          message: `${type} can not access this resource`,
        });
      }
      next();
    }
  );
