import jwt from 'jsonwebtoken';

export function createToken(user, type) {
  const payload = { id: user.id };
  const options = {
    expiresIn: type === 'refresh' ? '2w' : '1h',
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

export function filterSensitiveUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}