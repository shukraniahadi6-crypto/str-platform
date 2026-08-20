import type { User } from './users';

export const userFixtures = {
  vendor: {
    id: 'user-vendor-1',
    email: 'vendor@test.str',
    password: 'VendorPass123!',
    role: 'vendor',
    name: 'Test Vendor',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
  } as User,

  courier: {
    id: 'user-courier-1',
    email: 'courier@test.str',
    password: 'CourierPass123!',
    role: 'courier',
    name: 'Test Courier',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
  } as User,

  admin: {
    id: 'user-admin-1',
    email: 'admin@test.str',
    password: 'AdminPass123!',
    role: 'admin',
    name: 'Test Admin',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
  } as User,

  unverifiedVendor: {
    id: 'user-unverified-1',
    email: 'unverified@test.str',
    password: 'Unverified123!',
    role: 'vendor',
    name: 'Unverified Vendor',
    emailVerified: false,
    createdAt: new Date('2024-06-01'),
  } as User,
};
