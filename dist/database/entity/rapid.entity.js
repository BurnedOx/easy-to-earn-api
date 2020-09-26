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
exports.Rapid = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
let Rapid = (() => {
    var Rapid_1;
    let Rapid = Rapid_1 = class Rapid extends base_entity_1.Base {
        static findByOwner(ownerId) {
            return this.createQueryBuilder('rapid')
                .leftJoinAndSelect('rapid.owner', 'owner')
                .where("owner.id = :ownerId", { ownerId })
                .orderBy("rapid.createdAt", "DESC")
                .getOne()
                .then(b => b !== null && b !== void 0 ? b : null);
        }
        static findIncomplete() {
            return this.find({ where: { status: 'incomplete' }, relations: ["owner"] });
        }
        static async updateToNext(ids, endDate, trx) {
            let result;
            const options = { amount: 2500, target: 30, endDate };
            if (trx) {
                result = await trx.update(this, { id: typeorm_1.In(ids) }, options);
            }
            else {
                result = await this.update(ids, options);
            }
            if (result.affected && result.affected === 0) {
                throw Error("No changed made to the challenge. Entity might be missing. Check " + ids);
            }
            return this.findByIds(ids, { relations: ['owner'] });
        }
        static async completeChallenges(ids, trx) {
            let result;
            if (trx) {
                result = await trx.update(Rapid_1, { id: typeorm_1.In(ids) }, { status: 'complete' });
            }
            else {
                result = await this.update(ids, { status: 'complete' });
            }
            if (result.affected && result.affected === 0) {
                throw Error("No changed made to the challenge. Entity might be missing. Check " + ids);
            }
            return this.findByIds(ids, { relations: ['owner'] });
        }
    };
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Date)
    ], Rapid.prototype, "startDate", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Date)
    ], Rapid.prototype, "endDate", void 0);
    __decorate([
        typeorm_1.Column({ default: 1000 }),
        __metadata("design:type", Number)
    ], Rapid.prototype, "amount", void 0);
    __decorate([
        typeorm_1.Column({ default: 10 }),
        __metadata("design:type", Number)
    ], Rapid.prototype, "target", void 0);
    __decorate([
        typeorm_1.Column({ default: 'incomplete' }),
        __metadata("design:type", String)
    ], Rapid.prototype, "status", void 0);
    __decorate([
        typeorm_1.ManyToOne(() => user_entity_1.User, user => user.challenges, { onDelete: 'CASCADE' }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", user_entity_1.User)
    ], Rapid.prototype, "owner", void 0);
    Rapid = Rapid_1 = __decorate([
        typeorm_1.Entity()
    ], Rapid);
    return Rapid;
})();
exports.Rapid = Rapid;
//# sourceMappingURL=rapid.entity.js.map