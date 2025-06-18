import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  findAllByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
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
    if (!dto.userId) {
      throw new BadRequestException('userId is required to create an order');
    }

    return this.prisma.order.create({
      data: {
        user: { connect: { id: dto.userId } },
        amount: dto.amount,
        currency: dto.currency,
        status: 'pending',
        paymentIntentId: randomUUID(),
        products: dto.products,
        address: dto.address,
      },
    });
  }

  async confirmOrder(id: number): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    await this.prisma.order.update({
      where: { id },
      data: { status: 'confirmada' },
    });
  }
}
