import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { idSchema, patientSchema } from '../validation.js';

const router = Router();
router.use(authenticate);

router.post('/', validate(patientSchema), async (req, res) => {
  const patient = await prisma.patient.create({ data: { ...req.body, ownerId: req.user.id } });
  res.status(201).json(patient);
});
router.get('/', async (req, res) => {
  res.json(await prisma.patient.findMany({ where: { ownerId: req.user.id }, orderBy: { createdAt: 'desc' } }));
});
router.get('/:id', validate(idSchema, 'params'), async (req, res) => {
  const patient = await prisma.patient.findFirst({ where: { id: req.params.id, ownerId: req.user.id }, include: { mappings: { include: { doctor: true } } } });
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  res.json(patient);
});
router.put('/:id', validate(idSchema, 'params'), validate(patientSchema), async (req, res) => {
  const result = await prisma.patient.updateMany({ where: { id: req.params.id, ownerId: req.user.id }, data: req.body });
  if (!result.count) return res.status(404).json({ error: 'Patient not found' });
  res.json(await prisma.patient.findUnique({ where: { id: req.params.id } }));
});
router.delete('/:id', validate(idSchema, 'params'), async (req, res) => {
  const result = await prisma.patient.deleteMany({ where: { id: req.params.id, ownerId: req.user.id } });
  if (!result.count) return res.status(404).json({ error: 'Patient not found' });
  res.status(204).send();
});

export default router;
