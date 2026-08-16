export class AppError extends Error {
  readonly statusCode: number;
  readonly errorCode: string;
  readonly data?: unknown;

  constructor(message: string, statusCode: number, errorCode: string, data?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", data?: unknown) {
    super(message, 400, "BAD_REQUEST", data);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", data?: unknown) {
    super(message, 401, "UNAUTHORIZED", data);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", data?: unknown) {
    super(message, 403, "FORBIDDEN", data);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found", data?: unknown) {
    super(message, 404, "NOT_FOUND", data);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", data?: unknown) {
    super(message, 409, "CONFLICT", data);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation error", data?: unknown) {
    super(message, 422, "VALIDATION_ERROR", data);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Something went wrong", data?: unknown) {
    super(message, 500, "INTERNAL_SERVER_ERROR", data);
  }
}
