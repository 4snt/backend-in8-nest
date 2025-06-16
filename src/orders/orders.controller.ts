import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { OrdersService } from './orders.service';

@Controller('orders') // rotas ficarão em /api/orders
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly svc: OrdersService) {}

  @Get()
  findAll(@Req() req: Request) {
    const userId = (req as any).user?.userId;
    if (!userId) throw new BadRequestException('User not authenticated');
    return this.svc.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  create(
    @Req() req: Request,
    @Body()
    dto: {
      amount: number;
      currency: string;
      paymentIntentId: string;
      products: any;
      address?: any;
    },
  ) {
    const userId = (req as any).user?.userId; // ou req.user.userId, dependendo do guard

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    return this.svc.create({
      userId,
      amount: dto.amount,
      currency: dto.currency,
      products: dto.products,
      address: dto.address,
    });
  }
  @Post(':id/payment')
  async confirmPayment(@Param('id') id: string): Promise<boolean> {
    await this.svc.confirmOrder(id);
    return true;
  }
}
