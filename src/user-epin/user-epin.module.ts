import { Module } from '@nestjs/common';
import { UserEpinService } from './user-epin.service';
import { UserEpinController } from './user-epin.controller';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [UserEpinModule, AccountsModule],
  providers: [UserEpinService],
  controllers: [UserEpinController]
})
export class UserEpinModule {}
