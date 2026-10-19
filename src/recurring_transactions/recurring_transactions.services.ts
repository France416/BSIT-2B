import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class RecurringTransactionsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createRecurringTransaction(
    account_id: number, 
    category_id: number, 
    amount: number, 
    frequency: string, 
    next_execution_date: string
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO recurring_transactions (account_id, category_id, amount, frequency, next_execution_date) VALUES (?, ?, ?, ?, ?)',  
      [account_id, category_id, amount, frequency, next_execution_date],
    );
    return { 
      recurring_id: result.insertId, 
      account_id, 
      category_id, 
      amount, 
      frequency, 
      next_execution_date 
    };
  }

  async findById(recurring_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM recurring_transactions WHERE recurring_id = ?',
      [recurring_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM recurring_transactions',
    );
    return rows;
  }

  async updateRecurringTransaction(
    recurring_id: number, 
    partial: { 
      account_id?: number; 
      category_id?: number; 
      amount?: number; 
      frequency?: string; 
      next_execution_date?: string 
    }
  ) {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (partial.account_id !== undefined) {
      fields.push('account_id = ?');
      values.push(partial.account_id);
    }
    if (partial.category_id !== undefined) {
      fields.push('category_id = ?');
      values.push(partial.category_id);
    }
    if (partial.amount !== undefined) {
      fields.push('amount = ?');
      values.push(partial.amount);
    }
    if (partial.frequency) {
      fields.push('frequency = ?');
      values.push(partial.frequency);
    }
    if (partial.next_execution_date) {
      fields.push('next_execution_date = ?');
      values.push(partial.next_execution_date);
    }

    if (fields.length === 0) return await this.findById(recurring_id);
    
    values.push(recurring_id);
    const sql = `UPDATE recurring_transactions SET ${fields.join(', ')} WHERE recurring_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(recurring_id);
  }

  async deleteRecurringTransaction(recurring_id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM recurring_transactions WHERE recurring_id = ?', [recurring_id]);
    return res.affectedRows > 0;
  }
}