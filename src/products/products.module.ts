// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [ConfigModule], // pra ler as URLs do .env
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
