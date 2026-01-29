import { createTestApp, closeTestApp } from '../utils/test-app';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../src/users/users.service';
import { UserRole } from '../../src/users/roles.enum';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    app = await createTestApp();

    const admin = await app.get(UsersService).create({
      email: 'admin@example.com',
      password: 'adminpass',
      role: UserRole.Owner,
      name: 'Admin',
    });

    const jwtService = app.get(JwtService);
    adminToken = jwtService.sign({ userId: admin._id, role: admin.role });
  }, 30000);

  afterAll(async () => {
    if (app) await app.close();
    await closeTestApp(app);
  });

  it('should create user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'test@test.com',
        password: '123456',
        name: 'Test User',
        role: 'seller',
      })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.email).toBe('test@test.com');
    expect(response.body.role).toBe('seller');
    expect(response.body.permissions).toContain('make-sales');
  });
});
