// Define error codes
const CODE_00000_UNKNOW_ERROR = "00000";
const CODE_00300_DATABASE_CONNECT_FAILURE = "00300";
const CODE_00301_DATABASE_EXECUTEION_FAILURE = "00301";
const CODE_00321_DATABASE_DUPLICATE = "00321";
const CODE_00322_DATABASE_DATA_NOT_FOUND = "00322";

// Error info interface
export interface ErrorInfo {
  code: string;
  message: string;
  details?: string;
}

// Error keys enum
export enum ErrorKey {
  UNKNOW_ERROR_00000 = "UNKNOW_ERROR_00000",
  DB_CONNECT_FAILURE_00300 = "DB_CONNECT_FAILURE_00300",
  DB_EXECUTEION_FAILURE_00301 = "DB_EXECUTEION_FAILURE_00301",
  DB_DUPLICATE_00321 = "DB_DUPLICATE_00321",
  DB_DATA_NOT_FOUND_00322 = "DB_DATA_NOT_FOUND_00322"
}

// Error map
export const ErrorMap = {
  UNKNOW_ERROR_00000: {
    code: CODE_00000_UNKNOW_ERROR,
    message: "Unknow Error"
  },
  DB_CONNECT_FAILURE_00300: {
    code: CODE_00300_DATABASE_CONNECT_FAILURE,
    message: "Database Connection Failure"
  },
  DB_EXECUTEION_FAILURE_00301: {
    code: CODE_00301_DATABASE_EXECUTEION_FAILURE,
    message: "Database Executeion Failure"
  },
  DB_DUPLICATE_00321: {
    code: CODE_00321_DATABASE_DUPLICATE,
    message: "Database Duplicate"
  },
  DB_DATA_NOT_FOUND_00322: {
    code: CODE_00322_DATABASE_DATA_NOT_FOUND,
    message: "Database Data Not Found"
  }
} as const satisfies Record<ErrorKey, ErrorInfo>;

// Type for error map keys
export type ErrorMapKey = keyof typeof ErrorMap;

/**
 * Custom Application Error class
 * Usage:
 * throw new AppError(ErrorKey.DB_CONNECT_FAILURE);
 * throw new AppError(ErrorKey.DB_CONNECT_FAILURE, 'Connection timeout');
 * throw new AppError('DB_CONNECT_FAILURE_00300'); // also works
 */
export class AppError extends Error {
  code: string;
  message: string;
  details?: string;
  statusCode: number;

  constructor(
    errorKey: ErrorKey | ErrorMapKey,
    details?: string,
    statusCode: number = 400
  ) {
    // Convert ErrorKey enum to ErrorMapKey string
    const key = typeof errorKey === 'string' ? errorKey : errorKey as unknown as ErrorMapKey;
    const errorConfig = ErrorMap[key];

    super(errorConfig.message);

    this.name = "AppError";
    this.code = errorConfig.code;
    this.message = errorConfig.message;
    this.details = details;
    this.statusCode = statusCode;

    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * Get error response object (useful for API responses)
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details
    };
  }

  /**
   * Get full error info
   */
  getFullError() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      statusCode: this.statusCode,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Type guard to check if error is AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function createAppError(message: string | null = null): AppError {
  return new AppError(ErrorKey.UNKNOW_ERROR_00000, message ?? undefined);
}

export function getErrorMessage(error: unknown): any {
  if (error instanceof AppError) {
    return error;
  } else if (error instanceof Error) {
    return JSON.stringify({
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  } else {
    return "Unknown error";
  }
}