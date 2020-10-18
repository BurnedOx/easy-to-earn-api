import { Base } from "./base.entity";
import { EntityManager } from "typeorm";
import { BankDetails, UserRO, MemberRO } from "src/interfaces";
import { EPin } from "./epin.entity";
import { Income } from "./income.entity";
import { Withdrawal } from "./withdrawal.entity";
import { Transaction } from "./transaction.entity";
import { Rapid } from "./rapid.entity";
import { UserEpin } from "./userEpin.entity";
import { EpinHistory } from "./epinHistory.entity";
export declare class User extends Base {
    name: string;
    mobile: number;
    password: string;
    role: 'user' | 'admin';
    status: 'active' | 'inactive';
    activatedAt: Date | null;
    bankDetails: BankDetails | null;
    panNumber: string | null;
    balance: number;
    sponsored: User[];
    sponsoredBy: User | null;
    epin: EPin | null;
    incomes: Income[];
    challenges: Rapid[];
    generatedIncomes: Income[];
    withdrawals: Withdrawal[];
    trx: Transaction[];
    parchasedEpins: UserEpin[];
    epinHistory: EpinHistory[];
    hashPassword(): Promise<void>;
    static findById(id: string): import("rxjs").Observable<User>;
    static getProfile(userId: string): Promise<User>;
    static findDirectForRapid(sponsorId: string, startDate: Date, endDate: Date): Promise<[User[], number]>;
    static getDownline(root: User, downline?: {
        member: User;
        level: number;
    }[], level?: number): Promise<{
        member: User;
        level: number;
    }[]>;
    static creditBalance(id: string, amount: number, trx?: EntityManager): Promise<User>;
    static debitBalance(id: string, amount: number): Promise<User>;
    toResponseObject(token?: string): UserRO;
    toMemberObject(level: number): MemberRO;
    comparePassword(attempt: string): Promise<boolean>;
}
