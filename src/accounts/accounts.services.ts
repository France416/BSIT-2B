import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class AccountsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createAccounts(account_name: string, account_type: string, current_balance: string, id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO accounts (account_name, account_type, current_balance, id) VALUES (?, ?, ?, ?)',  
      [account_name, account_type, current_balance, id],
    );
    return { account_id: result.insertId, account_name, account_type, current_balance, id };
  }

  async findById(account_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT account_id, account_name, account_type, current_balance, id, created_at FROM accounts WHERE account_id = ?',
      [account_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT account_id, account_name, account_type, current_balance, id, created_at FROM accounts',
    );
    return rows;
  }

  async updateAccount(account_id: number, partial: { account_name?: string; account_type?: string; current_balance?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    if (partial.account_name) {
      fields.push('account_name = ?');
      values.push(partial.account_name);
    }
    if (partial.account_type) {
      fields.push('account_type = ?');
      values.push(partial.account_type);
    }
    if (partial.current_balance) {
      fields.push('current_balance = ?');
      values.push(partial.current_balance);
    }

    if (fields.length === 0) return await this.findById(account_id);
    values.push(account_id);
    const sql = `UPDATE accounts SET ${fields.join(', ')} WHERE account_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(account_id);
  }

  async deleteAccounts(account_id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM accounts WHERE account_id = ?', [account_id]);
    return res.affectedRows > 0;
  }
}