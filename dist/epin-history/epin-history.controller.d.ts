import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { EpinHistoryService } from './epin-history.service';
export declare class EpinHistoryController {
    private readonly epinHistoryService;
    constructor(epinHistoryService: EpinHistoryService);
    getAll(headers: HeaderDTO): Promise<import("../interfaces").EPinHistoryRO[]>;
    getAdminHistory(): Promise<import("../interfaces").EPinHistoryRO[]>;
}
