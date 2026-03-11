import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class PlatformService {
  constructor(private readonly prisma: PrismaService) {}

  async registerTenant(dto: RegisterTenantDto) {
    const { tenantName, ownerEmail, ownerPassword, ownerName } = dto;

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Створюємо tenant
      const tenant = await tx.tenant.create({
        data: {
          name: tenantName,
        },
      });

      // 2 Хешуємо пароль
      const hashedPassword = await bcrypt.hash(ownerPassword, 10);

      // 3 Створюємо owner user

      const owner = await tx.user.create({
        data: {
          email: ownerEmail,
          password: hashedPassword,
          role: Role.OWNER,
          name: ownerName,
          tenant: {
            connect: { id: tenant.id },
          },
        },
      });

      return {
        tenantId: tenant.id,
        ownerId: owner.id,
      };
    });
  }
}
