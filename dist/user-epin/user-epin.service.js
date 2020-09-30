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
exports.UserEpinService = void 0;
const common_1 = require("@nestjs/common");
const accounts_service_1 = require("../accounts/accounts.service");
const epin_entity_1 = require("../database/entity/epin.entity");
const epinHistory_entity_1 = require("../database/entity/epinHistory.entity");
const user_entity_1 = require("../database/entity/user.entity");
const userEpin_entity_1 = require("../database/entity/userEpin.entity");
const epin_history_service_1 = require("../epin-history/epin-history.service");
const typeorm_1 = require("typeorm");
let UserEpinService = (() => {
    let UserEpinService = class UserEpinService {
        constructor(historyService, accountsService) {
            this.historyService = historyService;
            this.accountsService = accountsService;
        }
        async getById(userId, status) {
            const [userEPins, count] = await userEpin_entity_1.UserEpin.getByUserId(userId, status);
            return [
                userEPins.map(e => e.responseObject),
                count
            ];
        }
        async sendToAnother(userId, data) {
            const { sendTo, total } = data;
            const [availableEPins, availableCount] = await userEpin_entity_1.UserEpin.getByUserId(userId);
            if (availableCount < total) {
                throw new common_1.HttpException(`Not enought epins. Available E-Pins ${availableCount}`, common_1.HttpStatus.NOT_ACCEPTABLE);
            }
            const receiver = await user_entity_1.User.findOne(sendTo, { where: { status: 'active' } });
            const { id: senderId, name: senderName } = Object.assign({}, availableEPins[0].owner);
            if (!receiver) {
                throw new common_1.HttpException('Invalid userid to send to', common_1.HttpStatus.NOT_ACCEPTABLE);
            }
            const epinsToSend = availableEPins.slice(0, total);
            const senderHistory = epinsToSend.map(obj => this.historyService
                .createHistory(obj.owner, obj.epin, `Sent to ${receiver.id} (${receiver.name})`));
            epinsToSend.forEach(epin => epin.owner = receiver);
            const receiverHistory = epinsToSend.map(obj => this.historyService
                .createHistory(obj.owner, obj.epin, `Received from ${senderId} (${senderName})`));
            await typeorm_1.getManager().transaction(async (trx) => {
                await trx.save(epinsToSend);
                await trx.save(senderHistory);
                await trx.save(receiverHistory);
            });
            return epinsToSend.map(e => e.id);
        }
        async activateAccount(ownerId, userId) {
            const [availableEPins, count] = await userEpin_entity_1.UserEpin.getByUserId(ownerId);
            if (count < 1) {
                throw new common_1.HttpException('Not enought epin', common_1.HttpStatus.NOT_ACCEPTABLE);
            }
            const userEpin = availableEPins[0];
            const { id, epin, owner } = userEpin;
            const user = await this.accountsService.activateAccount(epin.id, userId);
            userEpin.status = 'used';
            const history = this.historyService
                .createHistory(owner, epin, `Activated account for ${user.id} (${user.name})`);
            await typeorm_1.getManager().transaction(async (trx) => {
                await trx.save(userEpin);
                await trx.save(history);
            });
            return id;
        }
        async sendFromAdmin(data) {
            const { sendTo, total } = data;
            const epins = await epin_entity_1.EPin.getUnused();
            if (epins.length < total) {
                throw new common_1.HttpException('Not enough epin', common_1.HttpStatus.NOT_ACCEPTABLE);
            }
            const owner = await user_entity_1.User.findOne(sendTo, { where: { status: 'active' } });
            if (!owner) {
                throw new common_1.HttpException('Invalid userid to send to', common_1.HttpStatus.NOT_ACCEPTABLE);
            }
            const admin = (await user_entity_1.User.find({ where: { role: 'admin' } }))[0];
            const epinToSend = epins.slice(0, total);
            const userEpins = epinToSend.map(epin => userEpin_entity_1.UserEpin.create({ owner, epin }));
            const histories = epinToSend.map(epin => this.historyService
                .createHistory(owner, epin, `Received from Admin`));
            const adminHistory = epinToSend.map(epin => this.historyService
                .createHistory(admin, epin, `Sent to ${owner.id} (${owner.name})`));
            await typeorm_1.getManager().transaction(async (trx) => {
                await trx.save(userEpins);
                await trx.save(histories);
                await trx.save(adminHistory);
            });
            return epinToSend.map(epin => epin.id);
        }
    };
    UserEpinService = __decorate([
        common_1.Injectable(),
        __metadata("design:paramtypes", [epin_history_service_1.EpinHistoryService,
            accounts_service_1.AccountsService])
    ], UserEpinService);
    return UserEpinService;
})();
exports.UserEpinService = UserEpinService;
//# sourceMappingURL=user-epin.service.js.map