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
exports.UserEpin = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const epin_entity_1 = require("./epin.entity");
const user_entity_1 = require("./user.entity");
let UserEpin = (() => {
    let UserEpin = class UserEpin extends base_entity_1.Base {
        static getByUserId(userId, status = 'unused') {
            return this.createQueryBuilder('userEpin')
                .leftJoinAndSelect('userEpin.epin', 'epin')
                .leftJoinAndSelect('userEpin.owner', 'owner')
                .where('owner.id = :userId', { userId })
                .andWhere('userEpin.status = :status', { status })
                .getManyAndCount();
        }
        get responseObject() {
            const { id, updatedAt, createdAt, epin, status } = this;
            return { id, ePinId: epin.id, status, createdAt, updatedAt };
        }
    };
    __decorate([
        typeorm_1.ManyToOne(() => user_entity_1.User, user => user.parchasedEpins, { onDelete: 'CASCADE' }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", user_entity_1.User)
    ], UserEpin.prototype, "owner", void 0);
    __decorate([
        typeorm_1.OneToOne(() => epin_entity_1.EPin, epin => epin.purchasedby),
        typeorm_1.JoinColumn(),
        __metadata("design:type", epin_entity_1.EPin)
    ], UserEpin.prototype, "epin", void 0);
    __decorate([
        typeorm_1.Column('text', { default: 'unused' }),
        __metadata("design:type", String)
    ], UserEpin.prototype, "status", void 0);
    UserEpin = __decorate([
        typeorm_1.Entity()
    ], UserEpin);
    return UserEpin;
})();
exports.UserEpin = UserEpin;
//# sourceMappingURL=userEpin.entity.js.map