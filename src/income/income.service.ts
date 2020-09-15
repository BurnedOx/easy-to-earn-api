import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from 'src/database/entity/income.entity';
import { Repository, EntityManager } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { levelIncomeAmount } from 'src/common/costraints';
import { Transaction } from 'src/database/entity/transaction.entity';

@Injectable()
export class IncomeService {
    constructor(
        @InjectRepository(Income)
        private readonly incomeRepo: Repository<Income>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Transaction)
        private readonly trxRepo: Repository<Transaction>
    ) { }

    async getIncomes(userId: string) {
        const user = await this.userRepo.findOne(userId);
        if (!user) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }
        const incomes = await this.incomeRepo.find({ where: { owner: user }, relations: ['owner', 'from'] });
        return incomes.map(i => i.toResponseObject());
    }

    async removePayments(incomes: Income[], trx: EntityManager) {
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

    async generateIncomes(from: User, trx: EntityManager) {
        if (from.status === 'inactive') return;
        let level: number = 1;
        let sponsor: User = await this.userRepo.findOne(from.sponsoredBy.id, { relations: ['sponsoredBy', 'ranks', 'sponsored'] });
        while (level <= 10 && sponsor.role === 'user') {
            let amount: number;
            if (sponsor.autopooledAt === null && level === 1) {
                amount = levelIncomeAmount[level] - 100;
            } else {
                amount = levelIncomeAmount[level];
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

    private async generateLeadershipBonus(leader: User, level: number, trx: EntityManager) {
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
            remarks: `${leader.ranks[leader.ranks.length - 1]?.rank} Leadership Bonus from level ${level}`,
            owner: leader
        });
        await trx.save(transaction);
    }
}
