import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../roles.enum';
import { UserPermissions } from '../permissions.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  readonly role: UserRole;

  @IsEnum(UserPermissions)
  readonly permissions: UserPermissions;

  @IsString()
  @IsNotEmpty()
  name: string;
}
