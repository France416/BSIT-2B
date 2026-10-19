
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import { SavingsGoalsService } from './savingsgoals.services';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('savings_goals')
@UseGuards(JwtAuthGuard)
export class SavingsGoalsController {
  constructor(
    private readonly savingsGoalsService: SavingsGoalsService,
  ) {}

  // GET /savings_goals
  @Get()
  async getAll() {
    return this.savingsGoalsService.getAll();
  }

  // GET /savings_goals/:id
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.savingsGoalsService.findById(id);
  }

  // POST /savings_goals
  @Post()
  async create(
    @Body()
    body: {
      user_id: number;
      goal_name: string;
      target_amount: number;
      current_amount?: number;
      target_date?: string;
    },
  ) {
    return this.savingsGoalsService.createGoal(
      body.user_id,
      body.goal_name,
      body.target_amount,
      body.current_amount,
      body.target_date,
    );
  }

  // PUT /savings_goals/:id
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      goal_name?: string;
      target_amount?: number;
      current_amount?: number;
      target_date?: string | null;
    },
  ) {
    return this.savingsGoalsService.updateGoal(id, body);
  }

  // DELETE /savings_goals/:id
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.savingsGoalsService.deleteGoal(id);
  }
}
