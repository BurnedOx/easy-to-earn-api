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
exports.RapidService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const moment = require("moment");
const rapid_entity_1 = require("../database/entity/rapid.entity");
const transaction_entity_1 = require("../database/entity/transaction.entity");
const user_entity_1 = require("../database/entity/user.entity");
const typeorm_1 = require("typeorm");
let RapidService = (() => {
    let RapidService = class RapidService {
        findByUser(userId) {
            return rapid_entity_1.Rapid.findByOwner(userId);
        }
        async newChallenge(owner, trx) {
            const startDate = new Date();
            const endDate = new Date(moment().add(7, 'days').set('hours', 23).set('minutes', 59).set('seconds', 0).format());
            const challenge = rapid_entity_1.Rapid.create({ startDate, endDate, owner });
            if (trx) {
                return trx.save(challenge);
            }
            return challenge.save();
        }
        checkForCompletion() {
            return typeorm_1.getManager().transaction(async (trx) => {
                const incomplete = await rapid_entity_1.Rapid.findIncomplete();
                const [completed, incomplete7days, incomplete30days] = await this.getCompleted(incomplete);
                await this.handleCompletion(completed, trx);
                await this.handleConvertTo30(incomplete7days);
                await this.handleStartNew(incomplete30days, trx);
            });
        }
        async getCompleted(rapids) {
            const completed = [];
            const incomplete7days = [];
            const incomplete30days = [];
            for (let rapid of rapids) {
                const [directs, count] = await user_entity_1.User.findDirectForRapid(rapid.owner.id, rapid.startDate, rapid.endDate);
                if (rapid.target <= count) {
                    completed.push(rapid);
                }
                else if (rapid.days === 7) {
                    incomplete7days.push(rapid);
                }
                else if (rapid.days === 28) {
                    incomplete30days.push(rapid);
                }
            }
            return [completed, incomplete7days, incomplete30days];
        }
        async handleCompletion(rapids, trx) {
            const toComplete = await rapid_entity_1.Rapid.completeChallenges(rapids.map(r => r.id));
            for (let rapid of toComplete) {
                const owner = await user_entity_1.User.creditBalance(rapid.owner.id, rapid.amount);
                const transaction = transaction_entity_1.Transaction.create({
                    owner,
                    amount: rapid.amount,
                    currentBalance: owner.balance,
                    type: 'credit',
                    remarks: 'Rapid Challenge Bonus'
                });
                await trx.save(transaction);
                await this.newChallenge(owner, trx);
            }
        }
        async handleConvertTo30(rapids) {
            const endDate = new Date(moment().add(21, 'days').set('hours', 23).set('minutes', 59).set('seconds', 0).format());
            await rapid_entity_1.Rapid.updateToNext(rapids.map(r => r.id), endDate);
        }
        handleStartNew(rapids, trx) {
            return Promise.all(rapids.map(r => this.newChallenge(r.owner, trx)));
        }
    };
    __decorate([
        schedule_1.Cron('0 0 * * *'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], RapidService.prototype, "checkForCompletion", null);
    RapidService = __decorate([
        common_1.Injectable()
    ], RapidService);
    return RapidService;
})();
exports.RapidService = RapidService;
//# sourceMappingURL=rapid.service.js.map