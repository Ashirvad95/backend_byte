import { z } from 'zod';

const optionalText = z.string().trim().min(1).optional().nullable();
const email = z.string().trim().email().optional().nullable();

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72)
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});

export const patientSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email,
  phone: optionalText,
  address: optionalText,
  dateOfBirth: z.coerce.date().optional().nullable(),
  gender: optionalText
});

export const doctorSchema = z.object({
  name: z.string().trim().min(2).max(100),
  specialization: z.string().trim().min(2).max(100),
  email,
  phone: optionalText
});

export const mappingSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid()
});

export const idSchema = z.object({ id: z.string().uuid() });
export const patientIdSchema = z.object({ patient_id: z.string().uuid() });
