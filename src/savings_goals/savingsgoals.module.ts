
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SavingsGoalsService } from './savingsgoals.services';
import { SavingsGoalsController } from './savings-goals.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [SavingsGoalsController],
  providers: [SavingsGoalsService],
  exports: [SavingsGoalsService],
})
export class SavingsGoalsModule {}
