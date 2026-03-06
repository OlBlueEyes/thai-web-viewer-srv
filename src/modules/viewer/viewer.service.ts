import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import responseSuccess from '../../common/utils/response-success';
import { throwBadRequestException, throwNotFoundException } from '../../common/utils/throw-bad-request-exception';
import { ThaiFrame } from '../../shared/entities/frame.entity';
import { ThaiPoi } from '../../shared/entities/poi.entity';
import { ThaiReferencePoi } from '../../shared/entities/reference-poi.entity';
import { ThaiVlmFrame } from '../../shared/entities/vlm-frame.entity';
import { ThaiVlmPoi } from '../../shared/entities/vlm-poi.entity';
import { ThaiLink } from '../../shared/entities/link.entity';
import { POI_DETECTION_CLASSES, VLM_DETECTION_CLASSES, SERVICE_DATA_PATH } from '../../common/constants/index';
import { GetPoiDetailDto } from './dto/get-poi-detail.dto';
import { GetLinkVlmDto } from './dto/get-link-vlm.dto';
import { GetPoiListDto } from './dto/get-poi-list.dto';
import { GetLinksDto } from './dto/get-links.dto';
import { GetVlmFramesDto } from './dto/get-vlm-frames.dto';

@Injectable()
export class ViewerService {
  private readonly logger = new Logger(ViewerService.name);
  private readonly fileServerPath: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ThaiPoi)
    private readonly poiRepository: Repository<ThaiPoi>,
    @InjectRepository(ThaiFrame)
    private readonly frameRepository: Repository<ThaiFrame>,
    @InjectRepository(ThaiReferencePoi)
    private readonly referencePoiRepository: Repository<ThaiReferencePoi>,
    @InjectRepository(ThaiVlmFrame)
    private readonly vlmFrameRepository: Repository<ThaiVlmFrame>,
    @InjectRepository(ThaiVlmPoi)
    private readonly vlmPoiRepository: Repository<ThaiVlmPoi>,
    @InjectRepository(ThaiLink)
    private readonly linkRepository: Repository<ThaiLink>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.fileServerPath = this.configService.get<string>('FILE_SERVER_PATH', '');
  }

  /**
   * 개별 POI 조회 (data-align, replica-city-v2 시각화용)
   * POI + 소속 frame 정보 + reference_poi 정보 반환
   */
  async getPoiDetail(dto: GetPoiDetailDto) {
    const { poiId } = dto;

    const poi = await this.poiRepository.findOne({
      where: { id: poiId },
    });
    if (!poi) {
      throwBadRequestException(`POI id ${poiId} not found`);
    }

    const [frame, referencePoi] = await Promise.all([
      poi.frame_id ? this.frameRepository.findOne({ where: { id: poi.frame_id } }) : Promise.resolve(null),
      poi.reference_poi_id
        ? this.referencePoiRepository.findOne({ where: { id: poi.reference_poi_id } })
        : Promise.resolve(null),
    ]);

    const result = {
      poi: {
        id: poi.id,
        geom: poi.geom,
        altitude: poi.altitude,
        time: poi.time,
        sensor_time: poi.sensor_time,
        bbox_x: poi.bbox_x,
        bbox_y: poi.bbox_y,
        width: poi.width,
        height: poi.height,
        detection_class: null,
        reference_poi_id: poi.reference_poi_id,
        frame_id: poi.frame_id,
      },
      frame: frame
        ? {
            id: frame.id,
            geom: frame.geom,
            altitude: frame.altitude,
            time: frame.time,
            sensor_time: frame.sensor_time,
            path: frame.path,
            equipment_serial: frame.equipment_serial,
            detection_model: frame.detection_model,
          }
        : null,
      reference_poi: referencePoi
        ? {
            id: referencePoi.id,
            geom: referencePoi.geom,
            altitude: referencePoi.altitude,
            state: referencePoi.state,
            detection_class: referencePoi.detection_class,
            create_at: referencePoi.create_at,
          }
        : null,
    };

    return responseSuccess(result);
  }

  /**
   * Link 클릭 시 VLM 조회 (replica-city 스타일, Link 단위 시각화)
   * 클릭 위치( lon, lat )와 가장 가까운 vlm_frame 1건 조회 후 해당 vlm_poi 반환
   */
  async getLinkVlm(dto: GetLinkVlmDto) {
    const { link_id, lon, lat } = dto;

    const nearestFrame = await this.vlmFrameRepository
      .createQueryBuilder('vf')
      .select('vf.id', 'id')
      .addSelect('vf.geom', 'geom')
      .addSelect('vf.altitude', 'altitude')
      .addSelect('vf.time', 'time')
      .addSelect('vf.sensor_time', 'sensor_time')
      .addSelect('vf.path', 'path')
      .addSelect('vf.equipment_serial', 'equipment_serial')
      .addSelect('vf.link_id', 'link_id')
      .addSelect('ST_Distance(vf.geom, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326))', 'distance')
      .where('vf.link_id = :link_id', { link_id })
      .setParameters({ lon, lat })
      .orderBy('distance', 'ASC')
      .limit(1)
      .getRawOne();

    if (!nearestFrame) {
      return responseSuccess({
        vlm_frame: null,
        vlm_poi: [],
      });
    }

    const vlmFrameId = nearestFrame.id;
    const vlmPoiList = await this.vlmPoiRepository.find({
      where: { vlm_frame_id: vlmFrameId },
    });

    const vlm_frame = {
      id: nearestFrame.id,
      geom: nearestFrame.geom,
      altitude: nearestFrame.altitude,
      time: nearestFrame.time,
      sensor_time: nearestFrame.sensor_time,
      path: nearestFrame.path,
      equipment_serial: nearestFrame.equipment_serial,
      link_id: nearestFrame.link_id,
    };

    const vlm_poi = vlmPoiList.map((row) => ({
      id: row.id,
      is_veg_encroachment: row.is_veg_encroachment,
      desc_veg_encroachment: row.desc_veg_encroachment,
      bbox_veg_encroachment: row.bbox_veg_encroachment,
      is_soil_subsidence: row.is_soil_subsidence,
      desc_soil_subsidence: row.desc_soil_subsidence,
      bbox_soil_subsidence: row.bbox_soil_subsidence,
      is_guardrail_damage: row.is_guardrail_damage,
      desc_guardrail_damage: row.desc_guardrail_damage,
      bbox_guardrail_damage: row.bbox_guardrail_damage,
      is_lane_damage: row.is_lane_damage,
      desc_lane_damage: row.desc_lane_damage,
      bbox_lane_damage: row.bbox_lane_damage,
      is_sign_damage: row.is_sign_damage,
      desc_sign_damage: row.desc_sign_damage,
      bbox_sign_damage: row.bbox_sign_damage,
      vlm_frame_id: row.vlm_frame_id,
    }));

    return responseSuccess({
      vlm_frame,
      vlm_poi,
    });
  }

  /**
   * POI 목록 조회 (bbox 또는 time 범위) - 맵 표시용
   */
  async getPoiList(dto: GetPoiListDto) {
    const limit = Math.min(dto.limit ?? 500, 2000);
    const offset = dto.offset ?? 0;

    const qb = this.poiRepository
      .createQueryBuilder('p')
      .select(['p.id', 'p.geom', 'p.altitude', 'p.time', 'p.bbox_x', 'p.bbox_y', 'p.width', 'p.height', 'p.frame_id'])
      .orderBy('p.time', 'DESC')
      .take(limit)
      .skip(offset);

    if (dto.minLon != null && dto.minLat != null && dto.maxLon != null && dto.maxLat != null) {
      qb.andWhere('ST_Within(p.geom, ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326))', {
        minLon: dto.minLon,
        minLat: dto.minLat,
        maxLon: dto.maxLon,
        maxLat: dto.maxLat,
      });
    }
    if (dto.startTime) {
      qb.andWhere('p.time >= :startTime', {
        startTime: new Date(dto.startTime),
      });
    }
    if (dto.endTime) {
      qb.andWhere('p.time <= :endTime', {
        endTime: new Date(dto.endTime),
      });
    }

    const [items, total] = await qb.getManyAndCount();

    const frameIds = [...new Set(items.map((p) => p.frame_id).filter(Boolean))] as string[];
    const frames =
      frameIds.length > 0
        ? await this.frameRepository.find({
            where: frameIds.map((id) => ({ id })),
            select: ['id', 'path', 'time'],
          })
        : [];
    const frameMap = new Map(frames.map((f) => [f.id, f]));

    const list = items.map((p) => {
      const frame = p.frame_id ? frameMap.get(p.frame_id) : null;
      return {
        id: p.id,
        geom: p.geom,
        altitude: p.altitude,
        time: p.time,
        detection_class: null,
        bbox_x: p.bbox_x,
        bbox_y: p.bbox_y,
        width: p.width,
        height: p.height,
        frame_id: p.frame_id,
        frame_path: frame?.path ?? null,
        frame_time: frame?.time ?? null,
      };
    });

    return responseSuccess({
      items: list,
      total,
      limit,
      offset,
    });
  }

  /**
   * Link 목록 조회 (VLM 매칭된 링크 옵션) - 맵 표시용
   * JOIN+DISTINCT 시 geometry 타입 비교 오류 방지를 위해 서브쿼리 사용
   */
  async getLinks(dto: GetLinksDto) {
    const limit = Math.min(dto.limit ?? 500, 2000);
    const offset = dto.offset ?? 0;

    const qb = this.linkRepository
      .createQueryBuilder('l')
      .select(['l.id', 'l.geom', 'l.osm_id', 'l.highway', 'l.name_ko', 'l.name_en'])
      .orderBy('l.id', 'ASC')
      .take(limit)
      .skip(offset);

    if (dto.hasVlm === true) {
      const schema = (this.configService.get<string>('DB_SCHEMA') ?? '').replace(/[^a-zA-Z0-9_]/g, '');
      const table = schema ? `"${schema}".vlm_frame` : 'vlm_frame';
      qb.andWhere(`l.id IN (SELECT DISTINCT vf.link_id FROM ${table} vf WHERE vf.link_id IS NOT NULL)`);
    }

    const [items, total] = await qb.getManyAndCount();

    return responseSuccess({
      items,
      total,
      limit,
      offset,
    });
  }

  /**
   * VLM_POI가 있는 링크 구간만 GeoJSON LineString으로 반환 (링크 위 하이라이트용)
   * 실제 검지(is_* = TRUE)가 있는 vlm_frame만 포함.
   * 같은 링크 위에서 연속된 프레임(투영점 간격이 기준 이내)은 하나의 구간으로 묶어
   * "첫 프레임 투영점 ~ 마지막 프레임 투영점" 한 덩어리 링크로 반환 (끊기지 않은 하나의 선).
   * gapThreshold 10% = 보통 10m 간격 프레임이 100m 링크에서도 한 구간으로 묶이도록 함.
   */
  async getLinkVlmPoiSegments() {
    const schema = (this.configService.get<string>('DB_SCHEMA') ?? '').replace(/[^a-zA-Z0-9_]/g, '');
    const prefix = schema ? `"${schema}".` : '';
    const gapThreshold = 0.10; // 연속으로 볼 거리 비율 (10%: 100m 링크 기준 ~10m, 10m 간격 프레임이 끊기지 않도록)
    const sql = `
      WITH points AS (
        SELECT DISTINCT ON (l.id, vf.id)
          l.id AS link_id,
          ST_LineLocatePoint(l.geom, vf.geom) AS fraction
        FROM ${prefix}link l
        INNER JOIN ${prefix}vlm_frame vf ON vf.link_id::text = l.id::text
        INNER JOIN ${prefix}vlm_poi vp ON vp.vlm_frame_id = vf.id
          AND (vp.is_veg_encroachment = TRUE OR vp.is_soil_subsidence = TRUE
               OR vp.is_guardrail_damage = TRUE OR vp.is_lane_damage = TRUE OR vp.is_sign_damage = TRUE)
        WHERE l.geom IS NOT NULL AND ST_GeometryType(l.geom) = 'ST_LineString'
        ORDER BY l.id, vf.id, fraction
      ),
      ordered AS (
        SELECT link_id, fraction,
          CASE WHEN LAG(fraction) OVER (PARTITION BY link_id ORDER BY fraction) IS NULL THEN 1
               WHEN fraction - LAG(fraction) OVER (PARTITION BY link_id ORDER BY fraction) > ${gapThreshold} THEN 1
               ELSE 0 END AS run_start
        FROM points
      ),
      run_ids AS (
        SELECT link_id, fraction, SUM(run_start) OVER (PARTITION BY link_id ORDER BY fraction) AS run_id
        FROM ordered
      ),
      runs AS (
        SELECT link_id, run_id, MIN(fraction) AS min_frac, MAX(fraction) AS max_frac
        FROM run_ids
        GROUP BY link_id, run_id
      )
      SELECT
        r.link_id,
        ST_AsGeoJSON(
          ST_LineSubstring(
            l.geom,
            GREATEST(0, r.min_frac - 0.005),
            LEAST(1, r.max_frac + 0.005)
          )
        )::json AS segment_geom
      FROM runs r
      INNER JOIN ${prefix}link l ON l.id = r.link_id
      WHERE l.geom IS NOT NULL AND ST_GeometryType(l.geom) = 'ST_LineString'
    `;
    const rows = (await this.dataSource.query(sql)) as Array<{
      link_id: string;
      segment_geom: { type: string; coordinates: number[][] };
    }>;
    const features = rows.map((row) => ({
      type: 'Feature',
      geometry: row.segment_geom,
      properties: { link_id: row.link_id },
    }));
    return responseSuccess({ type: 'FeatureCollection', features });
  }

  /**
   * bbox 내 VLM Frame 목록 GeoJSON (줌인 시 맵에 모든 프레임 표시용)
   */
  async getVlmFrames(dto: GetVlmFramesDto) {
    const limit = Math.min(dto.limit ?? 2000, 5000);
    const qb = this.vlmFrameRepository
      .createQueryBuilder('vf')
      .select('vf.id', 'id')
      .addSelect('vf.geom', 'geom')
      .addSelect('vf.link_id', 'link_id')
      .where('vf.geom IS NOT NULL')
      .andWhere('vf.link_id IS NOT NULL');

    if (dto.minLon != null && dto.minLat != null && dto.maxLon != null && dto.maxLat != null) {
      qb.andWhere('ST_Within(vf.geom, ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326))', {
        minLon: dto.minLon,
        minLat: dto.minLat,
        maxLon: dto.maxLon,
        maxLat: dto.maxLat,
      });
    }

    const rows = await qb.orderBy('vf.id', 'ASC').limit(limit).getRawMany();

    const features = (
      rows as Array<{ id: string; geom: { type: string; coordinates: number[] }; link_id: string }>
    ).map((row) => ({
      type: 'Feature',
      geometry: row.geom,
      properties: { id: row.id, link_id: row.link_id },
    }));
    return responseSuccess({ type: 'FeatureCollection', features });
  }

  /**
   * Frame 이미지 스트리밍 (POI 뷰어용)
   */
  async getFrameImage(frameId: string, res: Response): Promise<void> {
    const frame = await this.frameRepository.findOne({
      where: { id: frameId },
      select: ['id', 'path'],
    });
    if (!frame) {
      throwNotFoundException(`Frame id ${frameId} not found`);
    }
    if (!frame.path) {
      throwBadRequestException(`Frame ${frameId} has no path`);
    }
    const fullPath = path.join(this.fileServerPath, SERVICE_DATA_PATH, frame.path);
    if (!fs.existsSync(fullPath)) {
      throwNotFoundException(`Image file not found: ${frame.path}`);
    }
    const stream = fs.createReadStream(fullPath);
    stream.pipe(res);
  }

  /**
   * VLM Frame 이미지 스트리밍
   */
  async getVlmFrameImage(vlmFrameId: string, res: Response): Promise<void> {
    const vlmFrame = await this.vlmFrameRepository.findOne({
      where: { id: vlmFrameId },
      select: ['id', 'path'],
    });
    if (!vlmFrame) {
      throwNotFoundException(`VLM Frame id ${vlmFrameId} not found`);
    }
    if (!vlmFrame.path) {
      throwBadRequestException(`VLM Frame ${vlmFrameId} has no path`);
    }
    const fullPath = path.join(this.fileServerPath, SERVICE_DATA_PATH, vlmFrame.path);
    if (!fs.existsSync(fullPath)) {
      throwNotFoundException(`Image file not found: ${vlmFrame.path}`);
    }
    const stream = fs.createReadStream(fullPath);
    stream.pipe(res);
  }

  /**
   * POI Detection Class 목록 (문서 7.1)
   */
  getDetectionClassesPoi() {
    return responseSuccess({
      classes: [...POI_DETECTION_CLASSES],
    });
  }

  /**
   * VLM Detection Class 목록 (문서 7.2)
   */
  getDetectionClassesVlm() {
    return responseSuccess({
      classes: [...VLM_DETECTION_CLASSES],
    });
  }
}
