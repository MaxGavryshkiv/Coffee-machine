import { INestApplication } from '@nestjs/common';
import { createTestApp, closeTestApp } from '../utils/test-app';
import { UsersService } from '../../src/users/users.service';
import { UserRole } from '../../src/users/roles.enum';
import * as request from 'supertest';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  it('should login user', async () => {
    await app.get(UsersService).create({
      email: 'user@test.com',
      password: '123456',
      role: UserRole.Seller,
      name: 'User',
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password: '123456',
      })
      .expect(201);

    expect(res.body).toHaveProperty('access_token');
  });
});
