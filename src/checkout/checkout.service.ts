// src/checkout/checkout.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckoutService {
  /**
   * Para demonstração, retorna uma sessão fake.
   * Futuramente aqui você chamaria o SDK Stripe / outro gateway.
   */
  createSession(dto: { orderId: number; amount: number }) {
    return {
      sessionId: `demo_session_${dto.orderId}_${Date.now()}`,
      amount: dto.amount,
      message: 'Checkout session (demo) criada com sucesso',
    };
  }
}
