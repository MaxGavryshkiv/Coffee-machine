import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { PlatformModule } from './modules/platform/platform.module';
import { IdentityModule } from './modules/identity/identity.module';
import { LocationModule } from './modules/location/location.module';

@Module({
  imports: [PrismaModule, PlatformModule, IdentityModule, LocationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
