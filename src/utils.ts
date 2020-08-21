type Callback = (...args: []) => void;
type Handler = (error: Error, cb?: Callback) => void;

export const Logger = <Value>(value: Value, warn?: boolean): Value => {
  if (value instanceof Error) {
    console.log("Error not Handled:", value);
  } else {
    warn ? console.warn("Handle:", value) : console.log(value);
  }
  return value;
};

export function onError(error: Error, handler: Handler): void | Error {
  if (typeof handler === "function") {
    handler(error);
  } else {
    throw error;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function tryCatch(handler: Handler | Callback | any) {
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
