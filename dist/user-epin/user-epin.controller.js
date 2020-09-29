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
exports.UserEpinController = void 0;
const common_1 = require("@nestjs/common");
const common_header_decorator_1 = require("../common/decorators/common-header-decorator");
const roles_decorator_1 = require("../common/decorators/roles-decorator");
const base_header_dto_1 = require("../common/dto/base-header.dto");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const validation_pipe_1 = require("../common/validation.pipe");
const user_epin_dto_1 = require("./user-epin.dto");
const user_epin_service_1 = require("./user-epin.service");
let UserEpinController = (() => {
    let UserEpinController = class UserEpinController {
        constructor(userEpinService) {
            this.userEpinService = userEpinService;
        }
        getAvailable(headers, status) {
            return this.userEpinService.getById(headers.userId, status);
        }
        sendTo(headers, data) {
            return this.userEpinService.sendToAnother(headers.userId, data);
        }
        activateAccount(headers, userId) {
            return this.userEpinService.activateAccount(headers.userId, userId);
        }
        sendByAdmin(data) {
            return this.userEpinService.sendFromAdmin(data);
        }
    };
    __decorate([
        common_1.Get(),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_header_decorator_1.CustomHeader()), __param(1, common_1.Query('status')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [base_header_dto_1.HeaderDTO, String]),
        __metadata("design:returntype", void 0)
    ], UserEpinController.prototype, "getAvailable", null);
    __decorate([
        common_1.Put('send'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_header_decorator_1.CustomHeader()), __param(1, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [base_header_dto_1.HeaderDTO, user_epin_dto_1.SendEPinDTO]),
        __metadata("design:returntype", void 0)
    ], UserEpinController.prototype, "sendTo", null);
    __decorate([
        common_1.Put('use/:id'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_header_decorator_1.CustomHeader()), __param(1, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [base_header_dto_1.HeaderDTO, String]),
        __metadata("design:returntype", void 0)
    ], UserEpinController.prototype, "activateAccount", null);
    __decorate([
        common_1.Post('send'),
        roles_decorator_1.hasRoles('admin'),
        common_1.UseGuards(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.UsePipes(new validation_pipe_1.ValidationPipe()),
        __param(0, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [user_epin_dto_1.SendEPinDTO]),
        __metadata("design:returntype", void 0)
    ], UserEpinController.prototype, "sendByAdmin", null);
    UserEpinController = __decorate([
        common_1.Controller('user-epin'),
        __metadata("design:paramtypes", [user_epin_service_1.UserEpinService])
    ], UserEpinController);
    return UserEpinController;
})();
exports.UserEpinController = UserEpinController;
//# sourceMappingURL=user-epin.controller.js.map