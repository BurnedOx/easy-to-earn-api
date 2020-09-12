import { User } from 'src/database/entity/user.entity';
import { Repository } from 'typeorm';
export declare class MembersService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    updateAutopool(): Promise<string>;
    directMembers(userId: string): Promise<import("../interfaces").MemberRO[]>;
    downlineMembers(userId: string): Promise<import("../interfaces").MemberRO[]>;
    autopoolMembers(userId: string): Promise<import("../interfaces").AutopoolMemberRO[]>;
    private checkUser;
    private getAutopool;
}
