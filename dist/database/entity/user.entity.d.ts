import { Base } from "./base.entity";
import { EntityManager } from "typeorm";
import { BankDetails, UserRO, MemberRO, AutopoolMemberRO } from "src/interfaces";
import { EPin } from "./epin.entity";
import { Income } from "./income.entity";
import { Rank } from "./rank.entity";
import { Withdrawal } from "./withdrawal.entity";
import { Transaction } from "./transaction.entity";
import { Rapid } from "./rapid.entity";
export declare class User extends Base {
    name: string;
    mobile: number;
    password: string;
    role: 'user' | 'admin';
    status: 'active' | 'inactive';
    activatedAt: Date | null;
    totalAutopool: number;
    autopooledAt: Date | null;
    bankDetails: BankDetails | null;
    panNumber: string | null;
    balance: number;
    sponsored: User[];
    sponsoredBy: User | null;
    epin: EPin | null;
    incomes: Income[];
    challenges: Rapid[];
    generatedIncomes: Income[];
    ranks: Rank[];
    withdrawals: Withdrawal[];
    trx: Transaction[];
    hashPassword(): Promise<void>;
    static findById(id: string): import("rxjs").Observable<User>;
    static findDirectForRapid(sponsorId: string, startDate: Date, endDate: Date): Promise<[User[], number]>;
    static getDownline(root: User, downline?: {
        member: User;
        level: number;
    }[], level?: number): Promise<{
        member: User;
        level: number;
    }[]>;
    static getAutopool(user: User): Promise<User[]>;
    static creditBalance(id: string, amount: number, trx?: EntityManager): Promise<User>;
    static debitBalance(id: string, amount: number): Promise<User>;
    toResponseObject(token?: string): UserRO;
    toMemberObject(level: number): MemberRO;
    toAutopoolMemberObject(): AutopoolMemberRO;
    comparePassword(attempt: string): Promise<boolean>;
}
