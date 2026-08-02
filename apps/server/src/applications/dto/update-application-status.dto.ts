import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '@prisma/client';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    description: 'Yeni Başvuru Durumu',
    enum: ApplicationStatus,
    example: ApplicationStatus.ACCEPTED,
  })
  @IsEnum(ApplicationStatus, { message: 'Geçerli bir durum seçiniz.' })
  @IsNotEmpty({ message: 'Durum alanı zorunludur.' })
  status!: ApplicationStatus;

  @ApiPropertyOptional({ description: 'Şirket Değerlendirme Notu' })
  @IsOptional()
  @IsString()
  note?: string;
}
