// src/checkout/checkout.controller.ts
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CheckoutService } from './checkout.service';

@Controller('checkout') // rota /api/checkout
@UseGuards(AuthGuard)
export class CheckoutController {
  constructor(private readonly svc: CheckoutService) {}

  @Post()
  createSession(
    @Body()
    dto: {
      orderId: number;
      amount: number;
    },
  ) {
    return this.svc.createSession(dto);
  }
}
