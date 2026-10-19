import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CurrenciesService } from './currencies.services';
import { CurrenciesController } from './currencies.controler';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}