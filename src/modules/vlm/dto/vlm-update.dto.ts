import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VlmUpdateItemDto } from './vlm-update-item.dto';

/**
 * POST /vlm/update - VLM 추론 결과 저장
 * vlm_frame_id 기준으로 vlm_poi 1건 저장 (5종 문제 유형)
 * MapMatching 결과로 link_id 전달 시 vlm_frame.link_id 업데이트
 */
export class VlmUpdateDto {
  @IsString()
  @IsNotEmpty()
  vlm_frame_id: string;

  /** MapMatching 결과 (선택) - 있으면 vlm_frame.link_id 업데이트 */
  @IsOptional()
  @IsString()
  link_id?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => VlmUpdateItemDto)
  veg_encroachment?: VlmUpdateItemDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => VlmUpdateItemDto)
  soil_subsidence?: VlmUpdateItemDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => VlmUpdateItemDto)
  guardrail_damage?: VlmUpdateItemDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => VlmUpdateItemDto)
  lane_damage?: VlmUpdateItemDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => VlmUpdateItemDto)
  sign_damage?: VlmUpdateItemDto;
}
