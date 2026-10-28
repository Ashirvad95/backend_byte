import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { doctorSchema, idSchema } from '../validation.js';

const router = Router();
router.use(authenticate);

router.post('/', validate(doctorSchema), async (req, res) => {
  res.status(201).json(await prisma.doctor.create({ data: { ...req.body, ownerId: req.user.id } }));
});
router.get('/', async (req, res) => {
  res.json(await prisma.doctor.findMany({ orderBy: { createdAt: 'desc' } }));
});
router.get('/:id', validate(idSchema, 'params'), async (req, res) => {
  const doctor = await prisma.doctor.findUnique({ where: { id: req.params.id }, include: { mappings: { include: { patient: true } } } });
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  res.json(doctor);
});
router.put('/:id', validate(idSchema, 'params'), validate(doctorSchema), async (req, res) => {
  const result = await prisma.doctor.updateMany({ where: { id: req.params.id, ownerId: req.user.id }, data: req.body });
  if (!result.count) return res.status(404).json({ error: 'Doctor not found' });
  res.json(await prisma.doctor.findUnique({ where: { id: req.params.id } }));
});
router.delete('/:id', validate(idSchema, 'params'), async (req, res) => {
  const result = await prisma.doctor.deleteMany({ where: { id: req.params.id, ownerId: req.user.id } });
  if (!result.count) return res.status(404).json({ error: 'Doctor not found' });
  res.status(204).send();
});

export default router;
