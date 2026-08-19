import request from 'supertest';
import { app } from '../app';
import { initializeDatabase, sequelize } from '../utils/database';

describe('auth routes', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('signs up, logs in and refreshes', async () => {
    const signupRes = await request(app).post('/api/v1/auth/signup').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
      role: 'customer',
    });
    expect(signupRes.status).toBe(201);
    expect(signupRes.body.accessToken).toBeTruthy();

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'alice@example.com',
      password: 'password123',
    });
    expect(loginRes.status).toBe(200);

    const refreshRes = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: loginRes.body.refreshToken });
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.accessToken).toBeTruthy();
  });
});
