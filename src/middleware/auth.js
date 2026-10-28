import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication token is required' });

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (typeof payload !== 'object' || !payload.sub) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }
    req.user = { id: payload.sub };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}
