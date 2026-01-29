import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { getMongoUri, stopMongo } from './mongo-memory';

export async function createTestApp(): Promise<INestApplication> {
  const mongoUri = await getMongoUri();
  process.env.MONGODB_URI = mongoUri;

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return app;
}

export async function closeTestApp(app: INestApplication) {
  await app.close();
  await stopMongo();
}
