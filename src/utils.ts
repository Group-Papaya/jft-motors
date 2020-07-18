export const cnLog = <Error>(error: Error) => console.log(error);
export const cnError = <Error>(error: Error) => console.error(error);

export const catchError = async <Value>(promise: Promise<Value>) => {
  try {
    return await promise;
  } catch (error) {
    cnLog(error);
    return error;
  }
};
