import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { SendEPinDTO } from './user-epin.dto';
import { UserEpinService } from './user-epin.service';
export declare class UserEpinController {
    private readonly userEpinService;
    constructor(userEpinService: UserEpinService);
    getAvailable(headers: HeaderDTO, status?: "used" | "unused"): Promise<(number | import("../interfaces").UserEPinRO[])[]>;
    sendTo(headers: HeaderDTO, data: SendEPinDTO): Promise<string[]>;
    activateAccount(headers: HeaderDTO, userId: string): Promise<string>;
    sendByAdmin(data: SendEPinDTO): Promise<string[]>;
}
