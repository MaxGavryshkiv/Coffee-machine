import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SUPERSECRET',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  providers: [IdentityService, PrismaService],
  controllers: [IdentityController],
})
export class IdentityModule {}
