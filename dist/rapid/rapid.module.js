"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RapidModule = void 0;
const common_1 = require("@nestjs/common");
const rapid_controller_1 = require("./rapid.controller");
const rapid_service_1 = require("./rapid.service");
let RapidModule = (() => {
    let RapidModule = class RapidModule {
    };
    RapidModule = __decorate([
        common_1.Module({
            controllers: [rapid_controller_1.RapidController],
            providers: [rapid_service_1.RapidService],
            exports: [rapid_service_1.RapidService]
        })
    ], RapidModule);
    return RapidModule;
})();
exports.RapidModule = RapidModule;
//# sourceMappingURL=rapid.module.js.map