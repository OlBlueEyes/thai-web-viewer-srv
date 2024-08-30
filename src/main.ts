import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3000);

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on port: ${port}`);
}
bootstrap();
