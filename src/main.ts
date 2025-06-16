import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { json, raw, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.APP_URL, // 🔥 vindo do .env
    credentials: true,
  });

  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.use('/payment/webhook', raw({ type: 'application/json' }));

  const portEnv = process.env.PORT;
  if (!portEnv) throw new Error('PORT is not defined in environment variables');

  const PORT = Number(portEnv);
  if (isNaN(PORT)) throw new Error('PORT is not a valid number');

  await app.listen(PORT);
  console.log(`🚀 Server running on port ${PORT}`);
}
bootstrap();
