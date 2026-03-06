import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewerController } from './viewer.controller';
import { ViewerService } from './viewer.service';
import { ThaiFrame } from '../../shared/entities/frame.entity';
import { ThaiPoi } from '../../shared/entities/poi.entity';
import { ThaiReferencePoi } from '../../shared/entities/reference-poi.entity';
import { ThaiVlmFrame } from '../../shared/entities/vlm-frame.entity';
import { ThaiVlmPoi } from '../../shared/entities/vlm-poi.entity';
import { ThaiLink } from '../../shared/entities/link.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ThaiPoi,
      ThaiFrame,
      ThaiReferencePoi,
      ThaiVlmFrame,
      ThaiVlmPoi,
      ThaiLink,
    ]),
  ],
  controllers: [ViewerController],
  providers: [ViewerService],
  exports: [ViewerService],
})
export class ViewerModule {}
