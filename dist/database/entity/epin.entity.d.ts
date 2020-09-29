import { Base } from "./base.entity";
import { User } from "./user.entity";
import { EpinRO } from "src/interfaces";
import { UserEpin } from "./userEpin.entity";
import { EpinHistory } from "./epinHistory.entity";
export declare class EPin extends Base {
    owner: User | null;
    purchasedBy: UserEpin | null;
    history: EpinHistory[];
    static getAll(): Promise<EPin[]>;
    static getUsed(): Promise<EPin[]>;
    static getUnused(): Promise<EPin[]>;
    toResponseObject(): EpinRO;
}
