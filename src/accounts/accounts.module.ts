import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccountsService } from './accounts.services';
import { AccountsController } from './accounts.controler';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
