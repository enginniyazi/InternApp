import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ description: 'İlan ID', example: 'uuid-string' })
  @IsString()
  @IsNotEmpty({ message: 'İlan ID zorunludur.' })
  internshipId!: string;

  @ApiPropertyOptional({
    description: 'Başvuru Notu',
    example: 'Ön yazım ve detaylar...',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
