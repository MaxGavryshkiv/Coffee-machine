import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../roles.enum';
import { UserPermissions } from '../permissions.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'Password must be longer than or equal to 6 characters',
  })
  password: string;

  @IsEnum(UserRole, {
    message: 'Impossible to create user with such role',
  })
  readonly role: UserRole;

  @IsOptional()
  @IsEnum(UserPermissions, {
    each: true,
    message: 'Impossible to create user with such permissions',
  })
  readonly permissions?: UserPermissions[];

  @IsString()
  @IsNotEmpty()
  name: string;
}
