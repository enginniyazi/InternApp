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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStudentProfileDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class UpdateStudentProfileDto {
    firstName;
    lastName;
    phone;
    city;
    university;
    department;
    grade;
    gpa;
    educationLevel;
    internshipStatus;
    skills;
    linkedinUrl;
    githubUrl;
    bio;
    cvUrl;
}
exports.UpdateStudentProfileDto = UpdateStudentProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ad', example: 'Ahmet' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Soyad', example: 'Yılmaz' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Telefon Numarası',
        example: '+905551234567',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Şehir', example: 'İstanbul' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Üniversite', example: 'İTÜ' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "university", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bölüm',
        example: 'Bilgisayar Mühendisliği',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sınıf', example: '3. Sınıf' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'GANO / Not Ortalaması', example: 3.45 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateStudentProfileDto.prototype, "gpa", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.EducationLevel, description: 'Eğitim Seviyesi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.EducationLevel),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "educationLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.InternshipType,
        description: 'Aranan Staj Tipi',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.InternshipType),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "internshipStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Yetenekler',
        example: ['React', 'Python'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateStudentProfileDto.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'LinkedIn URL',
        example: 'https://linkedin.com/in/ahmet',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "linkedinUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'GitHub URL',
        example: 'https://github.com/ahmet',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "githubUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Biyografi / Hakkında',
        example: 'Yazılım mühendisliği 3. sınıf öğrencisiyim.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'CV Dosya Bağlantısı (URL)',
        example: 'https://storage.com/cv.pdf',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "cvUrl", void 0);
//# sourceMappingURL=update-student-profile.dto.js.map