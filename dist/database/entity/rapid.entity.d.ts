import { Base } from "./base.entity";
import { User } from "./user.entity";
export declare class Rapid extends Base {
    startDate: Date;
    endDate: Date;
    amount: number;
    target: number;
    status: 'incomplete' | 'complete';
    owner: User;
    get days(): number;
    static findByOwner(ownerId: string): Promise<Rapid>;
    static findIncomplete(): Promise<Rapid[]>;
    static updateToNext(ids: string[], endDate: Date): Promise<Rapid[]>;
    static completeChallenges(ids: string[]): Promise<Rapid[]>;
}
