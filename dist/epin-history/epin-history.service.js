"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpinHistoryService = void 0;
const common_1 = require("@nestjs/common");
const epin_entity_1 = require("../database/entity/epin.entity");
const epinHistory_entity_1 = require("../database/entity/epinHistory.entity");
const user_entity_1 = require("../database/entity/user.entity");
let EpinHistoryService = (() => {
    let EpinHistoryService = class EpinHistoryService {
        createHistory(owner, epin, remark) {
            return epinHistory_entity_1.EpinHistory.create({ owner, epin, remark });
        }
        async getAll(userId) {
            return (await epinHistory_entity_1.EpinHistory.getByUserId(userId)).map(h => h.responseObject);
        }
        async getAdminHistory() {
            return (await epinHistory_entity_1.EpinHistory.getAdminHistory()).map(h => h.responseObject);
        }
    };
    EpinHistoryService = __decorate([
        common_1.Injectable()
    ], EpinHistoryService);
    return EpinHistoryService;
})();
exports.EpinHistoryService = EpinHistoryService;
//# sourceMappingURL=epin-history.service.js.map