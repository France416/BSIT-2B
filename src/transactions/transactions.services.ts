import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class TransactionsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createTransactions(accountId: number, categoryId: number, amount: number, notes: string) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO transactions (account_id, category_id, amount, notes) VALUES (?, ?, ?, ?)',  
      [accountId, categoryId, amount, notes || null],
    );
    return { transaction_id: result.insertId, accountId, categoryId, amount, notes };
  }

  async findById(transactionId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT transaction_id, account_id, category_id, amount, notes, refresh_token, created_at, updated_at FROM transactions WHERE transaction_id = ?',
      [transactionId],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM transactions',
    );
    return rows;
  }

  async updateUser(transactionId: number, partial: { account_id?: number; category_id?: number; amount?: number; notes?: string }) {
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
    if (partial.notes !== undefined) {
      fields.push('notes = ?');
      values.push(partial.notes);
    }

    if (fields.length === 0) return await this.findById(transactionId);
    values.push(transactionId);
    const sql = `UPDATE transactions SET ${fields.join(', ')} WHERE transaction_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(transactionId);
  }

  async deleteTransactions(transactionId: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM transactions WHERE transaction_id = ?', [transactionId]);
    return res.affectedRows > 0;
  }

  async setRefreshToken(transactionId: number, refreshToken: string | null) {
    await this.pool().execute(
      'UPDATE transactions SET refresh_token = ? WHERE transaction_id = ?', 
      [refreshToken, transactionId]
    );
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT transaction_id, account_id, category_id, amount, notes, refresh_token FROM transactions WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}