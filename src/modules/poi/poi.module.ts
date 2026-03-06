import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoiController } from './poi.controller';
import { PoiService } from './poi.service';
import { ThaiFrame } from '../../shared/entities/frame.entity';
import { ThaiPoi } from '../../shared/entities/poi.entity';
import { ThaiTrainingFrame } from '../../shared/entities/training-frame.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ThaiFrame,
      ThaiPoi,
      ThaiTrainingFrame,
    ]),
  ],
  controllers: [PoiController],
  providers: [PoiService],
  exports: [PoiService],
})
export class PoiModule {}
