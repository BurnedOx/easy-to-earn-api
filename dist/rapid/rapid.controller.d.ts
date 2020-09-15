import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { RapidService } from './rapid.service';
export declare class RapidController {
    private readonly rapidService;
    constructor(rapidService: RapidService);
    getByUserId(headers: HeaderDTO): Promise<{
        done: number;
        days: number;
        startDate: Date;
        endDate: Date;
        amount: number;
        target: number;
        status: "incomplete" | "complete";
        owner: import("../database/entity/user.entity").User;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
