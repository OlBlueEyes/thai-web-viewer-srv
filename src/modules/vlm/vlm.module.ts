import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VlmController } from './vlm.controller';
import { VlmService } from './vlm.service';
import { ThaiVlmFrame } from '../../shared/entities/vlm-frame.entity';
import { ThaiVlmPoi } from '../../shared/entities/vlm-poi.entity';
import { ThaiTrainingFrame } from '../../shared/entities/training-frame.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ThaiVlmFrame,
      ThaiVlmPoi,
      ThaiTrainingFrame,
    ]),
  ],
  controllers: [VlmController],
  providers: [VlmService],
  exports: [VlmService],
})
export class VlmModule {}
