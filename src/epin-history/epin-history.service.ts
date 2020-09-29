import { Injectable } from '@nestjs/common';
import { EPin } from 'src/database/entity/epin.entity';
import { EpinHistory } from 'src/database/entity/epinHistory.entity';
import { User } from 'src/database/entity/user.entity';

@Injectable()
export class EpinHistoryService {
    public createHistory(owner: User, epin: EPin, remark: string) {
        return EpinHistory.create({ owner, epin, remark });
    }
}
