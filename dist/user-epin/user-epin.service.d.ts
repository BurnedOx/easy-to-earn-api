import { AccountsService } from 'src/accounts/accounts.service';
import { EpinHistoryService } from 'src/epin-history/epin-history.service';
import { SendEPinDTO } from './user-epin.dto';
export declare class UserEpinService {
    private readonly historyService;
    private readonly accountsService;
    constructor(historyService: EpinHistoryService, accountsService: AccountsService);
    getById(userId: string, status?: "used" | "unused"): Promise<(number | import("../interfaces").UserEPinRO[])[]>;
    sendToAnother(userId: string, data: SendEPinDTO): Promise<string[]>;
    activateAccount(ownerId: string, userId: string): Promise<string>;
    sendFromAdmin(data: SendEPinDTO): Promise<string[]>;
}
