import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/** POST /poi/training/frame - 학습용 Frame (10m 주기) */
export class PoiTrainingFrameDto {
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
