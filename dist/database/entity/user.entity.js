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
exports.User = void 0;
const base_entity_1 = require("./base.entity");
const typeorm_1 = require("typeorm");
const bcrypct = require("bcryptjs");
const epin_entity_1 = require("./epin.entity");
const income_entity_1 = require("./income.entity");
const rank_entity_1 = require("./rank.entity");
const withdrawal_entity_1 = require("./withdrawal.entity");
const transaction_entity_1 = require("./transaction.entity");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const rapid_entity_1 = require("./rapid.entity");
const userEpin_entity_1 = require("./userEpin.entity");
const epinHistory_entity_1 = require("./epinHistory.entity");
let User = (() => {
    var User_1;
    let User = User_1 = class User extends base_entity_1.Base {
        async hashPassword() {
            this.password = await bcrypct.hash(this.password, 10);
        }
        static findById(id) {
            return rxjs_1.from(this.findOne({ id })).pipe(operators_1.map((user) => user));
        }
        static findDirectForRapid(sponsorId, startDate, endDate) {
            return this.createQueryBuilder('user')
                .leftJoinAndSelect('user.sponsoredBy', 'sponsoredBy')
                .where("sponsoredBy.id = :sponsorId", { sponsorId })
                .andWhere("user.activatedAt BETWEEN :startDate AND :endDate", { startDate, endDate })
                .getManyAndCount();
        }
        static async getDownline(root, downline = [], level = 1) {
            const members = await this.find({
                where: { sponsoredBy: root },
                order: { createdAt: 'DESC' }
            });
            for (let member of members) {
                downline.push({ member, level });
                await this.getDownline(member, downline, level + 1);
            }
            return downline;
        }
        static getAutopool(user) {
            return this.createQueryBuilder('user')
                .where('user.activatedAt IS NOT NULL')
                .andWhere('user.autopooledAt IS NOT NULL')
                .andWhere("user.autopooledAt > :aDate", { aDate: user.autopooledAt })
                .getMany();
        }
        static async creditBalance(id, amount, trx) {
            const user = await trx.findOne(this, id);
            const options = { balance: user.balance + amount };
            const result = await trx.update(this, { id }, options);
            if (result.affected && result.affected === 0) {
                throw Error("No changed made to the user. Entity might be missing. Check " + id);
            }
            return trx.findOne(this, id).then(result => result !== null && result !== void 0 ? result : null);
        }
        static async debitBalance(id, amount) {
            const user = await this.findOne(id);
            const result = await this.update(id, { balance: user.balance - amount });
            if (result.affected && result.affected === 0) {
                throw Error("No changed made to the user. Entity might be missing. Check " + id);
            }
            return this.findOne(id).then(result => result !== null && result !== void 0 ? result : null);
        }
        toResponseObject(token) {
            var _a, _b;
            const { id, name, mobile, balance: wallet, panNumber, bankDetails, role: roll, status, sponsoredBy, activatedAt, updatedAt, createdAt } = this;
            const data = {
                id, name, mobile, wallet, panNumber, roll, status, bankDetails, activatedAt, updatedAt, createdAt,
                sponsoredBy: sponsoredBy ? { id: sponsoredBy.id, name: sponsoredBy.name } : null,
                epinId: (_b = (_a = this.epin) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
            };
            if (token) {
                data.token = token;
            }
            return data;
        }
        toMemberObject(level) {
            const { id, name, status, activatedAt, createdAt } = this;
            return { id, name, level, status, createdAt, activatedAt };
        }
        toAutopoolMemberObject() {
            const { id, name, autopooledAt } = this;
            return { id, name, autopooledAt };
        }
        async comparePassword(attempt) {
            return await bcrypct.compare(attempt, this.password);
        }
    };
    __decorate([
        typeorm_1.Column('text'),
        __metadata("design:type", String)
    ], User.prototype, "name", void 0);
    __decorate([
        typeorm_1.Column('numeric'),
        __metadata("design:type", Number)
    ], User.prototype, "mobile", void 0);
    __decorate([
        typeorm_1.Column('text'),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    __decorate([
        typeorm_1.Column({ default: 'user' }),
        __metadata("design:type", String)
    ], User.prototype, "role", void 0);
    __decorate([
        typeorm_1.Column({ default: 'inactive' }),
        __metadata("design:type", String)
    ], User.prototype, "status", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true, default: null }),
        __metadata("design:type", Date)
    ], User.prototype, "activatedAt", void 0);
    __decorate([
        typeorm_1.Column({ default: 0 }),
        __metadata("design:type", Number)
    ], User.prototype, "totalAutopool", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true, default: null }),
        __metadata("design:type", Date)
    ], User.prototype, "autopooledAt", void 0);
    __decorate([
        typeorm_1.Column({ type: 'jsonb', nullable: true, default: null }),
        __metadata("design:type", Object)
    ], User.prototype, "bankDetails", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true, default: null }),
        __metadata("design:type", String)
    ], User.prototype, "panNumber", void 0);
    __decorate([
        typeorm_1.Column({ default: 0 }),
        __metadata("design:type", Number)
    ], User.prototype, "balance", void 0);
    __decorate([
        typeorm_1.OneToMany(type => User_1, user => user.sponsoredBy),
        __metadata("design:type", Array)
    ], User.prototype, "sponsored", void 0);
    __decorate([
        typeorm_1.ManyToOne(type => User_1, user => user.sponsored, { nullable: true, onDelete: 'CASCADE' }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", User)
    ], User.prototype, "sponsoredBy", void 0);
    __decorate([
        typeorm_1.OneToOne(type => epin_entity_1.EPin, epin => epin.owner, { nullable: true }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", epin_entity_1.EPin)
    ], User.prototype, "epin", void 0);
    __decorate([
        typeorm_1.OneToMany(() => income_entity_1.Income, income => income.owner),
        __metadata("design:type", Array)
    ], User.prototype, "incomes", void 0);
    __decorate([
        typeorm_1.OneToMany(() => rapid_entity_1.Rapid, rapid => rapid.owner),
        __metadata("design:type", Array)
    ], User.prototype, "challenges", void 0);
    __decorate([
        typeorm_1.OneToMany(() => income_entity_1.Income, income => income.from),
        __metadata("design:type", Array)
    ], User.prototype, "generatedIncomes", void 0);
    __decorate([
        typeorm_1.OneToMany(() => rank_entity_1.Rank, rank => rank.owner),
        __metadata("design:type", Array)
    ], User.prototype, "ranks", void 0);
    __decorate([
        typeorm_1.OneToMany(() => withdrawal_entity_1.Withdrawal, withdrawal => withdrawal.owner),
        __metadata("design:type", Array)
    ], User.prototype, "withdrawals", void 0);
    __decorate([
        typeorm_1.OneToMany(() => transaction_entity_1.Transaction, trx => trx.owner),
        __metadata("design:type", Array)
    ], User.prototype, "trx", void 0);
    __decorate([
        typeorm_1.OneToMany(() => userEpin_entity_1.UserEpin, userEpin => userEpin.owner),
        __metadata("design:type", Array)
    ], User.prototype, "parchasedEpins", void 0);
    __decorate([
        typeorm_1.OneToMany(() => epinHistory_entity_1.EpinHistory, epinHistory => epinHistory.owner),
        __metadata("design:type", Array)
    ], User.prototype, "epinHistory", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], User.prototype, "hashPassword", null);
    User = User_1 = __decorate([
        typeorm_1.Entity()
    ], User);
    return User;
})();
exports.User = User;
//# sourceMappingURL=user.entity.js.map