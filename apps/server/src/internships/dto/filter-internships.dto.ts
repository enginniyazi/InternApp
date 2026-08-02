import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { InternshipType, EducationLevel, WorkModel } from '@prisma/client';

export class FilterInternshipsDto {
  @ApiPropertyOptional({ description: 'Arama terimi (başlık veya açıklama)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Lokasyon / Şehir filtresi' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Şehir' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Remote çalışma filtresi' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isRemote?: boolean;

  @ApiPropertyOptional({ enum: InternshipType, description: 'Staj Tipi' })
  @IsOptional()
  @IsEnum(InternshipType)
  internshipType?: InternshipType;

  @ApiPropertyOptional({ enum: EducationLevel, description: 'Eğitim Seviyesi' })
  @IsOptional()
  @IsEnum(EducationLevel)
  targetEducationLevel?: EducationLevel;

  @ApiPropertyOptional({ enum: WorkModel, description: 'Çalışma Modeli' })
  @IsOptional()
  @IsEnum(WorkModel)
  workModel?: WorkModel;
}
