import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  const port = parseInt(process.env.PORT || '3000', 10);

  await app.listen(port);

  console.log(
    `🚀 Server is running on port ${port} — ${
      process.env.NODE_ENV === 'production'
        ? 'https://backend-in8-nest-production.up.railway.app'
        : `http://localhost:${port}`
    }/api`,
  );
}
bootstrap();
