import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use((req, res, next) => {
    console.log('📥 Incoming Request:', req.method, req.url);
    console.log('🧾 Headers:', req.headers);
    next();
  });
  await app.listen(3030);
}
bootstrap();
