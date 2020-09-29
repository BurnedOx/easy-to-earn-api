"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpinHistoryModule = void 0;
const common_1 = require("@nestjs/common");
const epin_history_controller_1 = require("./epin-history.controller");
const epin_history_service_1 = require("./epin-history.service");
let EpinHistoryModule = (() => {
    let EpinHistoryModule = class EpinHistoryModule {
    };
    EpinHistoryModule = __decorate([
        common_1.Module({
            controllers: [epin_history_controller_1.EpinHistoryController],
            providers: [epin_history_service_1.EpinHistoryService],
            exports: [epin_history_service_1.EpinHistoryService]
        })
    ], EpinHistoryModule);
    return EpinHistoryModule;
})();
exports.EpinHistoryModule = EpinHistoryModule;
//# sourceMappingURL=epin-history.module.js.map