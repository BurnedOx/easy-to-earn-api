"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../database/entity/user.entity");
let MembersService = (() => {
    let MembersService = class MembersService {
        async directMembers(userId) {
            const user = await this.checkUser(userId);
            const members = await user_entity_1.User.find({
                where: { sponsoredBy: user },
                order: { createdAt: 'DESC' }
            });
            return members.map(member => member.toMemberObject(1));
        }
        async downlineMembers(userId) {
            const user = await this.checkUser(userId);
            return (await user_entity_1.User.getDownline(user))
                .map(({ member, level }) => member.toMemberObject(level));
        }
        async checkUser(userId) {
            const user = await user_entity_1.User.findOne(userId, { relations: ['sponsored', 'sponsoredBy'] });
            if (!user) {
                throw new common_1.HttpException('Invalid userid', common_1.HttpStatus.NOT_FOUND);
            }
            return user;
        }
    };
    MembersService = __decorate([
        common_1.Injectable()
    ], MembersService);
    return MembersService;
})();
exports.MembersService = MembersService;
//# sourceMappingURL=members.service.js.map