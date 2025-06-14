import { Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createStripeCheckoutSession(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // ✅ Garante que products é um array e não string ou null
    const products =
      typeof order.products === 'string'
        ? JSON.parse(order.products)
        : (order.products ?? []);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: products.map((item: any) => ({
        price_data: {
          currency: order.currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Stripe usa centavos
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.APP_URL}/order/success`,
      cancel_url: `${process.env.APP_URL}/order/cancel`,
      metadata: {
        orderId: String(order.id),
      },
    });

    return { url: session.url };
  }
}
