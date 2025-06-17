import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { json, raw, urlencoded } from 'express';
import * as pkg from '../package.json'; // ← 🔥 importa o package.json
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('In8 Shop API')
    .setDescription('Documentação da API In8 Shop')
    .setVersion(pkg.version) // ← versão automática
    .addTag('products')
    .addTag('checkout')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());

  const allowedOrigins = process.env.APP_URL?.split(',') || [];
  app.enableCors({
    origin: allowedOrigins,
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
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📑 Swagger docs at http://localhost:${PORT}/api`);
}
bootstrap();
