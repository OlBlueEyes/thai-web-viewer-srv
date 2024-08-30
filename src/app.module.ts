import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';

const envFilePath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'local'}`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [envFilePath],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
