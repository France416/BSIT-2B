import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.services';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  // Get all transactions (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.transactionsService.getAll();
  }

  // Get single transaction by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.transactionsService.findById(+id);
  }

  // Create transactions (open - for demo)
  @Post()
  async create(@Body() body: { account_id: number | string; category_id: number | string; amount: number | string; notes: string }) {
    return this.transactionsService.createTransactions(
      +body.account_id,
      +body.category_id,
      +body.amount,
      body.notes
    );
  }

  // Update transactions (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.transactionsService.updateUser(+id, body);
  }

  // Delete transactions (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.transactionsService.deleteTransactions(+id);
  }
}