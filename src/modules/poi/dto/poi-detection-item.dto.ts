import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { POI_DETECTION_CLASSES } from '../../../common/constants/index';

export class PoiDetectionItemDto {
  /** 이미지 좌상단 기준 bbox 시작 x (px) */
  @IsInt()
  @Type(() => Number)
  bbox_x: number;

  /** 이미지 좌상단 기준 bbox 시작 y (px) */
  @IsInt()
  @Type(() => Number)
  bbox_y: number;

  @IsInt()
  @Type(() => Number)
  width: number;

  @IsInt()
  @Type(() => Number)
  height: number;

  @IsString()
  @IsIn([...POI_DETECTION_CLASSES])
  detection_class: string;

  /** reference_poi 매칭 시 사용 (선택) */
  @IsOptional()
  @IsString()
  reference_poi_id?: string;
}
