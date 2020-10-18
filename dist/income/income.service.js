"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeService = void 0;
const common_1 = require("@nestjs/common");
const income_entity_1 = require("../database/entity/income.entity");
const user_entity_1 = require("../database/entity/user.entity");
const costraints_1 = require("../common/costraints");
const transaction_entity_1 = require("../database/entity/transaction.entity");
let IncomeService = (() => {
    let IncomeService = class IncomeService {
        async getIncomes(userId) {
            const user = await user_entity_1.User.findOne(userId);
            if (!user) {
                throw new common_1.HttpException('user not found', common_1.HttpStatus.NOT_FOUND);
            }
            const incomes = await income_entity_1.Income.find({ where: { owner: user }, relations: ['owner', 'from'] });
            return incomes.map(i => i.toResponseObject());
        }
        async removePayments(incomes, trx) {
            const incomesWithOwner = await income_entity_1.Income.findByIds(incomes.map(i => i.id), { relations: ['owner'] });
            for (let i of incomesWithOwner) {
                const owner = await user_entity_1.User.findOne(i.owner.id);
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
            let sponsor = await trx.findOne(user_entity_1.User, from.sponsoredBy.id, { relations: ['sponsoredBy', 'ranks'] });
            while (level <= 10 && sponsor.role === 'user') {
                const amount = costraints_1.levelIncomeAmount[level];
                sponsor.balance = sponsor.balance + amount;
                await trx.save(sponsor);
                const income = income_entity_1.Income.create({
                    owner: sponsor,
                    currentBalance: sponsor.balance,
                    level, from, amount
                });
                await trx.save(income);
                const transaction = transaction_entity_1.Transaction.create({
                    currentBalance: sponsor.balance,
                    type: 'credit',
                    remarks: `From level ${level} income`,
                    owner: sponsor, amount
                });
                await trx.save(transaction);
                sponsor = await trx.findOne(user_entity_1.User, sponsor.sponsoredBy.id, { relations: ['sponsoredBy', 'ranks'] });
                level++;
            }
        }
    };
    IncomeService = __decorate([
        common_1.Injectable()
    ], IncomeService);
    return IncomeService;
})();
exports.IncomeService = IncomeService;
//# sourceMappingURL=income.service.js.map