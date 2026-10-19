import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CategoriesService } from './categories.services';
import { CategoriesController } from './categories.controler';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
