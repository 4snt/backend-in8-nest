import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { name, email, password } = dto;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('E-mail já cadastrado.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { name, email, hashedPassword },
    });

    const { hashedPassword: _, ...userData } = user;
    return userData;
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.hashedPassword) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const token = this.jwt.sign({ userId: user.id, role: user.role });
    const { hashedPassword: _, ...userData } = user;
    return { token, user: userData };
  }
}
