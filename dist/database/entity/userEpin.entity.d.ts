import { Base } from "./base.entity";
import { EPin } from "./epin.entity";
import { User } from "./user.entity";
export declare class UserEpin extends Base {
    owner: User;
    epin: EPin;
    status: 'used' | 'unused';
    static getByUserId(userId: string, status?: 'used' | 'unused'): Promise<[UserEpin[], number]>;
}
