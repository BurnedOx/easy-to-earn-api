import { Base } from "./base.entity";
import { BankDetails, UserRO, MemberRO, AutopoolMemberRO } from "src/interfaces";
import { EPin } from "./epin.entity";
import { Income } from "./income.entity";
import { Rank } from "./rank.entity";
import { Withdrawal } from "./withdrawal.entity";
import { Transaction } from "./transaction.entity";
export declare class User extends Base {
    name: string;
    mobile: number;
    password: string;
    role: 'user' | 'admin';
    status: 'active' | 'inactive';
    activatedAt: Date | null;
    totalAutopool: number;
    bankDetails: BankDetails | null;
    panNumber: string | null;
    balance: number;
    sponsored: User[];
    sponsoredBy: User | null;
    epin: EPin | null;
    incomes: Income[];
    generatedIncomes: Income[];
    ranks: Rank[];
    withdrawals: Withdrawal[];
    trx: Transaction[];
    get isAutopooled(): boolean;
    hashPassword(): Promise<void>;
    static findById(id: string): import("rxjs").Observable<User>;
    static getDownline(root: User, downline?: {
        member: User;
        level: number;
    }[], level?: number): Promise<{
        member: User;
        level: number;
    }[]>;
    toResponseObject(token?: string): UserRO;
    toMemberObject(level: number): MemberRO;
    toAutopoolMemberObject(): AutopoolMemberRO;
    comparePassword(attempt: string): Promise<boolean>;
}
