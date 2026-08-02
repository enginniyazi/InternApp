import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InternshipsService } from './internships.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';
import { FilterInternshipsDto } from './dto/filter-internships.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('İlanlar (Internships)')
@Controller('internships')
export class InternshipsController {
  constructor(private readonly internshipsService: InternshipsService) {}

  @ApiOperation({ summary: 'Yeni Staj İlanı Oluştur (Sadece Şirketler)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() createInternshipDto: CreateInternshipDto,
  ) {
    return this.internshipsService.create(userId, createInternshipDto);
  }

  @ApiOperation({ summary: 'Tüm Staj İlanlarını Listele ve Filtrele' })
  @Get()
  findAll(@Query() filterDto: FilterInternshipsDto) {
    return this.internshipsService.findAll(filterDto);
  }

  @ApiOperation({ summary: 'Giriş Yapan Şirketin İlanlarını Listele' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @Get('my')
  findMyInternships(@CurrentUser('id') userId: string) {
    return this.internshipsService.findByCompany(userId);
  }

  @ApiOperation({ summary: 'Tekil Staj İlanı Detayı Getir' })
  @ApiResponse({ status: 404, description: 'İlan bulunamadı.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.internshipsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Staj İlanını Güncelle (Sadece İlan Sahibi Şirket)',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateInternshipDto: UpdateInternshipDto,
  ) {
    return this.internshipsService.update(userId, id, updateInternshipDto);
  }

  @ApiOperation({ summary: 'Staj İlanını Sil (Sadece İlan Sahibi Şirket)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @Delete(':id')
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.internshipsService.remove(userId, id);
  }
}
