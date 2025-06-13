import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    // lógica de registro adaptada de UserService.ts :contentReference[oaicite:0]{index=0}
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('E-mail já cadastrado.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { name, email, hashedPassword },
    });

    // remover hashedPassword antes de retornar

    const { hashedPassword: _, ...userData } = user;
    return userData;
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.hashedPassword) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // Agora hashedPassword é definitivamente string
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const token = this.jwt.sign({ userId: user.id, role: user.role });
    const { hashedPassword: _, ...userData } = user;
    return { token, user: userData };
  }
}
