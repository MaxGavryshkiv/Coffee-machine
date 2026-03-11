// backend-v2/src/identity/guards/active-location.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ActiveLocationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    // перевіряємо, що користувач вибрав локацію
    return !!req.user['locationId'];
  }
}
