import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * POST /vlm/frame - VLM Frame 수신 (10m 주기)
 * 서비스용 vlm_frame + 학습용 training_frame 동시 저장
 */
export class VlmFrameDto {
  @IsNumber()
  @Type(() => Number)
  lon: number;

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

  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  equipment_serial?: string;
}
