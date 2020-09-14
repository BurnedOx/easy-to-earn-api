import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { RapidService } from './rapid.service';
export declare class RapidController {
    private readonly rapidService;
    constructor(rapidService: RapidService);
    getByUserId(headers: HeaderDTO): Promise<import("../database/entity/rapid.entity").Rapid>;
}
