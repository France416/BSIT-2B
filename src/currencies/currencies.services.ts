import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class CurrenciesService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createCurrency(currency_code: string, currency_name: string, symbol: string, id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO currencies (currency_code, currency_name, symbol, id) VALUES (?, ?, ?, ?)',  
      [currency_code, currency_name, symbol, id],
    );
    return { currency_id: result.insertId, currency_code, currency_name, symbol, id };
  }

  async findByCurrencyCode(currency_code: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT currency_id, currency_code, currency_name, symbol, id, created_at, updated_at FROM currencies WHERE currency_code = ?',
      [currency_code],
    );
    return rows[0];
  }

  async findById(currency_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM currencies WHERE currency_id = ?',
      [currency_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM currencies',
    );
    return rows;
  }

  async updateCurrency(
    currency_id: number, 
    partial: { currency_code?: string; currency_name?: string; symbol?: string; id?: number }
  ) {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (partial.currency_code) {
      fields.push('currency_code = ?');
      values.push(partial.currency_code);
    }
    if (partial.currency_name) {
      fields.push('currency_name = ?');
      values.push(partial.currency_name);
    }
    if (partial.symbol) {
      fields.push('symbol = ?');
      values.push(partial.symbol);
    }
    if (partial.id !== undefined) {
      fields.push('id = ?');
      values.push(partial.id);
    }

    if (fields.length === 0) return await this.findById(currency_id);
    
    values.push(currency_id);
    const sql = `UPDATE currencies SET ${fields.join(', ')} WHERE currency_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(currency_id);
  }

  async deleteCurrency(currency_id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM currencies WHERE currency_id = ?', [currency_id]);
    return res.affectedRows > 0;
  }
}