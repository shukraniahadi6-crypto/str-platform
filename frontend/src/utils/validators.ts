import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const createJobSchema = z.object({
  title: z.string().min(3),
  address: z.string().min(5),
  price: z.number().min(1),
})
