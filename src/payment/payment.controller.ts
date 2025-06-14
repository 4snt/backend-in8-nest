import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(@Body() body: { orderId: number }) {
    const { orderId } = body;

    if (!orderId) {
      throw new NotFoundException('Order ID is required');
    }

    return this.paymentService.createStripeCheckoutSession(orderId);
  }
}
