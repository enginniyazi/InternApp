import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInternshipDto {
  @ApiProperty({
    description: 'İlan Başlığı',
    example: 'Frontend Developer Stajyeri',
  })
  @IsString()
  @IsNotEmpty({ message: 'İlan başlığı zorunludur.' })
  title!: string;

  @ApiProperty({
    description: 'İlan Açıklaması',
    example: 'React ve TypeScript deneyimi olan stajyer aranıyor.',
  })
  @IsString()
  @IsNotEmpty({ message: 'İlan açıklaması zorunludur.' })
  description!: string;

  @ApiProperty({ description: 'Lokasyon / Şehir', example: 'İstanbul' })
  @IsString()
  @IsNotEmpty({ message: 'Lokasyon alanı zorunludur.' })
  location!: string;

  @ApiPropertyOptional({
    description: 'Uzaktan (Remote) Çalışma Durumu',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;

  @ApiPropertyOptional({
    description: 'Gereksinimler Listesi',
    example: ['React', 'TypeScript', 'Git'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];
}
