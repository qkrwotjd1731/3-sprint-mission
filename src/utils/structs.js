import { refine, string } from 'superstruct';

export const Url = refine(string(), 'URL', value => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
});