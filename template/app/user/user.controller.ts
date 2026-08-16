import axios from "axios";
import { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import verifyAppleToken from "verify-apple-id-token";
import { NotFoundError } from "@common/errors";
import { createPaginatedResponse, createResponse } from "@common/helper/response.hepler";
import { renderTemplate, sendEmail } from "@common/services/email/email.service";
import {
  createUserTokens,
  decodeToken,
  isValidPassword,
  verifyToken,
} from "@common/services/passport-jwt.service";
import { ProviderType } from "./user.dto";
import * as userService from "./user.service";
import { hashPassword } from "./user.service";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);
  res.send(createResponse(result, "User created successfully"));
});

export const inviteUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.createUser({
    ...req.body,
    role: "USER",
    active: false,
  });
  const { email } = req.body;
  const { refreshToken } = createUserTokens(result);
  await userService.editUser(result._id, { refreshToken });
  const url = `${process.env.FE_BASE_URL}/reset-password?code=${refreshToken}&type=invite`;
  const html = await renderTemplate("invite", { url, appName: "App" });
  sendEmail({
    to: email,
    subject: "Welcome to App",
    html,
  });
  res.send(createResponse(result, "User invited successfully"));
});

export const verifyInvitation = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body;
    const { email, expired } = decodeToken(token);
    const user = await userService.getUserByEmail(email, {
      refreshToken: true,
      active: true,
    });

    if (!user || expired || token !== user.refreshToken) {
      throw createHttpError(400, { message: "Invitation is expired" });
    }

    if (user?.active) {
      throw createHttpError(400, {
        message: "Invitation is accepted, Please login",
      });
    }

    if (user?.blocked) {
      throw createHttpError(400, { message: "User is blocked" });
    }
    const tokens = await createUserTokens(user);
    await userService.editUser(user._id, {
      password: await hashPassword(password),
      active: true,
      refreshToken: tokens.refreshToken,
    });
    res.send(createResponse(tokens, "User verified successfully"));
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body;
    const { email, expired } = decodeToken(token);
    console.log({ email, expired });
    const user = await userService.getUserByEmail(email, {
      refreshToken: true,
      active: true,
    });

    if (!user || expired || token !== user.refreshToken) {
      throw createHttpError(400, { message: "Invitation is expired" });
    }

    if (!user?.active) {
      throw createHttpError(400, {
        message: "User is not active",
      });
    }

    if (user?.blocked) {
      throw createHttpError(400, { message: "User is blocked" });
    }
    await userService.editUser(user._id, {
      password: await hashPassword(password),
      refreshToken: "",
    });
    res.send(createResponse(null, "Password updated successfully"));
  }
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { currentPassword, password } = req.body;
    const user = await userService.getUserById(req.user?._id!, {
      refreshToken: true,
      active: true,
      password: true,
      provider: true,
    });

    if (!user) {
      throw createHttpError(400, { message: "Invalid user" });
    }

    if (user.provider === ProviderType.MANUAL) {
      const validPassword = await isValidPassword(
        currentPassword,
        user.password!
      );
      if (!validPassword) {
        throw createHttpError(400, {
          message: "Current password doesn't matched",
        });
      }
    }

    await userService.editUser(user._id, {
      password: await hashPassword(password),
      provider: ProviderType.MANUAL,
    });
    res.send(createResponse(null, "Password changed successfully"));
  }
);

export const requestResetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await userService.getUserByEmail(email, {
      active: true,
      blocked: true,
      email: true,
    });

    if (!user?.active) {
      throw createHttpError(400, {
        message: "User is not active",
      });
    }

    if (user?.blocked) {
      throw createHttpError(400, { message: "User is blocked" });
    }

    const tokens = createUserTokens(user);

    await userService.editUser(user._id, {
      refreshToken: tokens.refreshToken,
    });

    const url = `${process.env.FE_BASE_URL}/reset-password?code=${tokens.refreshToken}&type=reset-password`;
    const html = await renderTemplate("reset-password", { url });

    sendEmail({
      to: email,
      subject: "Reset password",
      html,
    });
    res.send(createResponse(null, "Reset password link sent to your email."));
  }
);

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.updateUser(req.params.id, req.body);
  res.send(createResponse(result, "User updated successfully"));
});

export const editUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.editUser(req.params.id, req.body);
  res.send(createResponse(result, "User updated successfully"));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id);
  res.send(createResponse(result, "User deleted successfully"));
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.params.id);
  if (!result) {
    throw new NotFoundError("User not found");
  }
  res.send(createResponse(result));
});

export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
  const skip = (page - 1) * limit;
  const [result, total] = await Promise.all([
    userService.getAllUser({}, { skip, limit }),
    userService.countUser(),
  ]);
  res.send(createPaginatedResponse(result, total, page, limit));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const tokens = createUserTokens(req.user!);
  await userService.editUser(req.user!._id, {
    refreshToken: tokens.refreshToken,
  });
  res.send(createResponse(tokens));
});

export const getUserInfo = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.user?._id!);
  res.send(createResponse(user));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  await userService.editUser(user._id, { refreshToken: "" });
  res.send(createResponse({ message: "User logout successfully!" }));
});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const { email } = verifyToken(refreshToken);
    const user = await userService.getUserByEmail(email, {
      refreshToken: true,
      active: true,
      blocked: true,
      email: true,
      role: true,
    });
    if (!user || refreshToken !== user.refreshToken) {
      throw createHttpError({ message: "Invalid session" });
    }
    if (!user?.active) {
      throw createHttpError({ message: "User is not active" });
    }
    if (user?.blocked) {
      throw createHttpError({ message: "User is blocked" });
    }
    delete user.refreshToken;
    const tokens = createUserTokens(user);
    await userService.editUser(user._id, {
      refreshToken: tokens.refreshToken,
    });
    res.send(createResponse(tokens));
  }
);

export const appleLogin = asyncHandler(async (req: Request, res: Response) => {
  if (!process.env.APPLE_BUNDLE_ID) {
    throw createHttpError({ message: "Apple bundle id not configured!" });
  }

  const jwtClaims = await verifyAppleToken({
    idToken: req.body.id_token,
    clientId: process.env.APPLE_BUNDLE_ID || "",
  });

  const existUser = await userService.getUserByEmail(jwtClaims.email);
  const user =
    existUser ??
    (await userService.createUser({
      email: jwtClaims.email,
      provider: ProviderType.APPLE,
      name: "",
      active: true,
      role: "USER",
    }));
  const tokens = createUserTokens(user);
  await userService.editUser(user._id, { refreshToken: tokens.refreshToken });
  res.send(createResponse(tokens));
});

export const fbLogin = asyncHandler(async (req: Request, res: Response) => {
  const urlSearchParams = new URLSearchParams({
    fields: "id,name,email,picture",
    access_token: req.body.access_token,
  });
  const { data } = await axios.get<{
    id: string;
    name: string;
    email: string;
    picture: {
      data: {
        url: string;
      };
    };
  }>(`https://graph.facebook.com/v15.0/me?${urlSearchParams.toString()}`);

  const existUser = await userService.getUserByEmail(data.email);
  const user =
    existUser ??
    (await userService.createUser({
      email: data.email,
      provider: ProviderType.FACEBOOK,
      facebookId: data.id,
      image: data.picture.data.url,
      name: data?.name,
      role: "USER",
    }));
  const tokens = createUserTokens(user);
  await userService.editUser(user._id, { refreshToken: tokens.refreshToken });
  res.send(createResponse(tokens));
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { data } = await axios.get<{
    email: string;
    name: string;
    picture: string;
  }>("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: "Bearer " + req.body.access_token },
  });

  const { email, name = " ", picture } = data;

  const existUser = await userService.getUserByEmail(data.email);
  const user =
    existUser ??
    (await userService.createUser({
      email,
      name,
      provider: ProviderType.GOOGLE,
      image: picture,
      role: "USER",
    }));

  const tokens = createUserTokens(user);
  await userService.editUser(user._id, { refreshToken: tokens.refreshToken });
  res.send(createResponse(tokens));
});

export const linkedInLogin = asyncHandler(
  async (req: Request, res: Response) => {
    const { access_token } = req.body;

    const urlSearchParams = new URLSearchParams({
      oauth2_access_token: access_token,
    });

    const { data: userData } = await axios.get<{
      sub: string;
      given_name: string;
      family_name: string;
      email: string;
      picture: string;
      name: string;
    }>(`https://api.linkedin.com/v2/userinfo?${urlSearchParams.toString()}`);

    const existUser = await userService.getUserByEmail(userData.email);
    const user =
      existUser ??
      (await userService.createUser({
        email: userData.email,
        name: userData?.name,
        linkedinId: userData.sub,
        image: userData.picture,
        provider: ProviderType.LINKEDIN,
        role: "USER",
      }));
    const tokens = createUserTokens(user);
    await userService.editUser(user._id, { refreshToken: tokens.refreshToken });
    res.send(createResponse(tokens));
  }
);
