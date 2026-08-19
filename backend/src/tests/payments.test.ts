import request from 'supertest';
import { app } from '../app';
import { initializeDatabase, sequelize } from '../utils/database';
import { Job, Payment } from '../models';

describe('payments', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('charges a completed job and refunds', async () => {
    const customerSignup = await request(app).post('/api/v1/auth/signup').send({
      name: 'Pay Customer',
      email: 'pay-customer@example.com',
      password: 'password123',
      role: 'customer',
    });
    const courierSignup = await request(app).post('/api/v1/auth/signup').send({
      name: 'Pay Courier',
      email: 'pay-courier@example.com',
      password: 'password123',
      role: 'courier',
    });
    const adminSignup = await request(app).post('/api/v1/auth/signup').send({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });
    const adminToken = adminSignup.body.accessToken;

    const job = await Job.create({
      customerId: customerSignup.body.user.id,
      courierId: courierSignup.body.user.id,
      title: 'Done job',
      description: 'done',
      pickupAddress: 'x',
      dropoffAddress: 'y',
      status: 'completed',
    });

    const chargeRes = await request(app)
      .post('/api/v1/payments/charge')
      .set('x-access-token', adminToken)
      .send({
        jobId: job.id,
        customerId: customerSignup.body.user.id,
        courierId: courierSignup.body.user.id,
        amount: 42,
      });
    expect(chargeRes.status).toBe(201);

    const payment = await Payment.findByPk(chargeRes.body.id);
    expect(payment).not.toBeNull();

    const refundRes = await request(app)
      .post(`/api/v1/payments/${chargeRes.body.id}/refund`)
      .set('x-access-token', adminToken)
      .send();
    expect(refundRes.status).toBe(200);
    expect(refundRes.body.status).toBe('refunded');
  });
});
