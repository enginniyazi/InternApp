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
exports.FilterInternshipsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class FilterInternshipsDto {
    search;
    location;
    city;
    isRemote;
    internshipType;
    targetEducationLevel;
    workModel;
}
exports.FilterInternshipsDto = FilterInternshipsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Arama terimi (başlık veya açıklama)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterInternshipsDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Lokasyon / Şehir filtresi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterInternshipsDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Şehir' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterInternshipsDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Remote çalışma filtresi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FilterInternshipsDto.prototype, "isRemote", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.InternshipType, description: 'Staj Tipi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.InternshipType),
    __metadata("design:type", String)
], FilterInternshipsDto.prototype, "internshipType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.EducationLevel, description: 'Eğitim Seviyesi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.EducationLevel),
    __metadata("design:type", String)
], FilterInternshipsDto.prototype, "targetEducationLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.WorkModel, description: 'Çalışma Modeli' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.WorkModel),
    __metadata("design:type", String)
], FilterInternshipsDto.prototype, "workModel", void 0);
//# sourceMappingURL=filter-internships.dto.js.map