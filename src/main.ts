import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  const portEnv = process.env.PORT;
  if (!portEnv) throw new Error('PORT is not defined in environment variables');

  const PORT = Number(portEnv);
  if (isNaN(PORT)) throw new Error('PORT is not a valid number');

  await app.listen(PORT);
  console.log(`🚀 Server running on port ${PORT}`);
}
bootstrap();
