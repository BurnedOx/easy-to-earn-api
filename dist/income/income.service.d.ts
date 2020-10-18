import { Income } from 'src/database/entity/income.entity';
import { EntityManager } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
export declare class IncomeService {
    getIncomes(userId: string): Promise<import("../interfaces").IncomeRO[]>;
    removePayments(incomes: Income[], trx: EntityManager): Promise<void>;
    generateIncomes(from: User, trx: EntityManager): Promise<void>;
}
