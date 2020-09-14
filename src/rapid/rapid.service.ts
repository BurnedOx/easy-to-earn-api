import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import moment = require('moment');
import { Rapid } from 'src/database/entity/rapid.entity';
import { Transaction } from 'src/database/entity/transaction.entity';
import { User } from 'src/database/entity/user.entity';
import { EntityManager, getManager } from 'typeorm';

@Injectable()
export class RapidService {
    findByUser(userId: string) {
        return Rapid.findByOwner(userId);
    }

    async newChallenge(owner: User, trx?: EntityManager) {
        const startDate = new Date();
        const endDate = new Date(moment().add(7, 'days').set('hours', 23).set('minutes', 59).set('seconds', 0).format())
        const challenge = Rapid.create({ startDate, endDate, owner });
        if (trx) {
            return trx.save(challenge);
        }
        return challenge.save();
    }

    @Cron('0 0 * * *')
    checkForCompletion() {
        return getManager().transaction(async trx => {
            const incomplete = await Rapid.findIncomplete();
            const [completed, incomplete7days, incomplete30days] = await this.getCompleted(incomplete);
            await this.handleCompletion(completed, trx);
            await this.handleConvertTo30(incomplete7days);
            await this.handleStartNew(incomplete30days, trx);
        });
    }

    private async getCompleted(rapids: Rapid[]) {
        const completed: Rapid[] = [];
        const incomplete7days: Rapid[] = [];
        const incomplete30days: Rapid[] = [];
        for (let rapid of rapids) {
            const [directs, count] = await User.findDirectForRapid(rapid.owner.id, rapid.startDate, rapid.endDate);
            if (rapid.target <= count) {
                completed.push(rapid);
            } else if (rapid.days === 7) {
                incomplete7days.push(rapid);
            } else if (rapid.days === 28) {
                incomplete30days.push(rapid);
            }
        }
        return [completed, incomplete7days, incomplete30days];
    }

    private async handleCompletion(rapids: Rapid[], trx: EntityManager) {
        const toComplete = await Rapid.completeChallenges(rapids.map(r => r.id));
        for (let rapid of toComplete) {
            const owner = await User.creditBalance(rapid.owner.id, rapid.amount);
            const transaction = Transaction.create({
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

    private async handleConvertTo30(rapids: Rapid[]) {
        const endDate = new Date(moment().add(21, 'days').set('hours', 23).set('minutes', 59).set('seconds', 0).format());
        await Rapid.updateToNext(rapids.map(r => r.id), endDate);
    }

    private handleStartNew(rapids: Rapid[], trx: EntityManager) {
        return Promise.all(rapids.map(r => this.newChallenge(r.owner, trx)));
    }
}
