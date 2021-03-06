import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { EPin } from 'src/database/entity/epin.entity';
import { EpinHistory } from 'src/database/entity/epinHistory.entity';
import { User } from 'src/database/entity/user.entity';
import { UserEpin } from 'src/database/entity/userEpin.entity';
import { EpinHistoryService } from 'src/epin-history/epin-history.service';
import { getManager } from 'typeorm';
import { SendEPinDTO } from './user-epin.dto';

@Injectable()
export class UserEpinService {
    constructor(
        private readonly historyService: EpinHistoryService,
        private readonly accountsService: AccountsService,
    ) { }

    async getById(userId: string, status?: "used" | "unused") {
        const [userEPins, count] = await UserEpin.getByUserId(userId, status);
        return [
            userEPins.map(e => e.responseObject),
            count
        ]
    }

    async sendToAnother(userId: string, data: SendEPinDTO) {
        const { sendTo, total } = data;
        const [availableEPins, availableCount] = await UserEpin.getByUserId(userId);

        if (availableCount < total) {
            throw new HttpException(`Not enought epins. Available E-Pins ${availableCount}`, HttpStatus.NOT_ACCEPTABLE);
        }

        const receiver = await User.findOne(sendTo, { where: { status: 'active' } });
        const { id: senderId, name: senderName } = { ...availableEPins[0].owner };

        if (!receiver) {
            throw new HttpException('Invalid userid to send to', HttpStatus.NOT_ACCEPTABLE);
        }

        const epinsToSend = availableEPins.slice(0, total);
        const senderHistory = epinsToSend.map(obj => this.historyService
            .createHistory(obj.owner, obj.epin, `Sent to ${receiver.id} (${receiver.name})`));
        epinsToSend.forEach(epin => epin.owner = receiver);
        const receiverHistory = epinsToSend.map(obj => this.historyService
            .createHistory(obj.owner, obj.epin, `Received from ${senderId} (${senderName})`));

        await getManager().transaction(async trx => {
            await trx.save(epinsToSend);
            await trx.save(senderHistory);
            await trx.save(receiverHistory);
        });

        return epinsToSend.map(e => e.id);
    }

    async activateAccount(ownerId: string, userId: string) {
        const [availableEPins, count] = await UserEpin.getByUserId(ownerId);

        if (count < 1) {
            throw new HttpException('Not enought epin', HttpStatus.NOT_ACCEPTABLE);
        }

        const userEpin = availableEPins[0];
        const { id, epin, owner } = userEpin;
        const user = await this.accountsService.activateAccount(epin.id, userId);
        userEpin.status = 'used';
        const history = this.historyService
            .createHistory(owner, epin, `Activated account for ${user.id} (${user.name})`);
        
        await getManager().transaction(async trx => {
            await trx.save(userEpin);
            await trx.save(history);
        });

        return id;
    }

    async sendFromAdmin(data: SendEPinDTO) {
        const { sendTo, total } = data;
        const epins = await EPin.getUnused();

        if (epins.length < total) {
            throw new HttpException('Not enough epin', HttpStatus.NOT_ACCEPTABLE);
        }

        const owner = await User.findOne(sendTo, { where: { status: 'active' } });

        if (!owner) {
            throw new HttpException('Invalid userid to send to', HttpStatus.NOT_ACCEPTABLE);
        }

        const admin = (await User.find({where: {role: 'admin'}}))[0];
        const epinToSend = epins.slice(0, total);
        const userEpins = epinToSend.map(epin => UserEpin.create({ owner, epin }));
        const histories = epinToSend.map(epin => this.historyService
            .createHistory(owner, epin, `Received from Admin`));
        const adminHistory = epinToSend.map(epin => this.historyService
            .createHistory(admin, epin, `Sent to ${owner.id} (${owner.name})`));

        await getManager().transaction(async trx => {
            await trx.save(userEpins);
            await trx.save(histories);
            await trx.save(adminHistory);
        });

        return epinToSend.map(epin => epin.id);
    }
}
