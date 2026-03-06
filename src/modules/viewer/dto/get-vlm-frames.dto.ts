import { IsNumber, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

/** GET /viewer/vlm-frames - bbox 내 VLM Frame 목록 (줌인 시 맵 표시용) */
export class GetVlmFramesDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (typeof value === 'string' ? parseFloat(value) : value))
  @Type(() => Number)
  minLon?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (typeof value === 'string' ? parseFloat(value) : value))
  @Type(() => Number)
  minLat?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (typeof value === 'string' ? parseFloat(value) : value))
  @Type(() => Number)
  maxLon?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (typeof value === 'string' ? parseFloat(value) : value))
  @Type(() => Number)
  maxLat?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (typeof value === 'string' ? parseInt(value, 10) : value))
  @Type(() => Number)
  limit?: number;
}
