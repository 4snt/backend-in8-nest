import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  // Não forneça fallback local (como || 3000)
  const PORT = Number(process.env.PORT);

  await app.listen(PORT);
}

bootstrap();
