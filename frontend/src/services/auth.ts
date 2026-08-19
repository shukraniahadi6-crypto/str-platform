import { mockUsers } from '../data/mockData'
import type { Role, User } from '../types'

export interface AuthPayload {
  email: string
  password: string
}

export const login = async ({ email }: AuthPayload): Promise<User | null> => {
  const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
  return Promise.resolve(user ?? null)
}

export const signup = async (name: string, email: string, role: Role): Promise<User> => {
  return Promise.resolve({ id: crypto.randomUUID(), name, email, role })
}
