import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { RecurringTransactionsService } from './recurring_transactions.services';
import { RecurringTransactionsController } from './recurring_transactions.controler';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [RecurringTransactionsController],
  providers: [RecurringTransactionsService],
  exports: [RecurringTransactionsService],
})
export class RecurringTransactionsModule {}