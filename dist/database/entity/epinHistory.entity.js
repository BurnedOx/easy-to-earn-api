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
exports.EpinHistory = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const epin_entity_1 = require("./epin.entity");
const user_entity_1 = require("./user.entity");
let EpinHistory = (() => {
    let EpinHistory = class EpinHistory extends base_entity_1.Base {
        static getByUserId(userId) {
            return this.createQueryBuilder('history')
                .leftJoinAndSelect('history.epin', 'epin')
                .leftJoin('history.owner', 'owner')
                .where('owner.id = :ownerId', { ownerId: userId })
                .getMany();
        }
        get responseObject() {
            const { id, createdAt, updatedAt, remark, epin } = this;
            return { id, ePinId: epin.id, remark, createdAt, updatedAt };
        }
    };
    __decorate([
        typeorm_1.ManyToOne(() => user_entity_1.User, user => user.epinHistory, { onDelete: 'CASCADE' }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", user_entity_1.User)
    ], EpinHistory.prototype, "owner", void 0);
    __decorate([
        typeorm_1.ManyToOne(() => epin_entity_1.EPin, epin => epin.history, { onDelete: 'CASCADE' }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", epin_entity_1.EPin)
    ], EpinHistory.prototype, "epin", void 0);
    __decorate([
        typeorm_1.Column('text'),
        __metadata("design:type", String)
    ], EpinHistory.prototype, "remark", void 0);
    EpinHistory = __decorate([
        typeorm_1.Entity()
    ], EpinHistory);
    return EpinHistory;
})();
exports.EpinHistory = EpinHistory;
//# sourceMappingURL=epinHistory.entity.js.map