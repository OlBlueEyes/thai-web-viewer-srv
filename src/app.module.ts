import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';
import { ViewerModule } from './modules/viewer/viewer.module';
import { PoiModule } from './modules/poi/poi.module';
import { VlmModule } from './modules/vlm/vlm.module';
import { HealthModule } from './modules/health/health.module';

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
    HealthModule,
    PoiModule,
    VlmModule,
    ViewerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
