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
class CreateInternshipDto {
    title;
    description;
    location;
    isRemote;
    requirements;
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
    (0, swagger_1.ApiProperty)({ description: 'Lokasyon / Şehir', example: 'İstanbul' }),
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
//# sourceMappingURL=create-internship.dto.js.map