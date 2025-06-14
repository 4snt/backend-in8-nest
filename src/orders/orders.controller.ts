// src/orders/orders.controller.ts
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { OrdersService } from './orders.service';

@Controller('orders') // rotas ficarão em /api/orders
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly svc: OrdersService) {}

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  create(
    @Body()
    dto: {
      userId: number;
      amount: number;
      currency: string;
      paymentIntentId: string;
      products: any;
      address?: any;
    },
  ) {
    return this.svc.create(dto);
  }
}
