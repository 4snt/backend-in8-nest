import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverless from 'serverless-http';
import { AppModule } from '../app.module';

let server: any;

async function bootstrap() {
  const expressApp = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  nestApp.setGlobalPrefix('api');
  nestApp.enableCors();
  await nestApp.init();
  return serverless(expressApp);
}

export default async function handler(req, res) {
  server = server ?? (await bootstrap());
  return server(req, res);
}
