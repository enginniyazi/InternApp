import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz.' })
  @IsNotEmpty({ message: 'E-posta alanı zorunludur.' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır.' })
  @IsNotEmpty({ message: 'Şifre alanı zorunludur.' })
  password!: string;

  @IsEnum(Role, { message: 'Geçerli bir rol seçiniz (STUDENT veya COMPANY).' })
  @IsNotEmpty({ message: 'Rol alanı zorunludur.' })
  role!: Role;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  companyName?: string;
}
