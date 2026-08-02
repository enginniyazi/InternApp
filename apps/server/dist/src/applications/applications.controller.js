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
exports.ApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const applications_service_1 = require("./applications.service");
const create_application_dto_1 = require("./dto/create-application.dto");
const update_application_status_dto_1 = require("./dto/update-application-status.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let ApplicationsController = class ApplicationsController {
    applicationsService;
    constructor(applicationsService) {
        this.applicationsService = applicationsService;
    }
    apply(userId, dto) {
        return this.applicationsService.applyToInternship(userId, dto);
    }
    getStudentApplications(userId) {
        return this.applicationsService.getStudentApplications(userId);
    }
    getCompanyApplications(userId, internshipId) {
        return this.applicationsService.getCompanyApplications(userId, internshipId);
    }
    updateStatus(userId, id, dto) {
        return this.applicationsService.updateApplicationStatus(userId, id, dto);
    }
};
exports.ApplicationsController = ApplicationsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Staj İlanına Başvur (Sadece Öğrenciler)' }),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_application_dto_1.CreateApplicationDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "apply", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Öğrencinin Kendi Başvurularını Listele' }),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    (0, common_1.Get)('student'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "getStudentApplications", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Şirkete Yapılan Başvuruları Listele' }),
    (0, swagger_1.ApiQuery)({
        name: 'internshipId',
        required: false,
        description: 'Belirli bir ilan bazında filtrele',
    }),
    (0, roles_decorator_1.Roles)(client_1.Role.COMPANY),
    (0, common_1.Get)('company'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('internshipId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "getCompanyApplications", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Başvuru Durumunu Güncelle (Kabul / Red / İnceleme)',
    }),
    (0, roles_decorator_1.Roles)(client_1.Role.COMPANY),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_application_status_dto_1.UpdateApplicationStatusDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "updateStatus", null);
exports.ApplicationsController = ApplicationsController = __decorate([
    (0, swagger_1.ApiTags)('Başvurular (Applications)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('applications'),
    __metadata("design:paramtypes", [applications_service_1.ApplicationsService])
], ApplicationsController);
//# sourceMappingURL=applications.controller.js.map