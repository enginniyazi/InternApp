import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCompanyProfileDto {
  @ApiPropertyOptional({ description: 'Şirket Adı', example: 'Teknoloji A.Ş.' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({
    description: 'Web Sitesi',
    example: 'https://example.com',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Geçerli bir web sitesi adresi giriniz.' })
  website?: string;

  @ApiPropertyOptional({
    description: 'Şirket Açıklaması',
    example: 'Yenilikçi yazılım çözümleri.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Logo URL' })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}
