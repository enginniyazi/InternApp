"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInternshipDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_internship_dto_1 = require("./create-internship.dto");
class UpdateInternshipDto extends (0, swagger_1.PartialType)(create_internship_dto_1.CreateInternshipDto) {
}
exports.UpdateInternshipDto = UpdateInternshipDto;
//# sourceMappingURL=update-internship.dto.js.map