import { NestFactory } from '@nestjs/core';
import { json, raw, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 Prefixo global das rotas
  app.setGlobalPrefix('api');

  // 🔥 CORS habilitado
  app.enableCors();

  // 🔥 Body parsers padrão para API (JSON e URL encoded)
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // 🔥 Body parser raw SÓ para o webhook do Stripe
  app.use('/payment/webhook', raw({ type: 'application/json' }));

  // 🔥 Validação da porta
  const portEnv = process.env.PORT;
  if (!portEnv) throw new Error('PORT is not defined in environment variables');

  const PORT = Number(portEnv);
  if (isNaN(PORT)) throw new Error('PORT is not a valid number');

  await app.listen(PORT);
  console.log(`🚀 Server running on port ${PORT}`);
}
bootstrap();
