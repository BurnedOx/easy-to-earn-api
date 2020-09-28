import { Module } from '@nestjs/common';
import { UserEpinService } from './user-epin.service';
import { UserEpinController } from './user-epin.controller';

@Module({
  providers: [UserEpinService],
  controllers: [UserEpinController]
})
export class UserEpinModule {}
