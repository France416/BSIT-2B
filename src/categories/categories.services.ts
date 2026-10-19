import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CategoriesService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createCategories(category_name: string, category_type: string, account_id: string = 'categories') {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO categories (category_name, category_type, account_id) VALUES (?, ?, ?)',  
      [category_name, category_type, account_id],
    );
    return { id: result.insertId, category_name, account_id };
  }

  async findBycategory_name(category_name: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT category_id, category_name, category_type, account_id, refresh_token FROM categories WHERE category_name = ?',
      [category_name],
    );
    return rows[0];
  }

  async findById(category_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM categories WHERE category_id = ?',
      [category_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM categories',
    );
    return rows;
  }

  async updateCategories(category_id: number, partial: { category_name?: string; category_type?: string; account_id?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    if (partial.category_name) {
      fields.push('category_name = ?');
      values.push(partial.category_name);
    }
    if (partial.category_type) {
      fields.push('category_type = ?');
      values.push(partial.category_type);
    }
    if (partial.account_id) {
      fields.push('account_id = ?');
      values.push(partial.account_id);
    }

    if (fields.length === 0) return await this.findById(category_id);
    values.push(category_id);
    const sql = `UPDATE categories SET ${fields.join(', ')} WHERE category_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(category_id);
  }

  async deleteCategories(category_id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM categories WHERE category_id = ?', [category_id]);
    return res.affectedRows > 0;
  }

  async setRefreshToken(category_id: number, refreshToken: string | null) {
    await this.pool().execute('UPDATE categories SET refresh_token = ? WHERE category_id = ?', [refreshToken, category_id]);
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT category_id, category_name, category_type, account_id FROM categories WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}