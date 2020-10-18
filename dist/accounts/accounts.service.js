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
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../database/entity/user.entity");
const typeorm_1 = require("typeorm");
const epin_entity_1 = require("../database/entity/epin.entity");
const income_service_1 = require("../income/income.service");
const bcrypct = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const aws_1 = require("../common/aws/aws");
const rapid_service_1 = require("../rapid/rapid.service");
const transaction_entity_1 = require("../database/entity/transaction.entity");
let AccountsService = (() => {
    let AccountsService = class AccountsService {
        constructor(incomeService, rapidService, jwtService, aws) {
            this.incomeService = incomeService;
            this.rapidService = rapidService;
            this.jwtService = jwtService;
            this.aws = aws;
        }
        findOne(id) {
            return rxjs_1.from(user_entity_1.User.findOne(id, { relations: ['sponsoredBy', 'epin'] })).pipe(operators_1.map((user) => user === null || user === void 0 ? void 0 : user.toResponseObject()));
        }
        getName(id) {
            return this.findOne(id).pipe(operators_1.map(user => { var _a; return (_a = user === null || user === void 0 ? void 0 : user.name) !== null && _a !== void 0 ? _a : 'not found'; }));
        }
        async getAll() {
            const users = await user_entity_1.User.find({ relations: ['sponsoredBy', 'epin'] });
            return users.map(user => user.toResponseObject());
        }
        async login(data, admin = false) {
            const { userId, password } = data;
            const user = await user_entity_1.User.findOne(userId, { relations: ['sponsoredBy', 'epin'] });
            if (!user || !(await user.comparePassword(password)) || (admin && user.role !== 'admin')) {
                throw new common_1.HttpException('Invalid userid/password', common_1.HttpStatus.BAD_REQUEST);
            }
            const token = await this.generateJWT(userId);
            return user.toResponseObject(token);
        }
        async register(data) {
            const { name, password, mobile, sponsorId } = data;
            const sponsoredBy = await user_entity_1.User.findOne(sponsorId);
            if (!sponsoredBy) {
                throw new common_1.HttpException('Invalid sponspor id', common_1.HttpStatus.BAD_REQUEST);
            }
            if (sponsoredBy.status !== 'active') {
                throw new common_1.HttpException('Inactive sponsor', common_1.HttpStatus.BAD_REQUEST);
            }
            const user = user_entity_1.User.create({
                role: 'user',
                name, password, mobile, sponsoredBy
            });
            await user.save();
            const token = await this.generateJWT(user.id);
            this.aws.sendSMS(`Wellcome to Easy2Earn\n
            You have successfully registered\n
            Your User Id: ${user.id}\n
            Your Password: ${password}\n
            Please visit: http://easy2earn.s3-website.us-east-2.amazonaws.com/`, `${mobile}`, 'e2earn');
            return user.toResponseObject(token);
        }
        async getDetails(userId) {
            const user = await user_entity_1.User.getProfile(userId);
            if (!user) {
                throw new common_1.HttpException('user not found', common_1.HttpStatus.NOT_FOUND);
            }
            const { balance: wallet, sponsored, incomes, withdrawals } = user;
            const incomeAmounts = incomes.map(i => i.amount);
            const withdrawAmounts = withdrawals.filter(w => w.status === 'paid').map(w => w.withdrawAmount);
            const direct = sponsored.length;
            const downline = (await user_entity_1.User.getDownline(user)).length;
            const levelIncome = incomeAmounts.length !== 0 ? incomeAmounts.reduce((a, b) => a + b) : 0;
            const totalWithdrawal = withdrawAmounts.length !== 0 ? withdrawAmounts.reduce((a, b) => a + b) : 0;
            const totalIncome = levelIncome;
            return {
                wallet, direct, downline, levelIncome, totalWithdrawal, totalIncome
            };
        }
        async registerAdmin(data) {
            const { name, mobile, password } = data;
            const user = user_entity_1.User.create({
                role: 'admin',
                sponsoredBy: null,
                status: 'active',
                name, mobile, password,
            });
            await user.save();
            const token = await this.generateJWT(user.id);
            return user.toResponseObject(token);
        }
        async activateAccount(epinId, userId) {
            let epin = await epin_entity_1.EPin.findOne(epinId, { relations: ['owner'] });
            if (!epin) {
                throw new common_1.HttpException('Invalid E-Pin', common_1.HttpStatus.NOT_FOUND);
            }
            if (epin.owner) {
                throw new common_1.HttpException('E-Pin already used', common_1.HttpStatus.BAD_REQUEST);
            }
            const user = await user_entity_1.User.findOne(userId, { relations: ['sponsoredBy', 'epin'] });
            if (!user) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (user.status === 'active') {
                throw new common_1.HttpException('User already activated', common_1.HttpStatus.BAD_REQUEST);
            }
            await typeorm_1.getManager().transaction(async (trx) => {
                user.epin = epin;
                user.status = 'active';
                user.activatedAt = new Date();
                await trx.save(user);
                await this.incomeService.generateIncomes(user, trx);
                await this.rapidService.newChallenge(user, trx);
            });
            return user.toResponseObject();
        }
        async updateProfile(data, userId) {
            const user = await user_entity_1.User.update(userId, data);
            if (user.affected > 0) {
                return 'ok';
            }
            else {
                throw new common_1.HttpException('Update Failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        async updatePassword(data, userId) {
            const { oldPassword, newPassword } = data;
            const user = await user_entity_1.User.findOne(userId);
            if (!user || !(await user.comparePassword(oldPassword))) {
                throw new common_1.HttpException('Invalid password', common_1.HttpStatus.BAD_REQUEST);
            }
            user.password = await bcrypct.hash(newPassword, 10);
            await user.save();
            return 'ok';
        }
        async forgotPassword(id, newPassword) {
            const user = await user_entity_1.User.findOne(id);
            if (!user) {
                throw new common_1.HttpException('User Not Found', common_1.HttpStatus.NOT_FOUND);
            }
            user.password = await bcrypct.hash(newPassword, 10);
            await user.save();
            return 'ok';
        }
        async updateBankDetails(data, userId) {
            const user = await user_entity_1.User.update(userId, { bankDetails: data });
            if (user.affected > 0) {
                return 'ok';
            }
            else {
                throw new common_1.HttpException('Update Failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        async updateSponsor(userId, sponsorId) {
            const sponsor = await user_entity_1.User.findOne(sponsorId);
            if (!sponsor && !(sponsor.status === 'active')) {
                throw new common_1.HttpException('Invalid Sponsor', common_1.HttpStatus.BAD_REQUEST);
            }
            const user = await user_entity_1.User.findOne(userId, { relations: ['generatedIncomes', 'sponsoredBy', 'epin'] });
            if (!user) {
                throw new common_1.HttpException('user not found', common_1.HttpStatus.NOT_FOUND);
            }
            await typeorm_1.getManager().transaction(async (trx) => {
                user.sponsoredBy = sponsor;
                await trx.save(user);
                await this.incomeService.removePayments(user.generatedIncomes, trx);
                await this.incomeService.generateIncomes(user, trx);
            });
            return user.toResponseObject();
        }
        async resetBalance() {
            const users = await user_entity_1.User.find();
            await typeorm_1.getManager().transaction(async (trx) => {
                for (let user of users) {
                    user.balance = 0;
                    await trx.save(user);
                }
            });
            return 'ok';
        }
        creditBalance(userId, amount) {
            try {
                return user_entity_1.User.creditBalance(userId, amount);
            }
            catch (e) {
                throw new common_1.HttpException(e.message, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        async debitBalance(userId, amount) {
            const user = await user_entity_1.User.findOne(userId);
            if (user.balance < amount) {
                throw new common_1.HttpException('Insufficient balance', common_1.HttpStatus.BAD_REQUEST);
            }
            typeorm_1.getManager().transaction(async (trx) => {
                user.balance = user.balance - amount;
                await trx.save(user);
                const transaction = transaction_entity_1.Transaction.create({
                    amount,
                    currentBalance: user.balance,
                    type: 'debit',
                    remarks: 'Debited by Admin',
                    owner: user
                });
                await trx.save(transaction);
            });
            return 'ok';
        }
        async deleteUser(id) {
            await user_entity_1.User.delete(id);
            return 'ok';
        }
        generateJWT(userId) {
            return this.jwtService.signAsync({ userId });
        }
    };
    AccountsService = __decorate([
        common_1.Injectable(),
        __metadata("design:paramtypes", [income_service_1.IncomeService,
            rapid_service_1.RapidService,
            jwt_1.JwtService,
            aws_1.AWSHandler])
    ], AccountsService);
    return AccountsService;
})();
exports.AccountsService = AccountsService;
//# sourceMappingURL=accounts.service.js.map