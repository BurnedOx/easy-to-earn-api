import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { EpinHistoryService } from './epin-history.service';
export declare class EpinHistoryController {
    private readonly epinHistoryService;
    constructor(epinHistoryService: EpinHistoryService);
    getAll(headers: HeaderDTO): Promise<import("../database/entity/epinHistory.entity").EpinHistory[]>;
}
