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
exports.CreateInternshipDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateInternshipDto {
    title;
    description;
    location;
    isRemote;
    requirements;
    internshipType;
    targetEducationLevel;
    targetDepartments;
    targetGrades;
    weeklyDays;
    durationWeeks;
    workModel;
    city;
    district;
    stipendType;
    hasMealAllowance;
    hasTransportation;
    hasEquipment;
    returnOfferProbability;
    requiredSkills;
    languageRequirements;
    applicationDeadline;
    expectedStartDate;
    quota;
}
exports.CreateInternshipDto = CreateInternshipDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'İlan Başlığı',
        example: 'Frontend Developer Stajyeri',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'İlan başlığı zorunludur.' }),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'İlan Açıklaması',
        example: 'React ve TypeScript deneyimi olan stajyer aranıyor.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'İlan açıklaması zorunludur.' }),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lokasyon / Şehir',
        example: 'İstanbul / Maslak',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Lokasyon alanı zorunludur.' }),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Uzaktan (Remote) Çalışma Durumu',
        example: true,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInternshipDto.prototype, "isRemote", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Gereksinimler Listesi',
        example: ['React', 'TypeScript', 'Git'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateInternshipDto.prototype, "requirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.InternshipType,
        default: client_1.InternshipType.MANDATORY,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.InternshipType),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "internshipType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.EducationLevel,
        default: client_1.EducationLevel.BACHELOR,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.EducationLevel),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "targetEducationLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['Bilgisayar Mühendisliği', 'Yazılım Mühendisliği'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateInternshipDto.prototype, "targetDepartments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: [3, 4] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], CreateInternshipDto.prototype, "targetGrades", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5, default: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateInternshipDto.prototype, "weeklyDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12, default: 12 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateInternshipDto.prototype, "durationWeeks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.WorkModel, default: client_1.WorkModel.HYBRID }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.WorkModel),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "workModel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'İstanbul' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Maslak' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.StipendType, default: client_1.StipendType.MINIMUM_WAGE }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StipendType),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "stipendType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInternshipDto.prototype, "hasMealAllowance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInternshipDto.prototype, "hasTransportation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInternshipDto.prototype, "hasEquipment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.ReturnOfferProbability,
        default: client_1.ReturnOfferProbability.MEDIUM,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ReturnOfferProbability),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "returnOfferProbability", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['React', 'TypeScript', 'Node.js'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateInternshipDto.prototype, "requiredSkills", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'İngilizce (İleri Düzey)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "languageRequirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-09-01T00:00:00.000Z' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateInternshipDto.prototype, "applicationDeadline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-10-01T00:00:00.000Z' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateInternshipDto.prototype, "expectedStartDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateInternshipDto.prototype, "quota", void 0);
//# sourceMappingURL=create-internship.dto.js.map