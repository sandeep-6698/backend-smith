import { Router } from "express";
import passport from "passport";
import { catchError } from "@common/middleware/cath-error.middleware";
import { roleAuth } from "@common/middleware/role-auth.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         active:
 *           type: boolean
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *         blocked:
 *           type: boolean
 *         blockReason:
 *           type: string
 *         provider:
 *           type: string
 *           enum: [google, manual, facebook, apple, linkedin]
 *         image:
 *           type: string
 *     CreateUser:
 *       type: object
 *       required: [name, email, password, confirmPassword]
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         confirmPassword:
 *           type: string
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [User]
 *     summary: Get all users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 */
router.get("/", userController.getAllUser);

/**
 * @swagger
 * /users/me:
 *   get:
 *     tags: [User]
 *     summary: Get the current authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/me", roleAuth(["USER"]), userController.getUserInfo);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/:id", userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Delete user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.delete("/:id", userController.deleteUser);

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [User]
 *     summary: Create user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/", userValidator.createUser, catchError, userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [User]
 *     summary: Replace user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.put("/:id", userValidator.updateUser, catchError, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     tags: [User]
 *     summary: Update user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.patch("/:id", userValidator.editUser, catchError, userController.editUser);

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags: [User]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post(
  "/register",
  userValidator.createUser,
  catchError,
  userController.createUser
);

/**
 * @swagger
 * /users/invite:
 *   post:
 *     tags: [User]
 *     summary: Invite a user by email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.post(
  "/invite",
  userValidator.verifyEmail,
  catchError,
  userController.inviteUser
);

/**
 * @swagger
 * /users/verify-invitation:
 *   post:
 *     tags: [User]
 *     summary: Verify an invitation and set the user's password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password, confirmPassword]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.post(
  "/verify-invitation",
  userValidator.verifyInvitation,
  catchError,
  userController.verifyInvitation
);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     tags: [User]
 *     summary: Reset password using a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password, confirmPassword]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.post(
  "/reset-password",
  userValidator.verifyInvitation,
  catchError,
  userController.resetPassword
);

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     tags: [User]
 *     summary: Request a password reset email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.post(
  "/forgot-password",
  userValidator.forgotPassword,
  catchError,
  userController.requestResetPassword
);

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     tags: [User]
 *     summary: Change the authenticated user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password, confirmPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.post(
  "/change-password",
  roleAuth(["USER"]),
  userValidator.changePassword,
  catchError,
  userController.changePassword
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [User]
 *     summary: Log in with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.post(
  "/login",
  userValidator.login,
  catchError,
  passport.authenticate("login", { session: false }),
  userController.login
);

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     tags: [User]
 *     summary: Exchange a refresh token for a new access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.post(
  "/refresh-token",
  userValidator.refreshToken,
  catchError,
  userController.refreshToken
);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     tags: [User]
 *     summary: Log out the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Success
 */
router.post("/logout", roleAuth(["USER"]), userController.logout);

/**
 * @swagger
 * /users/social/google:
 *   post:
 *     tags: [User]
 *     summary: Log in or sign up with Google
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [access_token]
 *             properties:
 *               access_token:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.post(
  "/social/google",
  userValidator.socialLogin("access_token"),
  catchError,
  userController.googleLogin
);

/**
 * @swagger
 * /users/social/facebook:
 *   post:
 *     tags: [User]
 *     summary: Log in or sign up with Facebook
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [access_token]
 *             properties:
 *               access_token:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.post(
  "/social/facebook",
  userValidator.socialLogin("access_token"),
  catchError,
  userController.fbLogin
);

/**
 * @swagger
 * /users/social/linkedin:
 *   post:
 *     tags: [User]
 *     summary: Log in or sign up with LinkedIn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [access_token]
 *             properties:
 *               access_token:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.post(
  "/social/linkedin",
  userValidator.socialLogin("access_token"),
  catchError,
  userController.linkedInLogin
);

/**
 * @swagger
 * /users/social/apple:
 *   post:
 *     tags: [User]
 *     summary: Log in or sign up with Apple
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_token]
 *             properties:
 *               id_token:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Success
 */
router.post(
  "/social/apple",
  userValidator.socialLogin("id_token"),
  catchError,
  userController.appleLogin
);

export default router;
