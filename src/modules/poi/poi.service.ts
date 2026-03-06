import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import responseSuccess from '../../common/utils/response-success';
import { throwBadRequestException } from '../../common/utils/throw-bad-request-exception';
import { ThaiFrame } from '../../shared/entities/frame.entity';
import { ThaiPoi } from '../../shared/entities/poi.entity';
import { ThaiTrainingFrame } from '../../shared/entities/training-frame.entity';
import { PoiDetectionDto } from './dto/poi-detection.dto';
import { PoiTrainingFrameDto } from './dto/poi-training-frame.dto';

@Injectable()
export class PoiService {
  private readonly logger = new Logger(PoiService.name);

  constructor(
    @InjectRepository(ThaiFrame)
    private readonly frameRepository: Repository<ThaiFrame>,
    @InjectRepository(ThaiPoi)
    private readonly poiRepository: Repository<ThaiPoi>,
    @InjectRepository(ThaiTrainingFrame)
    private readonly trainingFrameRepository: Repository<ThaiTrainingFrame>,
  ) {}

  /**
   * POI Detection 서비스 데이터 수신 (이벤트 기반)
   * frame 저장 후 각 detection을 poi로 저장
   */
  async receiveDetection(dto: PoiDetectionDto) {
    const { frame: frameDto, detections } = dto;
    if (!detections || detections.length === 0) {
      throwBadRequestException('detections must not be empty');
    }

    const geom = {
      type: 'Point',
      coordinates: [frameDto.lon, frameDto.lat],
    };

    const frame = this.frameRepository.create({
      geom,
      altitude: frameDto.altitude ?? null,
      time: frameDto.time ? new Date(frameDto.time) : null,
      sensor_time: frameDto.sensor_time ? new Date(frameDto.sensor_time) : null,
      path: frameDto.path,
      equipment_serial: frameDto.equipment_serial ?? null,
      detection_model: frameDto.detection_model ?? null,
    });
    const savedFrame = await this.frameRepository.save(frame);

    const pois: ThaiPoi[] = [];
    for (const d of detections) {
      const poi = this.poiRepository.create({
        geom,
        altitude: frameDto.altitude ?? null,
        time: frameDto.time ? new Date(frameDto.time) : null,
        sensor_time: frameDto.sensor_time ? new Date(frameDto.sensor_time) : null,
        bbox_x: d.bbox_x,
        bbox_y: d.bbox_y,
        width: d.width,
        height: d.height,
        reference_poi_id: d.reference_poi_id ?? null,
        frame_id: savedFrame.id,
      });
      pois.push(await this.poiRepository.save(poi));
    }

    this.logger.log(
      `POI detection saved: frame_id=${savedFrame.id}, pois=${pois.length}`,
    );

    return responseSuccess({
      frame_id: savedFrame.id,
      poi_ids: pois.map((p) => p.id),
      count: pois.length,
    });
  }

  /**
   * POI 학습용 Frame 수신 (10m 주기) - training_frame에만 저장
   */
  async receiveTrainingFrame(dto: PoiTrainingFrameDto) {
    const geom = {
      type: 'Point',
      coordinates: [dto.lon, dto.lat],
    };

    const trainingFrame = this.trainingFrameRepository.create({
      geom,
      altitude: dto.altitude ?? null,
      time: dto.time ? new Date(dto.time) : null,
      sensor_time: dto.sensor_time ? new Date(dto.sensor_time) : null,
      path: dto.path,
      equipment_serial: dto.equipment_serial ?? null,
    });
    const saved = await this.trainingFrameRepository.save(trainingFrame);

    this.logger.log(`POI training frame saved: id=${saved.id}`);

    return responseSuccess({
      id: saved.id,
    });
  }
}
