import { Body, Controller, Post } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';

@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Post('register')
  register(@Body() dto: RegisterTenantDto) {
    return this.platformService.registerTenant(dto);
  }
}
