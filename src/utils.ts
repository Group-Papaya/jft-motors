type Handler = (error: Error) => void;

export const Logger = <Value>(value: Value, warn?: boolean): void => {
  if (value instanceof Error) {
    console.error(value);
  } else {
    warn ? console.warn(value) : console.log(value);
  }
};

export function onError(error: Error, handler: Handler): void | Error {
  if (typeof handler === "function") {
    handler(error);
  } else {
    throw error;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function tryCatch(handler: Handler) {
  return (
    _target: any,
    _key: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor => {
    const method = descriptor.value;
    descriptor.value = function(...args: []) {
      try {
        const result = method.apply(this, args);

        // Handle async errors
        if (result && result instanceof Promise) {
          return result.catch((error: Error) => {
            onError(error, handler);
          });
        }

        return result;
      } catch (error) {
        onError(error, handler);
      }
    };

    return descriptor;
  };
}
