import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import responseSuccess from '../../common/utils/response-success';

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async check() {
    let dbStatus = 'unknown';
    try {
      await this.dataSource.query('SELECT 1');
      dbStatus = 'up';
    } catch {
      dbStatus = 'down';
    }

    return responseSuccess({
      status: 'ok',
      timestamp: new Date().toISOString(),
      db: dbStatus,
    });
  }
}
