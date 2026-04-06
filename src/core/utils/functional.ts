import { AppError, ErrorKey } from "../error/error.app.js";

export function hasParameter<T>(
  value: any | undefined, 
  clazz: (new (...args: any[]) => T) | 'string' | 'number' | 'boolean' | 'object' | ArrayConstructor,
  requiredKeys?: (keyof any)[]
): T {
  if (value === null || value === undefined || value === '') {
    throw new AppError(ErrorKey.API_MISSING_PARAMETER_10001);
  }

  let processedValue = value;

  if (typeof value === 'string' && (clazz === Array || clazz === 'object' || typeof clazz === 'function')) {
    try {
      processedValue = JSON.parse(value);
    } catch (e) {
      throw new AppError(ErrorKey.API_PARAMETER_INCORRECT_TYPE_10002);
    }
  }

  const isCorrectType = (typeof clazz === "string") 
    ? typeof processedValue === clazz 
    : (clazz === Array ? Array.isArray(processedValue) : processedValue instanceof (clazz as any));

  if (!isCorrectType) {
    throw new AppError(ErrorKey.API_PARAMETER_INCORRECT_TYPE_10002);
  }

  if (requiredKeys && requiredKeys.length > 0) {
    const itemsToCheck = Array.isArray(processedValue) ? processedValue : [processedValue];
    
    for (const item of itemsToCheck) {
      for (const key of requiredKeys) {
        if (item === null || typeof item !== 'object' || !(key in item)) {
          throw new AppError(ErrorKey.API_PARAMETER_INCORRECT_TYPE_10002);
        }
      }
    }
  }

  return processedValue as T;
}

export function getParameter<T>(
  value: any | undefined, 
  clazz: (new (...args: any[]) => T) | 'string' | 'number' | 'boolean' | 'object' | ArrayConstructor
): T | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  let processedValue = value;

  if (typeof value === 'string' && (clazz === Array || clazz === 'object' || typeof clazz === 'function')) {
    try {
      processedValue = JSON.parse(value);
    } catch (e) {
      throw new AppError(ErrorKey.API_PARAMETER_INCORRECT_TYPE_10002);
    }
  }

  const isCorrectType = (typeof clazz === "string") 
    ? typeof processedValue === clazz 
    : (clazz === Array ? Array.isArray(processedValue) : processedValue instanceof (clazz as any));

  if (!isCorrectType) {
    throw new AppError(ErrorKey.API_PARAMETER_INCORRECT_TYPE_10002);
  }

  return processedValue as T;
} 