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
exports.RapidController = void 0;
const common_1 = require("@nestjs/common");
const common_header_decorator_1 = require("../common/decorators/common-header-decorator");
const base_header_dto_1 = require("../common/dto/base-header.dto");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const validation_pipe_1 = require("../common/validation.pipe");
const rapid_service_1 = require("./rapid.service");
let RapidController = (() => {
    let RapidController = class RapidController {
        constructor(rapidService) {
            this.rapidService = rapidService;
        }
        getByUserId(headers) {
            return this.rapidService.findByUser(headers.userId);
        }
    };
    __decorate([
        common_1.Get(),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_header_decorator_1.CustomHeader()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [base_header_dto_1.HeaderDTO]),
        __metadata("design:returntype", void 0)
    ], RapidController.prototype, "getByUserId", null);
    RapidController = __decorate([
        common_1.Controller('rapid'),
        __metadata("design:paramtypes", [rapid_service_1.RapidService])
    ], RapidController);
    return RapidController;
})();
exports.RapidController = RapidController;
//# sourceMappingURL=rapid.controller.js.map