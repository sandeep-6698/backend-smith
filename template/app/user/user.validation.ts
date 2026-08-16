import { body, checkExact } from "express-validator";
import { ProviderType } from "./user.dto";
import * as userService from "./user.service";

export const login = checkExact([
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),
]);

export const verifyInvitation = checkExact([
  body("token")
    .notEmpty()
    .bail()
    .withMessage("Token is required")
    .isString()
    .bail()
    .withMessage("Token must be string"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
]);

export const changePassword = checkExact([
  body("currentPassword").custom(async (value, { req }) => {
    const user = await userService.getUserById(req.user._id, {
      provider: true,
    });
    if (user?.provider === ProviderType.MANUAL && !value)
      throw new Error("Current password is required.");
    return true;
  }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
]);

export const verifyEmail = checkExact([
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .custom(async (value) => {
      const user = await userService.getUserByEmail(value);
      if (user) throw new Error("Email is already exist.");
      return true;
    }),
]);

export const forgotPassword = checkExact([
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .custom(async (value) => {
      const user = await userService.getUserByEmail(value);
      if (!user) {
        throw new Error("User not found!");
      }
      if (user.provider !== ProviderType.MANUAL)
        throw new Error(`Please login with ${ProviderType.MANUAL}`);
      return true;
    }),
]);

export const createUser = checkExact([
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .custom(async (value) => {
      const user = await userService.getUserByEmail(value);
      if (user) throw new Error("Email is already exist.");
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
]);

export const updateUser = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isString()
    .withMessage("email must be a string"),
  body("active").isBoolean().withMessage("active must be a boolean"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("password must be a string"),
];

export const editUser = [
  body("name").isString().withMessage("name must be a string"),
  body("email").isString().withMessage("email must be a string"),
  body("active").isBoolean().withMessage("active must be a boolean"),
  body("password").isString().withMessage("password must be a string"),
];

export const refreshToken = [
  body("refreshToken")
    .notEmpty()
    .bail()
    .withMessage("Refresh token is required")
    .isString()
    .bail()
    .withMessage("refreshToken must be string"),
];

export const socialLogin = (name: string) => [
  body(name)
    .notEmpty()
    .bail()
    .withMessage(`${name} is required`)
    .isString()
    .bail()
    .withMessage(`${name} must be string`),
];
