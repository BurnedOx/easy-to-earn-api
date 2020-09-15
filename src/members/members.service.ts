import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Repository, Not, IsNull, getManager, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async updateAutopool() {
        const users = await this.userRepo.find({ where: { activatedAt: Not(IsNull()) } });
        await getManager().transaction(async trx => {
            for (let user of users) {
                const singleLegMembers = await this.getAutopool(user);
                user.totalAutopool = singleLegMembers.length;
                trx.save(user);
            }
        });

        return 'ok';
    }

    async directMembers(userId: string) {
        const user = await this.checkUser(userId);
        const members = await this.userRepo.find({
            where: { sponsoredBy: user },
            order: { createdAt: 'DESC' }
        });
        return members.map(member => member.toMemberObject(1));
    }

    async downlineMembers(userId: string) {
        const user = await this.checkUser(userId);
        return (await User.getDownline(user))
            .map(({ member, level }) => member.toMemberObject(level));
    }

    async autopoolMembers(userId: string) {
        const user = await this.checkUser(userId);
        const members = await this.getAutopool(user);
        return members.map(m => m.toAutopoolMemberObject());
    }

    private async checkUser(userId: string) {
        const user = await this.userRepo.findOne(userId, { relations: ['sponsored', 'sponsoredBy'] });
        if (!user) {
            throw new HttpException('Invalid userid', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    private async getAutopool(user: User) {
        if (user.autopooledAt === null) {
            throw new HttpException('User is not autopooled yet', HttpStatus.BAD_REQUEST);
        }

        return User.getAutopool(user);
    }
}
