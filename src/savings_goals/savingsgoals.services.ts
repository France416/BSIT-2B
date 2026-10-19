
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class SavingsGoalsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  // Get all savings goals
  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM savings_goals',
    );

    return rows;
  }

  // Get one savings goal by ID
  async findById(goal_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM savings_goals WHERE goal_id = ?',
      [goal_id],
    );

    if (rows.length === 0) {
      throw new NotFoundException('Savings goal not found');
    }

    return rows[0];
  }

  // Create a savings goal
  async createGoal(
    user_id: number,
    goal_name: string,
    target_amount: number,
    current_amount?: number,
    target_date?: string,
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      `INSERT INTO savings_goals
       (user_id, goal_name, target_amount, current_amount, target_date)
       VALUES (?, ?, ?, ?, ?)`,
      [
        user_id,
        goal_name,
        target_amount,
        current_amount ?? 0,
        target_date ?? null,
      ],
    );

    return {
      goal_id: result.insertId,
      user_id,
      goal_name,
      target_amount,
      current_amount: current_amount ?? 0,
      target_date: target_date ?? null,
    };
  }

  // Update a savings goal
  async updateGoal(
    goal_id: number,
    partial: {
      goal_name?: string;
      target_amount?: number;
      current_amount?: number;
      target_date?: string | null;
    },
  ) {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (partial.goal_name !== undefined) {
      fields.push('goal_name = ?');
      values.push(partial.goal_name);
    }

    if (partial.target_amount !== undefined) {
      fields.push('target_amount = ?');
      values.push(partial.target_amount);
    }

    if (partial.current_amount !== undefined) {
      fields.push('current_amount = ?');
      values.push(partial.current_amount);
    }

    if (partial.target_date !== undefined) {
      fields.push('target_date = ?');
      values.push(partial.target_date);
    }

    if (fields.length === 0) {
      return this.findById(goal_id);
    }

    values.push(goal_id);

    await this.pool().execute(
      `UPDATE savings_goals
       SET ${fields.join(', ')}
       WHERE goal_id = ?`,
      values,
    );

    return this.findById(goal_id);
  }

  // Delete a savings goal
  async deleteGoal(goal_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM savings_goals WHERE goal_id = ?',
      [goal_id],
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException('Savings goal not found');
    }

    return {
      message: 'Savings goal deleted successfully',
    };
  }
}
