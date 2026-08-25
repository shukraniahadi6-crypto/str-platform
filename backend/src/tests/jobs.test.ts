import request from 'supertest';
import { app } from '../app';
import { initializeDatabase, sequelize } from '../utils/database';

describe('jobs and offers flow', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('creates job, places bid, accepts bid', async () => {
    const customerSignup = await request(app).post('/api/v1/auth/signup').send({
      name: 'Customer',
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer',
    });
    const customerToken = customerSignup.body.accessToken;

    const courierSignup = await request(app).post('/api/v1/auth/signup').send({
      name: 'Courier',
      email: 'courier@example.com',
      password: 'password123',
      role: 'courier',
    });
    const courierToken = courierSignup.body.accessToken;

    const jobRes = await request(app)
      .post('/api/v1/jobs')
      .set('x-access-token', customerToken)
      .send({
        title: 'Pickup cardboard',
        description: 'Need pickup of boxes',
        pickupAddress: 'A street',
        dropoffAddress: 'Recycling center',
      });
    expect(jobRes.status).toBe(201);

    const bidRes = await request(app)
      .post(`/api/v1/jobs/${jobRes.body.id}/offers`)
      .set('x-access-token', courierToken)
      .send({ price: 24.5 });
    expect(bidRes.status).toBe(201);

    const acceptRes = await request(app)
      .post(`/api/v1/jobs/${jobRes.body.id}/offers/${bidRes.body.id}/accept`)
      .set('x-access-token', customerToken)
      .send();
    expect(acceptRes.status).toBe(200);
    expect(acceptRes.body.status).toBe('accepted');
  });
});
