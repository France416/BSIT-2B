import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { DatabaseModule } from './database/database.module';
import { RecurringTransactionsModule } from './recurring_transactions/recurring_transactions.module';
import { SavingsGoalsModule } from './savings_goals/savingsgoals.module';
@Module({
  imports: [DatabaseModule, UsersModule, AccountsModule, CategoriesModule, CurrenciesModule, TransactionsModule, RecurringTransactionsModule, AuthModule, SavingsGoalsModule],
})
export class AppModule {}

