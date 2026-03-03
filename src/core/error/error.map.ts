
export const ErrorMap = {
  UNKNOW_ERROR_00000: {
    status: "00000",
    message: "Unknow Error"
  }
} as const;

export type ErrorCode = keyof typeof ErrorMap;
