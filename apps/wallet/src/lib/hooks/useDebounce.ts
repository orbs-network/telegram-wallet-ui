import { useRef } from 'react';

function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: NodeJS.Timeout | null = null;
  let currentToken: symbol | null = null;

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const token = Symbol();
    currentToken = token;

    return new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(async () => {
        timeout = null;
        const result = await func(...args);
        if (token === currentToken) {
          resolve(result);
        }
      }, wait);
    });
  };
}

export const useDebounce = <T>(
  func: (...args: any[]) => Promise<T>,
  timeout = 500
) => {
  return useRef(debounceAsync(func, timeout)).current;
};
