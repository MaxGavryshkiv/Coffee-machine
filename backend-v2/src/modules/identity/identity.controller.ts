import { Body, Controller, Post } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.identityService.login(dto.email, dto.password);
  }
}
