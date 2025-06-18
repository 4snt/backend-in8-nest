import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  OrderStatus,
  normalizeOrderStatus,
} from '../common/helpers/normalizeOrderStatus';
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
    return this.prisma.order.findUnique({
      where: { id: orderId },
    });
  }

  create(dto: {
    userId: number;
    amount: number;
    currency: string;
    products: any[];
    address?: any;
    status?: string; // Pode ser passado opcionalmente no payload
  }) {
    if (!dto.userId) {
      throw new BadRequestException('userId is required to create an order');
    }

    const status = dto.status
      ? normalizeOrderStatus(dto.status)
      : OrderStatus.PENDING;

    return this.prisma.order.create({
      data: {
        user: { connect: { id: dto.userId } },
        amount: dto.amount,
        currency: dto.currency,
        status,
        paymentIntentId: randomUUID(),
        products: dto.products,
        address: dto.address,
      },
    });
  }

  async confirmOrder(id: number): Promise<void> {
    await this.updateStatus(id, 'confirmed');
  }

  async cancelOrder(id: number): Promise<void> {
    await this.updateStatus(id, 'cancelled');
  }

  private async updateStatus(id: number, status: string): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    await this.prisma.order.update({
      where: { id },
      data: { status: normalizeOrderStatus(status) },
    });
  }
}
