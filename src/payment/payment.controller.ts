import { Controller, Headers, Post, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook')
  async handleWebhook(
    @Req() request,
    @Res() response,
    @Headers('stripe-signature') signature: string,
  ) {
    const result = await this.paymentService.handleStripeWebhook(
      request,
      signature,
    );

    if (result.success) {
      return response.status(200).send('Webhook received');
    }

    return response.status(400).send(`Webhook Error: ${result.message}`);
  }
}
