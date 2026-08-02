import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EducationLevel, InternshipType } from '@prisma/client';

export class UpdateStudentProfileDto {
  @ApiPropertyOptional({ description: 'Ad', example: 'Ahmet' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Soyad', example: 'Yılmaz' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Telefon Numarası',
    example: '+905551234567',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Şehir', example: 'İstanbul' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Üniversite', example: 'İTÜ' })
  @IsOptional()
  @IsString()
  university?: string;

  @ApiPropertyOptional({
    description: 'Bölüm',
    example: 'Bilgisayar Mühendisliği',
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: 'Sınıf', example: '3. Sınıf' })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiPropertyOptional({ description: 'GANO / Not Ortalaması', example: 3.45 })
  @IsOptional()
  @IsNumber()
  gpa?: number;

  @ApiPropertyOptional({ enum: EducationLevel, description: 'Eğitim Seviyesi' })
  @IsOptional()
  @IsEnum(EducationLevel)
  educationLevel?: EducationLevel;

  @ApiPropertyOptional({
    enum: InternshipType,
    description: 'Aranan Staj Tipi',
  })
  @IsOptional()
  @IsEnum(InternshipType)
  internshipStatus?: InternshipType;

  @ApiPropertyOptional({
    description: 'Yetenekler',
    example: ['React', 'Python'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({
    description: 'LinkedIn URL',
    example: 'https://linkedin.com/in/ahmet',
  })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @ApiPropertyOptional({
    description: 'GitHub URL',
    example: 'https://github.com/ahmet',
  })
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiPropertyOptional({
    description: 'Biyografi / Hakkında',
    example: 'Yazılım mühendisliği 3. sınıf öğrencisiyim.',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'CV Dosya Bağlantısı (URL)',
    example: 'https://storage.com/cv.pdf',
  })
  @IsOptional()
  @IsString()
  cvUrl?: string;
}
