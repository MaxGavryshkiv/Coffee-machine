import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const privilegedRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const { user } = context.switchToHttp().getRequest();

    // Якщо немає permissions — нічого не перевіряємо
    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    // Якщо у користувача є одна з привілейованих ролей — дозвіл
    if (privilegedRoles && privilegedRoles.includes(user.role)) return true;

    // Інакше перевіряємо permissions
    return requiredPermissions.every((permission) =>
      user.permissions?.includes(permission),
    );
  }
}
