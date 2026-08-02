import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin Paneli (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Sistem İstatistiklerini Getir' })
  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @ApiOperation({ summary: 'Tüm Şirket Profilini Listele' })
  @Get('companies')
  getCompanies() {
    return this.adminService.getCompanies();
  }

  @ApiOperation({ summary: 'Şirketi Onayla / Manuel Doğrula' })
  @Patch('companies/:id/approve')
  approveCompany(@Param('id') id: string) {
    return this.adminService.approveCompany(id);
  }
}
