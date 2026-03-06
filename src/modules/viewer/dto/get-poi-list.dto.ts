import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/** GET /viewer/poi/list - bbox 또는 time 범위로 POI 목록 (맵 표시용) */
export class GetPoiListDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minLon?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minLat?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxLon?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxLat?: number;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  detection_class?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number;
}
