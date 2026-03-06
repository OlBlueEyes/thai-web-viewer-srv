import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PoiDetectionItemDto } from './poi-detection-item.dto';

/** POST /poi/detection - Frame 메타 (GPS 등) */
export class PoiDetectionFrameDto {
  /** 경도 (WGS84) */
  @IsNumber()
  @Type(() => Number)
  lon: number;

  /** 위도 (WGS84) */
  @IsNumber()
  @Type(() => Number)
  lat: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  altitude?: number;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  sensor_time?: string;

  /** 이미지 파일 상대 경로 */
  @IsNotEmpty()
  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  equipment_serial?: string;

  @IsOptional()
  @IsString()
  detection_model?: string;
}

export class PoiDetectionDto {
  @ValidateNested()
  @Type(() => PoiDetectionFrameDto)
  frame: PoiDetectionFrameDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PoiDetectionItemDto)
  detections: PoiDetectionItemDto[];
}
