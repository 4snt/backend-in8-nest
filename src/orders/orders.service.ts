// src/orders/orders.service.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.order.findMany({
      orderBy: { createDate: 'desc' },
    });
  }

  findOne(id: string) {
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      throw new BadRequestException('Invalid order ID');
    }
    return this.prisma.order.findUnique({ where: { id: orderId } });
  }

  create(dto: {
    userId: number;
    amount: number;
    currency: string;
    products: any[];
    address?: any;
  }) {
    return this.prisma.order.create({
      data: {
        userId: dto.userId,
        amount: dto.amount,
        currency: dto.currency,
        status: 'pending', // 🔥 Sempre começa como pending
        paymentIntentId: randomUUID(), // 🔥 Gera automaticamente o ID do pagamento
        products: dto.products,
        address: dto.address,
      },
    });
  }
}
