type Handler = (error: Error) => any;

export const logValue = <Value>(value: Value, warn?: boolean) => {
  if (value instanceof Error) {
    console.error(value);
  } else {
    warn ? console.warn(value) : console.log(value);
  }
};

export function tryCatch(handler: Handler): any {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function(...args: any[]) {
      try {
        const result = method.apply(this, args);

        // Handle async errors
        if (result && result instanceof Promise) {
          return result.catch((error: any) => {
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

export function onError(error: Error, handler: Handler) {
  if (typeof handler === "function") {
    handler(error);
  } else {
    throw error;
  }
}
