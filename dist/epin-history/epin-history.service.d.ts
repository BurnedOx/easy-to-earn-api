import { EPin } from 'src/database/entity/epin.entity';
import { EpinHistory } from 'src/database/entity/epinHistory.entity';
import { User } from 'src/database/entity/user.entity';
export declare class EpinHistoryService {
    createHistory(owner: User, epin: EPin, remark: string): EpinHistory;
    getAll(userId: string): Promise<EpinHistory[]>;
}
