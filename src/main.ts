import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe(),
  );

  // Aktifkan CORS
  app.enableCors({
    origin: true, // Sesuaikan dengan domain frontend
    methods: ['GET', 'POST'],
    credentials: true
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
