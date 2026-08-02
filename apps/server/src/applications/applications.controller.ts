import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Başvurular (Applications)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @ApiOperation({ summary: 'Staj İlanına Başvur (Sadece Öğrenciler)' })
  @Roles(Role.STUDENT)
  @Post()
  apply(@CurrentUser('id') userId: string, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.applyToInternship(userId, dto);
  }

  @ApiOperation({ summary: 'Öğrencinin Kendi Başvurularını Listele' })
  @Roles(Role.STUDENT)
  @Get('student')
  getStudentApplications(@CurrentUser('id') userId: string) {
    return this.applicationsService.getStudentApplications(userId);
  }

  @ApiOperation({ summary: 'Şirkete Yapılan Başvuruları Listele' })
  @ApiQuery({
    name: 'internshipId',
    required: false,
    description: 'Belirli bir ilan bazında filtrele',
  })
  @Roles(Role.COMPANY)
  @Get('company')
  getCompanyApplications(
    @CurrentUser('id') userId: string,
    @Query('internshipId') internshipId?: string,
  ) {
    return this.applicationsService.getCompanyApplications(
      userId,
      internshipId,
    );
  }

  @ApiOperation({
    summary: 'Başvuru Durumunu Güncelle (Kabul / Red / İnceleme)',
  })
  @Roles(Role.COMPANY)
  @Patch(':id/status')
  updateStatus(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateApplicationStatus(userId, id, dto);
  }
}
