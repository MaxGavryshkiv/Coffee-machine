import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  providers: [LocationService],
  controllers: [LocationController, PrismaService],
})
export class LocationModule {}
