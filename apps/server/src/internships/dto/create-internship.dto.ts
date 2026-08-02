import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  InternshipType,
  EducationLevel,
  WorkModel,
  StipendType,
  ReturnOfferProbability,
} from '@prisma/client';

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

  @ApiProperty({
    description: 'Lokasyon / Şehir',
    example: 'İstanbul / Maslak',
  })
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

  // --- Gelişmiş İlan Alanları ---

  @ApiPropertyOptional({
    enum: InternshipType,
    default: InternshipType.MANDATORY,
  })
  @IsOptional()
  @IsEnum(InternshipType)
  internshipType?: InternshipType;

  @ApiPropertyOptional({
    enum: EducationLevel,
    default: EducationLevel.BACHELOR,
  })
  @IsOptional()
  @IsEnum(EducationLevel)
  targetEducationLevel?: EducationLevel;

  @ApiPropertyOptional({
    example: ['Bilgisayar Mühendisliği', 'Yazılım Mühendisliği'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetDepartments?: string[];

  @ApiPropertyOptional({ example: [3, 4] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  targetGrades?: number[];

  @ApiPropertyOptional({ example: 5, default: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  weeklyDays?: number;

  @ApiPropertyOptional({ example: 12, default: 12 })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationWeeks?: number;

  @ApiPropertyOptional({ enum: WorkModel, default: WorkModel.HYBRID })
  @IsOptional()
  @IsEnum(WorkModel)
  workModel?: WorkModel;

  @ApiPropertyOptional({ example: 'İstanbul' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Maslak' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ enum: StipendType, default: StipendType.MINIMUM_WAGE })
  @IsOptional()
  @IsEnum(StipendType)
  stipendType?: StipendType;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  hasMealAllowance?: boolean;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  hasTransportation?: boolean;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  hasEquipment?: boolean;

  @ApiPropertyOptional({
    enum: ReturnOfferProbability,
    default: ReturnOfferProbability.MEDIUM,
  })
  @IsOptional()
  @IsEnum(ReturnOfferProbability)
  returnOfferProbability?: ReturnOfferProbability;

  @ApiPropertyOptional({ example: ['React', 'TypeScript', 'Node.js'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @ApiPropertyOptional({ example: 'İngilizce (İleri Düzey)' })
  @IsOptional()
  @IsString()
  languageRequirements?: string;

  @ApiPropertyOptional({ example: '2026-09-01T00:00:00.000Z' })
  @IsOptional()
  applicationDeadline?: Date | string;

  @ApiPropertyOptional({ example: '2026-10-01T00:00:00.000Z' })
  @IsOptional()
  expectedStartDate?: Date | string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quota?: number;
}
