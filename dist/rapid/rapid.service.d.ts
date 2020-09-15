import { Rapid } from 'src/database/entity/rapid.entity';
import { User } from 'src/database/entity/user.entity';
import { EntityManager } from 'typeorm';
export declare class RapidService {
    findByUser(userId: string): Promise<{
        done: number;
        days: number;
        startDate: Date;
        endDate: Date;
        amount: number;
        target: number;
        status: "incomplete" | "complete";
        owner: User;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    newChallenge(owner: User, trx?: EntityManager): Promise<Rapid>;
    checkForCompletion(): Promise<void>;
    private getCompleted;
    private handleCompletion;
    private handleConvertTo30;
    private handleStartNew;
    private getDays;
}
