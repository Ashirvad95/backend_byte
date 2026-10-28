import { Prisma } from '@prisma/client';

export function notFound(req, res) {
  res.status(404).json({ error: 'Route not found' });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'A record with these values already exists' });
    if (error.code === 'P2025') return res.status(404).json({ error: 'Record not found' });
  }
  console.error(error);
  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' ? { message: error.message } : {})
  });
}
