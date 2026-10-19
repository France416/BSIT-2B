import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RecurringTransactionsService } from './recurring_transactions.services';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('recurring_transactions')
export class RecurringTransactionsController {
  constructor(private readonly recurringTransactionsService: RecurringTransactionsService) {}

  // Get all recurring transactions (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.recurringTransactionsService.getAll();
  }

  // Get single recurring transaction by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.recurringTransactionsService.findById(+id);
  }

  // Create recurring transaction
  @Post()
  async create(@Body() body: { account_id: number; category_id: number; amount: number; frequency: string; next_execution_date: string }) {
    return this.recurringTransactionsService.createRecurringTransaction(
      body.account_id, 
      body.category_id, 
      body.amount, 
      body.frequency, 
      body.next_execution_date
    );
  }

  // Update recurring transaction (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.recurringTransactionsService.updateRecurringTransaction(+id, body);
  }

  // Delete recurring transaction (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.recurringTransactionsService.deleteRecurringTransaction(+id);
  }
}