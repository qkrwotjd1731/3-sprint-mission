import { refine, string } from 'superstruct';

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
