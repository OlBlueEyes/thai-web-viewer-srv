import { IsBoolean, IsObject, IsOptional, IsString, ValidateIf } from 'class-validator';

/** bbox: { x1, y1, x2, y2 } (pixel) */
export class VlmBboxDto {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** 문제 유형 1종 (is_*, desc_*, bbox_*) */
export class VlmUpdateItemDto {
  @IsBoolean()
  is_detected: boolean;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.is_detected === true)
  desc?: string;

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.is_detected === true)
  bbox?: VlmBboxDto;
}
