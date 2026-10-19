import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TransactionsService } from './transactions.services';
import { TransactionsController } from './transactions.controler';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
