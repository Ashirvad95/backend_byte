import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { idSchema, mappingSchema, patientIdSchema } from '../validation.js';

const router = Router();
router.use(authenticate);

router.post('/', validate(mappingSchema), async (req, res) => {
  const { patientId, doctorId } = req.body;
  const patient = await prisma.patient.findFirst({ where: { id: patientId, ownerId: req.user.id } });
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  const mapping = await prisma.mapping.create({ data: { patientId, doctorId }, include: { patient: true, doctor: true } });
  res.status(201).json(mapping);
});
router.get('/', async (req, res) => {
  res.json(await prisma.mapping.findMany({ where: { patient: { ownerId: req.user.id } }, include: { patient: true, doctor: true }, orderBy: { createdAt: 'desc' } }));
});
router.get('/:patient_id', validate(patientIdSchema, 'params'), async (req, res) => {
  const patient = await prisma.patient.findFirst({ where: { id: req.params.patient_id, ownerId: req.user.id } });
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  res.json(await prisma.mapping.findMany({ where: { patientId: patient.id }, include: { doctor: true } }));
});
router.delete('/:id', validate(idSchema, 'params'), async (req, res) => {
  const mapping = await prisma.mapping.findFirst({ where: { id: req.params.id, patient: { ownerId: req.user.id } } });
  if (!mapping) return res.status(404).json({ error: 'Mapping not found' });
  await prisma.mapping.delete({ where: { id: mapping.id } });
  res.status(204).send();
});

export default router;
