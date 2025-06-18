import { BadRequestException } from '@nestjs/common';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export function normalizeOrderStatus(input: string): OrderStatus {
  if (!input) {
    throw new BadRequestException('Status não pode ser vazio');
  }

  const formatted = removeAccents(input.trim().toLowerCase());

  if (['pending', 'pendente'].includes(formatted)) {
    return OrderStatus.PENDING;
  }

  if (['confirmed', 'confirmado', 'confirmada'].includes(formatted)) {
    return OrderStatus.CONFIRMED;
  }

  if (['cancelled', 'cancelado', 'cancelada'].includes(formatted)) {
    return OrderStatus.CANCELLED;
  }

  throw new BadRequestException(
    `Status inválido: "${input}". Aceitos: pending, confirmed, cancelled ou pendente, confirmado, cancelado.`,
  );
}

function removeAccents(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
