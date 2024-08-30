import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(TypeOrmConfigService.name);

  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const options: TypeOrmModuleOptions = {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: Number(this.configService.get<number>('DB_PORT')),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      entities:
        process.env.NODE_ENV === 'prod'
          ? [__dirname + '/../dist/**/*.entity.{js,ts}']
          : [__dirname + '/../src/**/*.entity.{js,ts}'],
      synchronize: false,
    };

    console.log(process.env.NODE_ENV);

    this.testDatabaseConnection(options);

    return options;
  }

  private async testDatabaseConnection(options: TypeOrmModuleOptions): Promise<void> {
    const dataSource = new DataSource(options as DataSourceOptions);

    try {
      await dataSource.initialize();
      this.logger.log('Database connection established successfully');
    } catch (error) {
      this.logger.error('Failed to connect to the database', error.stack);
      throw new Error('Failed to connect to the database');
    } finally {
      await dataSource.destroy();
    }
  }
}
