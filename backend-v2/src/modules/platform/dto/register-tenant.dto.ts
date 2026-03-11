import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegisterTenantDto {
  @IsString()
  @IsNotEmpty()
  tenantName: string; // назва бізнесу

  @IsEmail()
  @IsNotEmpty()
  ownerEmail: string; // email власника

  @IsString()
  @MinLength(6)
  ownerPassword: string; // пароль власника

  @IsString()
  @IsNotEmpty()
  ownerName: string; // ім'я власника
}
