import { Injectable } from '@nestjs/common';
import { Request } from 'express';
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
      throw new Error('Order not found');
    }

    const products = (order.products as any[]) ?? [];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: products.map((item: any) => ({
        price_data: {
          currency: order.currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
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

  async handleStripeWebhook(request: Request, signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      const rawBody = (request as any).body;
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );
    } catch (err: any) {
      return {
        success: false,
        message: `Webhook signature verification failed: ${err.message}`,
      };
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.orderId;

      if (orderId) {
        await this.prisma.order.update({
          where: { id: Number(orderId) },
          data: { status: 'paid' },
        });
      }

      return { success: true };
    }

    console.log(`Unhandled event type ${event.type}`);
    return { success: true };
  }
}
