import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';
import { config } from '../config.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../validation.js';

const router = Router();
const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email });

router.post('/register', validate(registerSchema), async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { name, email: email.toLowerCase(), passwordHash } });
  res.status(201).json({ user: publicUser(user) });
});

router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  const valid = user && await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });
  const token = jwt.sign({}, config.jwtSecret, { subject: user.id, expiresIn: config.jwtExpiresIn });
  res.json({ token, user: publicUser(user) });
});

export default router;
