/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Read comma-separated origins from .env
  const allowedOrigins = configService
    .get<string>('CORS_ALLOWED_ORIGINS')
    ?.split(',')
    .map(o => o.trim())
    .filter(Boolean) || ['http://localhost:5173']; // fallback

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
    exposedHeaders: 'Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);

  console.log(`Backend running on port ${port}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
}

bootstrap();