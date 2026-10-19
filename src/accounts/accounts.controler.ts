import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AccountsService } from './accounts.services';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  // Get all accounts (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.accountsService.getAll();
  }

  // Get single account by account_id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.accountsService.findById(+id);
  }

  // Create account (protected - grabs user id from JWT token if available, or body)
  @Post()
  async create(@Body() body: { account_name: string; account_type: string; current_balance: string; id: number }) {
    return this.accountsService.createAccounts(body.account_name, body.account_type, body.current_balance, body.id);
  }

  // Update account (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.accountsService.updateAccount(+id, body);
  }

  // Delete account (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.accountsService.deleteAccounts(+id);
  }
}