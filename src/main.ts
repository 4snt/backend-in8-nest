import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { json, raw, urlencoded } from 'express';
import { join } from 'path';
import * as pkg from '../package.json';
import { AppModule } from './app/app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));

  const config = new DocumentBuilder()
    .setTitle('In8 Shop API')
    .setDescription('Documentação da API In8 Shop')
    .setVersion(pkg.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use('/payment/webhook', raw({ type: 'application/json' }));

  const allowedOrigins = process.env.APP_URL?.split(',') || [];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const portEnv = process.env.PORT;
  if (!portEnv) throw new Error('PORT is not defined in environment variables');
  const PORT = Number(portEnv);
  if (isNaN(PORT)) throw new Error('PORT is not a valid number');

  await app.listen(PORT);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📑 Swagger docs at http://localhost:${PORT}`);
}
bootstrap();
