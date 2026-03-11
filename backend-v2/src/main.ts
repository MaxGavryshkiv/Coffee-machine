import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // видаляє зайві поля
      forbidNonWhitelisted: true, // якщо є зайві поля — помилка
      transform: true, // автоматично перетворює типи (наприклад, string -> number)
    }),
  );

  await app.listen(3000);
}
bootstrap();
