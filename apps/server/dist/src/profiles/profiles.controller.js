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
exports.ProfilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const profiles_service_1 = require("./profiles.service");
const update_student_profile_dto_1 = require("./dto/update-student-profile.dto");
const update_company_profile_dto_1 = require("./dto/update-company-profile.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let ProfilesController = class ProfilesController {
    profilesService;
    constructor(profilesService) {
        this.profilesService = profilesService;
    }
    getStudentProfile(userId) {
        return this.profilesService.getStudentProfile(userId);
    }
    updateStudentProfile(userId, dto) {
        return this.profilesService.updateStudentProfile(userId, dto);
    }
    uploadCv(userId, file) {
        return this.profilesService.uploadCv(userId, file);
    }
    getCompanyProfile(userId) {
        return this.profilesService.getCompanyProfile(userId);
    }
    updateCompanyProfile(userId, dto) {
        return this.profilesService.updateCompanyProfile(userId, dto);
    }
};
exports.ProfilesController = ProfilesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Öğrenci Profilini Getir' }),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    (0, common_1.Get)('student'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "getStudentProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Öğrenci Profilini Güncelle' }),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    (0, common_1.Patch)('student'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_student_profile_dto_1.UpdateStudentProfileDto]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "updateStudentProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Öğrenci PDF CV Yükle (Max 5MB)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    (0, common_1.Post)('student/cv'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "uploadCv", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Şirket Profilini Getir' }),
    (0, roles_decorator_1.Roles)(client_1.Role.COMPANY),
    (0, common_1.Get)('company'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "getCompanyProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Şirket Profilini Güncelle' }),
    (0, roles_decorator_1.Roles)(client_1.Role.COMPANY),
    (0, common_1.Patch)('company'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_company_profile_dto_1.UpdateCompanyProfileDto]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "updateCompanyProfile", null);
exports.ProfilesController = ProfilesController = __decorate([
    (0, swagger_1.ApiTags)('Profiller (Student & Company)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('profiles'),
    __metadata("design:paramtypes", [profiles_service_1.ProfilesService])
], ProfilesController);
//# sourceMappingURL=profiles.controller.js.map