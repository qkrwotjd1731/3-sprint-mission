export function throwHttpError(message, code, data) {
  const error = new Error(message);
  error.code = code;
  if (data) error.data = data;
  throw error;
}