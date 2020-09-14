import { Rapid } from 'src/database/entity/rapid.entity';
import { User } from 'src/database/entity/user.entity';
import { EntityManager } from 'typeorm';
export declare class RapidService {
    findByUser(userId: string): Promise<Rapid>;
    newChallenge(owner: User, trx?: EntityManager): Promise<Rapid>;
    checkForCompletion(): Promise<void>;
    private getCompleted;
    private handleCompletion;
    private handleConvertTo30;
    private handleStartNew;
}
