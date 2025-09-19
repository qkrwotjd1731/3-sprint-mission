import { refine, string } from 'superstruct';

export const idParamsStruct = refine(string(), 'ValidId', (value) => {
  const parsedId = parseInt(value, 10);
  if (isNaN(parsedId) || parsedId <= 0) {
    return false;
  }
  return true;
});

export const Email = refine(string(), 'Email', (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
});

export const Url = refine(string(), 'URL', (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
});
