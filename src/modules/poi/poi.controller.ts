import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PoiService } from './poi.service';
import { PoiDetectionDto } from './dto/poi-detection.dto';
import { PoiTrainingFrameDto } from './dto/poi-training-frame.dto';

@Controller('poi')
export class PoiController {
  constructor(private readonly poiService: PoiService) {}

  /**
   * POI Detection 서비스 데이터 수신 (이벤트 기반)
   * Body: { frame: { lon, lat, ... }, detections: [ { bbox_x, bbox_y, width, height, detection_class }, ... ] }
   */
  @Post('detection')
  @HttpCode(200)
  async receiveDetection(@Body() dto: PoiDetectionDto) {
    return this.poiService.receiveDetection(dto);
  }

  /**
   * POI 학습용 Frame 수신 (10m 주기) - training_frame에만 저장
   */
  @Post('training/frame')
  @HttpCode(200)
  async receiveTrainingFrame(@Body() dto: PoiTrainingFrameDto) {
    return this.poiService.receiveTrainingFrame(dto);
  }
}
