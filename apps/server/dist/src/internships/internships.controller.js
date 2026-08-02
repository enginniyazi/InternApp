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
exports.InternshipsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const internships_service_1 = require("./internships.service");
const create_internship_dto_1 = require("./dto/create-internship.dto");
const update_internship_dto_1 = require("./dto/update-internship.dto");
const filter_internships_dto_1 = require("./dto/filter-internships.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let InternshipsController = class InternshipsController {
    internshipsService;
    constructor(internshipsService) {
        this.internshipsService = internshipsService;
    }
    create(userId, createInternshipDto) {
        return this.internshipsService.create(userId, createInternshipDto);
    }
    findAll(filterDto) {
        return this.internshipsService.findAll(filterDto);
    }
    findMyInternships(userId) {
        return this.internshipsService.findByCompany(userId);
    }
    findOne(id) {
        return this.internshipsService.findOne(id);
    }
    update(userId, id, updateInternshipDto) {
        return this.internshipsService.update(userId, id, updateInternshipDto);
    }
    remove(userId, id) {
        return this.internshipsService.remove(userId, id);
    }
};
exports.InternshipsController = InternshipsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Yeni Staj İlanı Oluştur (Sadece Şirketler)' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.COMPANY),
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_internship_dto_1.CreateInternshipDto]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Tüm Staj İlanlarını Listele ve Filtrele' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_internships_dto_1.FilterInternshipsDto]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Giriş Yapan Şirketin İlanlarını Listele' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.COMPANY),
    (0, common_1.Get)('my'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "findMyInternships", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Tekil Staj İlanı Detayı Getir' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'İlan bulunamadı.' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Staj İlanını Güncelle (Sadece İlan Sahibi Şirket)',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.COMPANY),
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_internship_dto_1.UpdateInternshipDto]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Staj İlanını Sil (Sadece İlan Sahibi Şirket)' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.COMPANY),
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InternshipsController.prototype, "remove", null);
exports.InternshipsController = InternshipsController = __decorate([
    (0, swagger_1.ApiTags)('İlanlar (Internships)'),
    (0, common_1.Controller)('internships'),
    __metadata("design:paramtypes", [internships_service_1.InternshipsService])
], InternshipsController);
//# sourceMappingURL=internships.controller.js.map