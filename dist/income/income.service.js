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
exports.IncomeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const income_entity_1 = require("../database/entity/income.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../database/entity/user.entity");
const costraints_1 = require("../common/costraints");
const transaction_entity_1 = require("../database/entity/transaction.entity");
let IncomeService = (() => {
    let IncomeService = class IncomeService {
        constructor(incomeRepo, userRepo, trxRepo) {
            this.incomeRepo = incomeRepo;
            this.userRepo = userRepo;
            this.trxRepo = trxRepo;
        }
        async getIncomes(userId) {
            const user = await this.userRepo.findOne(userId);
            if (!user) {
                throw new common_1.HttpException('user not found', common_1.HttpStatus.NOT_FOUND);
            }
            const incomes = await this.incomeRepo.find({ where: { owner: user }, relations: ['owner', 'from'] });
            return incomes.map(i => i.toResponseObject());
        }
        async removePayments(incomes, trx) {
            const incomesWithOwner = await this.incomeRepo.findByIds(incomes.map(i => i.id), { relations: ['owner'] });
            for (let i of incomesWithOwner) {
                const owner = await this.userRepo.findOne(i.owner.id);
                owner.balance = owner.balance - i.amount;
                await trx.save(owner);
            }
            for (let i of incomesWithOwner) {
                await trx.remove(i);
            }
        }
        async generateIncomes(from, trx) {
            if (from.status === 'inactive')
                return;
            let level = 1;
            let sponsor = await this.userRepo.findOne(from.sponsoredBy.id, { relations: ['sponsoredBy', 'ranks', 'sponsored'] });
            while (level <= 10 && sponsor.role === 'user') {
                let amount;
                if (!sponsor.isAutopooled && level === 1) {
                    amount = costraints_1.levelIncomeAmount[level] - 100;
                }
                else {
                    amount = costraints_1.levelIncomeAmount[level];
                }
                sponsor.balance = sponsor.balance + amount;
                await trx.save(sponsor);
                const income = this.incomeRepo.create({
                    owner: sponsor,
                    currentBalance: sponsor.balance,
                    level, from, amount
                });
                await trx.save(income);
                const transaction = this.trxRepo.create({
                    currentBalance: sponsor.balance,
                    type: 'credit',
                    remarks: `From level ${level} income`,
                    owner: sponsor, amount
                });
                await trx.save(transaction);
                await this.generateLeadershipBonus(sponsor, level, trx);
                sponsor = await this.userRepo.findOne(sponsor.sponsoredBy.id, { relations: ['sponsoredBy', 'ranks', 'sponsored'] });
                level++;
            }
        }
        async generateLeadershipBonus(leader, level, trx) {
            var _a;
            const rankNames = leader.ranks.map(r => r.rank);
            if (!rankNames.includes('RANK7')) {
                return;
            }
            leader.balance = leader.balance + 5;
            await trx.save(leader);
            const transaction = this.trxRepo.create({
                amount: 5,
                currentBalance: leader.balance,
                type: 'credit',
                remarks: `${(_a = leader.ranks[leader.ranks.length - 1]) === null || _a === void 0 ? void 0 : _a.rank} Leadership Bonus from level ${level}`,
                owner: leader
            });
            await trx.save(transaction);
        }
    };
    IncomeService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(income_entity_1.Income)),
        __param(1, typeorm_1.InjectRepository(user_entity_1.User)),
        __param(2, typeorm_1.InjectRepository(transaction_entity_1.Transaction)),
        __metadata("design:paramtypes", [typeorm_2.Repository,
            typeorm_2.Repository,
            typeorm_2.Repository])
    ], IncomeService);
    return IncomeService;
})();
exports.IncomeService = IncomeService;
//# sourceMappingURL=income.service.js.map