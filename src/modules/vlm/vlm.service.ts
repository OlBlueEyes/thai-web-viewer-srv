import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import responseSuccess from '../../common/utils/response-success';
import { throwNotFoundException } from '../../common/utils/throw-bad-request-exception';
import { ThaiVlmFrame } from '../../shared/entities/vlm-frame.entity';
import { ThaiVlmPoi } from '../../shared/entities/vlm-poi.entity';
import { ThaiTrainingFrame } from '../../shared/entities/training-frame.entity';
import { VlmFrameDto } from './dto/vlm-frame.dto';
import { VlmUpdateDto } from './dto/vlm-update.dto';
import { VlmUpdateItemDto } from './dto/vlm-update-item.dto';

const VLM_KEYS = [
  'veg_encroachment',
  'soil_subsidence',
  'guardrail_damage',
  'lane_damage',
  'sign_damage',
] as const;

type VlmKey = (typeof VLM_KEYS)[number];

function toDbKey(key: VlmKey): {
  is: keyof ThaiVlmPoi;
  desc: keyof ThaiVlmPoi;
  bbox: keyof ThaiVlmPoi;
} {
  const prefix = key.replace(/_([a-z])/g, (_, c) => `_${c}`); // snake stays
  return {
    is: `is_${key}` as keyof ThaiVlmPoi,
    desc: `desc_${key}` as keyof ThaiVlmPoi,
    bbox: `bbox_${key}` as keyof ThaiVlmPoi,
  };
}

@Injectable()
export class VlmService {
  private readonly logger = new Logger(VlmService.name);

  constructor(
    @InjectRepository(ThaiVlmFrame)
    private readonly vlmFrameRepository: Repository<ThaiVlmFrame>,
    @InjectRepository(ThaiVlmPoi)
    private readonly vlmPoiRepository: Repository<ThaiVlmPoi>,
    @InjectRepository(ThaiTrainingFrame)
    private readonly trainingFrameRepository: Repository<ThaiTrainingFrame>,
  ) {}

  /**
   * VLM Frame 수신 (10m 주기) - vlm_frame + training_frame 동시 저장
   */
  async receiveFrame(dto: VlmFrameDto) {
    const geom = {
      type: 'Point',
      coordinates: [dto.lon, dto.lat],
    };

    const vlmFrame = this.vlmFrameRepository.create({
      geom,
      altitude: dto.altitude ?? null,
      time: dto.time ? new Date(dto.time) : null,
      sensor_time: dto.sensor_time ? new Date(dto.sensor_time) : null,
      path: dto.path,
      equipment_serial: dto.equipment_serial ?? null,
      link_id: null,
    });
    const savedVlmFrame = await this.vlmFrameRepository.save(vlmFrame);

    const trainingFrame = this.trainingFrameRepository.create({
      geom,
      altitude: dto.altitude ?? null,
      time: dto.time ? new Date(dto.time) : null,
      sensor_time: dto.sensor_time ? new Date(dto.sensor_time) : null,
      path: dto.path,
      equipment_serial: dto.equipment_serial ?? null,
    });
    await this.trainingFrameRepository.save(trainingFrame);

    this.logger.log(
      `VLM frame saved: vlm_frame_id=${savedVlmFrame.id}, training_frame saved`,
    );

    return responseSuccess({
      vlm_frame_id: savedVlmFrame.id,
    });
  }

  /**
   * VLM 추론 결과 저장 + 선택적으로 vlm_frame.link_id 업데이트 (MapMatching 결과)
   */
  async updateResult(dto: VlmUpdateDto) {
    const frame = await this.vlmFrameRepository.findOne({
      where: { id: dto.vlm_frame_id },
    });
    if (!frame) {
      throwNotFoundException(`vlm_frame id ${dto.vlm_frame_id} not found`);
    }

    if (dto.link_id != null && dto.link_id !== '') {
      await this.vlmFrameRepository.update(
        { id: dto.vlm_frame_id },
        { link_id: dto.link_id },
      );
      this.logger.log(
        `vlm_frame ${dto.vlm_frame_id} link_id updated to ${dto.link_id}`,
      );
    }

    const raw: Record<string, unknown> = {
      vlm_frame_id: dto.vlm_frame_id,
    };

    for (const key of VLM_KEYS) {
      const item = dto[key] as VlmUpdateItemDto | undefined;
      const { is: isKey, desc: descKey, bbox: bboxKey } = toDbKey(key);
      if (item) {
        raw[isKey] = item.is_detected ?? false;
        raw[descKey] = item.is_detected && item.desc ? item.desc : null;
        raw[bboxKey] =
          item.is_detected && item.bbox
            ? {
                x1: item.bbox.x1,
                y1: item.bbox.y1,
                x2: item.bbox.x2,
                y2: item.bbox.y2,
              }
            : null;
      } else {
        raw[isKey] = false;
        raw[descKey] = null;
        raw[bboxKey] = null;
      }
    }

    const vlmPoi = this.vlmPoiRepository.create(raw as Partial<ThaiVlmPoi>);
    const saved = await this.vlmPoiRepository.save(vlmPoi);

    this.logger.log(`VLM poi saved: id=${saved.id}, vlm_frame_id=${dto.vlm_frame_id}`);

    return responseSuccess({
      vlm_poi_id: saved.id,
      vlm_frame_id: dto.vlm_frame_id,
      link_id_updated: dto.link_id != null && dto.link_id !== '',
    });
  }

  /**
   * VLM Frame link_id만 업데이트 (MapMatching 결과 반영)
   */
  async updateFrameLink(vlmFrameId: string, linkId: string) {
    const frame = await this.vlmFrameRepository.findOne({
      where: { id: vlmFrameId },
    });
    if (!frame) {
      throwNotFoundException(`vlm_frame id ${vlmFrameId} not found`);
    }
    await this.vlmFrameRepository.update(
      { id: vlmFrameId },
      { link_id: linkId },
    );
    this.logger.log(`vlm_frame ${vlmFrameId} link_id updated to ${linkId}`);
    return responseSuccess({
      vlm_frame_id: vlmFrameId,
      link_id: linkId,
    });
  }
}
