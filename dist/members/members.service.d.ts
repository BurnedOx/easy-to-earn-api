export declare class MembersService {
    directMembers(userId: string): Promise<import("../interfaces").MemberRO[]>;
    downlineMembers(userId: string): Promise<import("../interfaces").MemberRO[]>;
    private checkUser;
}
