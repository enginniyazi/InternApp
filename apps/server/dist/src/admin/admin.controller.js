"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    getStats() {
        return this.adminService.getStats();
    }
    getCompanies() {
        return this.adminService.getCompanies();
    }
    approveCompany(id) {
        return this.adminService.approveCompany(id);
    }
    getAllUsers() {
        return this.adminService.getAllUsers();
    }
    deleteUser(id) {
        return this.adminService.deleteUser(id);
    }
    getAllInternships() {
        return this.adminService.getAllInternships();
    }
    deleteInternship(id) {
        return this.adminService.deleteInternship(id);
    }
    toggleInternshipStatus(id) {
        return this.adminService.toggleInternshipStatus(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Sistem İstatistiklerini Getir' }),
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Tüm Şirket Profilini Listele' }),
    (0, common_1.Get)('companies'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getCompanies", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Şirketi Onayla / Manuel Doğrula' }),
    (0, common_1.Patch)('companies/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "approveCompany", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Sistemdeki Tüm Kullanıcıları Listele' }),
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcıyı Hesabıyla Birlikte Sil' }),
    (0, common_1.Delete)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Moderasyon için Tüm İlanları Listele' }),
    (0, common_1.Get)('internships'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllInternships", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Usulsüz İlanı Platformdan Sil' }),
    (0, common_1.Delete)('internships/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteInternship", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'İlanı Onayla / Yayına Al veya Pasife Al' }),
    (0, common_1.Patch)('internships/:id/toggle-status'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "toggleInternshipStatus", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin Paneli (Admin)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map