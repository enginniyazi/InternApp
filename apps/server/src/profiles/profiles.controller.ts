import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Profiller (Student & Company)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({ summary: 'Öğrenci Profilini Getir' })
  @Roles(Role.STUDENT)
  @Get('student')
  getStudentProfile(@CurrentUser('id') userId: string) {
    return this.profilesService.getStudentProfile(userId);
  }

  @ApiOperation({ summary: 'Öğrenci Profilini Güncelle' })
  @Roles(Role.STUDENT)
  @Patch('student')
  updateStudentProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateStudentProfileDto,
  ) {
    return this.profilesService.updateStudentProfile(userId, dto);
  }

  @ApiOperation({ summary: 'Öğrenci PDF CV Yükle (Max 5MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'PDF formatında CV dosyası',
        },
      },
    },
  })
  @Roles(Role.STUDENT)
  @Post('student/cv')
  @UseInterceptors(FileInterceptor('file'))
  uploadCv(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profilesService.uploadCv(userId, file);
  }

  @ApiOperation({ summary: 'Şirket Profilini Getir' })
  @Roles(Role.COMPANY)
  @Get('company')
  getCompanyProfile(@CurrentUser('id') userId: string) {
    return this.profilesService.getCompanyProfile(userId);
  }

  @ApiOperation({ summary: 'Şirket Profilini Güncelle' })
  @Roles(Role.COMPANY)
  @Patch('company')
  updateCompanyProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCompanyProfileDto,
  ) {
    return this.profilesService.updateCompanyProfile(userId, dto);
  }
}
