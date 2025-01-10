import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getMongoUri, stopMongo } from './mongo-memory';
import { JwtService } from '@nestjs/jwt';

describe('Users (e2e)', () => {
  let app: INestApplication;

  let adminToken: string;

  beforeAll(async () => {
    const mongoUri = await getMongoUri();

    process.env.MONGODB_URI = mongoUri;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const admin = await app.get(UserService).create({
      email: 'admin@example.com',
      password: 'adminpass',
      role: 'owner',
      name: 'Admin',
    });

    const jwtService = moduleFixture.get(JwtService);
    adminToken = jwtService.sign({ userId: admin._id, role: admin.role });
  }, 30000);

  afterAll(async () => {
    if (app) await app.close();
    await stopMongo();
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
