import {
  Injectable,
  Scope,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { tenantExtension } from './prisma.middleware';

@Injectable({ scope: Scope.REQUEST })
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(@Inject(REQUEST) private readonly request: Request) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });

    super({ adapter });

    const tenantId = this.request?.user?.['tenantId'];

    if (tenantId) {
      const extended = this.$extends(tenantExtension(tenantId));
      Object.assign(this, extended);
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
