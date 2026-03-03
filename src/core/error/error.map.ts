const CODE_00000_UNKNOW_ERROR = "00000"
const CODE_00301_DATABASE_DUPLICATE = "00301"

export const ErrorMap = {
  UNKNOW_ERROR_00000: {
    code: CODE_00000_UNKNOW_ERROR,
    message: "Unknow Error"
  },
  DB_DUPLICATE_00301: {
    code: CODE_00301_DATABASE_DUPLICATE,
    message: "Database Duplicate"
  }
} as const;

export type ErrorKey = keyof typeof ErrorMap;
export type ErrorCode = typeof ErrorMap[ErrorKey]["code"];

export function getUnknowError(msg: string = ErrorMap.UNKNOW_ERROR_00000.message): any {
  return {
    code: CODE_00000_UNKNOW_ERROR,
    message: msg
  }
} 

export function createError(
  code: string,
  message?: string
) {
  const error = findErrorByCode(code) ?? {
    code: code,
    message: message
  };

  return error;
}

function findErrorByCode(code: string): ErrorKey | undefined {
  return (Object.keys(ErrorMap) as ErrorKey[]).find(
    key => ErrorMap[key].code === code
  );
}