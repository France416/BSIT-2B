import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CurrenciesService } from './currencies.services';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('currencies')
export class CurrenciesController {
  constructor(private currenciesService: CurrenciesService) {}

  // Get all currencies (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.currenciesService.getAll();
  }

  // Get single currency by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.currenciesService.findById(+id);
  }

  // Create currency
  @Post()
  async create(@Body() body: { currency_code: string; currency_name: string; symbol: string; id: number }) {
    return this.currenciesService.createCurrency(body.currency_code, body.currency_name, body.symbol, body.id);
  }

  // Update currency (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.currenciesService.updateCurrency(+id, body);
  }

  // Delete currency (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.currenciesService.deleteCurrency(+id);
  }
}