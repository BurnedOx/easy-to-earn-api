import { EPinHistoryRO } from "src/interfaces";
import { Base } from "./base.entity";
import { EPin } from "./epin.entity";
import { User } from "./user.entity";
export declare class EpinHistory extends Base {
    owner: User;
    epin: EPin;
    remark: string;
    static getByUserId(userId: string): Promise<EpinHistory[]>;
    static getAdminHistory(): Promise<EpinHistory[]>;
    get responseObject(): EPinHistoryRO;
}
